package utils

import (
	"backend/models"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/jung-kurt/gofpdf"
	"gorm.io/gorm"
)

// ContractData holds all the information needed for a contract
type ContractData struct {
	ProductID         uint      `json:"product_id"`
	ProductSerial     string    `json:"product_serial"`
	Manufacturer      string    `json:"manufacturer"`
	Model             string    `json:"model"`
	OwnerID           uint      `json:"owner_id"`
	OwnerUsername     string    `json:"owner_username"`
	PreviousOwnerID   uint      `json:"previous_owner_id,omitempty"`
	PreviousOwnerName string    `json:"previous_owner_name,omitempty"`
	TransferDate      time.Time `json:"transfer_date"`
	ContractNumber    string    `json:"contract_number"`
	IssuedAt          time.Time `json:"issued_at"`
	QRCodeURL         string    `json:"qr_code_url"`
}

func GenerateOwnerContract(db *gorm.DB, productID, ownerID, previousOwnerID uint) (*models.OwnerContract, error) {
	var product models.Product
	if err := db.First(&product, productID).Error; err != nil {
		return nil, fmt.Errorf("product not found: %w", err)
	}

	// get owner details
	var owner models.User
	if err := db.First(&owner, ownerID).Error; err != nil {
		return nil, fmt.Errorf("owner not found: %w", err)
	}

	// Generate contract number
	contractNumber := fmt.Sprintf("VO-%d-%d-%s", productID, ownerID, time.Now().Format("20060102-150405"))

	contractData := ContractData{
		ProductID:      productID,
		ProductSerial:  product.SerialNumber,
		Manufacturer:   product.Manufacturer,
		Model:          product.ProductModel,
		OwnerID:        ownerID,
		OwnerUsername:  owner.Username,
		TransferDate:   time.Now(),
		ContractNumber: contractNumber,
		IssuedAt:       time.Now(),
		QRCodeURL:      fmt.Sprintf("https://localhost:5173/verify/%d", productID),
	}

	jsonData, err := json.Marshal(contractData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal contract data: %w", err)
	}

	hash := sha256.Sum256(jsonData)
	contractHash := hex.EncodeToString(hash[:])

	pdfDir := filepath.Join(".", "contracts")
	if err := os.MkdirAll(pdfDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create contracts directory: %w", err)
	}

	// Generate PDF filename
	pdfPath := filepath.Join(pdfDir, contractNumber+".pdf")

	// Generate PDF
	if err := GenerateContractPDF(pdfPath, contractData, contractHash); err != nil {
		return nil, fmt.Errorf("failed to generate PDF: %w", err)
	}

	// Upload to IPFS
	cid, err := UploadToIPFS(pdfPath)
	if err != nil {
		return nil, fmt.Errorf("failed to upload to IPFS: %w", err)
	}

	// Create the contract record with IPFS CID
	contract := &models.OwnerContract{
		ProductID:       productID,
		OwnerID:         ownerID,
		ContractHash:    contractHash,
		PreviousOwnerID: previousOwnerID,
		TransferDate:    contractData.TransferDate,
		DocumentData:    string(jsonData),
		ContractNumber:  contractData.ContractNumber,
		PDFPath:         pdfPath, // Keep local path for backup
		IPFSCID:         cid,     // Store IPFS hash
		IsEncrypted:     false,   // Not encrypted in this implementation
	}

	// Save to database
	if err := db.Create(contract).Error; err != nil {
		return nil, fmt.Errorf("failed to save contract: %w", err)
	}

	// Optionally, remove local file after successful upload
	// os.Remove(pdfPath)

	return contract, nil
}

func GenerateContractPDF(filePath string, data ContractData, contractHash string) error {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// Set font
	pdf.SetFont("Arial", "B", 16)

	// Title
	pdf.Cell(190, 10, "VeriOwn Ownership Certificate")

	pdf.Ln(15)
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(190, 10, "Certificate #: "+data.ContractNumber)

	pdf.Ln(10)
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(190, 10, "Issue Date: "+data.IssuedAt.Format("January 2, 2006 15:04:05"))

	// Product information
	pdf.Ln(15)
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(190, 10, "PRODUCT INFORMATION")
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 10)
	pdf.Cell(50, 10, "Serial Number:")
	pdf.Cell(140, 10, data.ProductSerial)
	pdf.Ln(10)

	pdf.Cell(50, 10, "Manufacturer:")
	pdf.Cell(140, 10, data.Manufacturer)
	pdf.Ln(10)

	pdf.Cell(50, 10, "Model:")
	pdf.Cell(140, 10, data.Model)
	pdf.Ln(10)

	// Owner information
	pdf.Ln(10)
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(190, 10, "OWNERSHIP INFORMATION")
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 10)
	pdf.Cell(50, 10, "Current Owner:")
	pdf.Cell(140, 10, data.OwnerUsername)
	pdf.Ln(10)

	pdf.Cell(50, 10, "Transfer Date:")
	pdf.Cell(140, 10, data.TransferDate.Format("January 2, 2006 15:04:05"))
	pdf.Ln(10)

	// Previous owner information (if applicable)
	if data.PreviousOwnerID > 0 {
		pdf.Cell(50, 10, "Previous Owner:")
		pdf.Cell(140, 10, data.PreviousOwnerName)
		pdf.Ln(10)
	}

	// Verification information
	pdf.Ln(10)
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(190, 10, "VERIFICATION INFORMATION")
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 10)
	pdf.Cell(50, 10, "Contract Hash:")
	pdf.Cell(140, 10, contractHash)
	pdf.Ln(10)

	pdf.Cell(50, 10, "Verify URL:")
	pdf.Cell(140, 10, data.QRCodeURL)
	pdf.Ln(15)

	// QR Code placeholder - in a real implementation, you would insert an actual QR code image here
	pdf.Cell(190, 10, "Scan QR code to verify product authenticity")
	pdf.Ln(10)

	// Footer
	pdf.Ln(20)
	pdf.SetFont("Arial", "I", 8)
	pdf.Cell(190, 10, "This document certifies the ownership of the above product.")
	pdf.Ln(5)
	pdf.Cell(190, 10, "The information is secured using blockchain technology and can be verified using the provided QR code.")

	// Save the PDF
	return pdf.OutputFileAndClose(filePath)
}
