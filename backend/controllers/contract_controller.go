package controllers

import (
	"backend/models"
	"backend/utils"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// GetProductContracts returns all contracts for a specific product
func GetProductContracts(c *gin.Context) {
	productID := c.Param("id")
	userID, _ := c.Get("user_id")

	// Check permissions
	var contracts []models.OwnerContract
	query := db.Where("product_id = ?", productID)

	// Admin sees everything, others see only their own contracts
	role, _ := c.Get("role")
	if role != "admin" {
		query = query.Where("owner_id = ? OR previous_owner_id = ?", userID, userID)
	}

	if err := query.Order("created_at desc").Find(&contracts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contracts"})
		return
	}

	c.JSON(http.StatusOK, contracts)
}

// GetContractPDF serves the PDF file for a specific contract
func GetContractPDF(c *gin.Context) {
	contractID := c.Param("id")
	userID, _ := c.Get("user_id")

	var contract models.OwnerContract
	if err := db.First(&contract, contractID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Check permissions
	role, _ := c.Get("role")
	if role != "admin" && contract.OwnerID != userID.(uint) && contract.PreviousOwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to view this contract"})
		return
	}

	// Check if file exists
	if _, err := os.Stat(contract.PDFPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "PDF file not found"})
		return
	}

	// Serve the file
	c.FileAttachment(contract.PDFPath, filepath.Base(contract.PDFPath))
}

// RegenerateContractPDF recreates the PDF for a contract (useful if the PDF is missing)
func RegenerateContractPDF(c *gin.Context) {
	contractID := c.Param("id")
	userID, _ := c.Get("user_id")

	var contract models.OwnerContract
	if err := db.First(&contract, contractID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contract not found"})
		return
	}

	// Check permissions
	role, _ := c.Get("role")
	if role != "admin" && contract.OwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the contract owner or an admin can regenerate it"})
		return
	}

	// Parse contract data
	var contractData utils.ContractData
	if err := json.Unmarshal([]byte(contract.DocumentData), &contractData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse contract data"})
		return
	}

	// Create PDF directory if it doesn't exist
	pdfDir := filepath.Join(".", "contracts")
	if err := os.MkdirAll(pdfDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create contracts directory"})
		return
	}

	// Generate PDF filename
	pdfPath := filepath.Join(pdfDir, contract.ContractNumber+".pdf")

	// Generate PDF
	if err := utils.GenerateContractPDF(pdfPath, contractData, contract.ContractHash); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate PDF"})
		return
	}

	// Update contract record
	contract.PDFPath = pdfPath
	if err := db.Save(&contract).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contract record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "PDF regenerated successfully"})
}
