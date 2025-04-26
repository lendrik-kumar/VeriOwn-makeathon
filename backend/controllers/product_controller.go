package controllers

import (
	"net/http"

	"backend/models"
	"backend/utils"

	"encoding/json"
	"errors"
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitProductController(database *gorm.DB) {
	db = database
}

type ProductInput struct {
	SerialNumber string `json:"serial_number" binding:"required"`
	Manufacturer string `json:"manufacturer" binding:"required"`
	Model        string `json:"model" binding:"required"`
}

func RegisterProduct(c *gin.Context) {
	role, _ := c.Get("role")

	// Only brands can register products
	if role != "brand" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only verified brands can register products"})
		return
	}

	var input ProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.String(http.StatusBadRequest, "failed to bind JSON: %v", err)
		return
	}

	product := models.Product{
		SerialNumber: input.SerialNumber,
		Manufacturer: input.Manufacturer,
		ProductModel: input.Model,
	}

	// create the product in db
	if err := db.Create(&product).Error; err != nil {
		c.String(http.StatusInternalServerError, "failed to create product: %v", err)
		return
	}

	userID := c.MustGet("user_id")

	// create the event in db
	event := models.Event{
		ProductID: product.ID,
		EventType: "registration",
		EventData: `{"details": "Product registered"}`,
		CreatedBy: userID.(uint),
	}

	if err := createEventRecord(&event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to log registration event"})
		return
	}

	// Generate owner contract
	contract, err := utils.GenerateOwnerContract(db, product.ID, userID.(uint), 0)
	if err != nil {
		fmt.Printf("Warning: Failed to generate owner contract: %v\n", err)
	}

	// Add contract info to response if created
	response := gin.H{
		"product": product,
	}
	if contract != nil {
		response["contract"] = gin.H{
			"contract_number": contract.ContractNumber,
			"issued_at":       contract.CreatedAt,
		}
	}

	c.JSON(http.StatusOK, response)
}

func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var events []models.Event
	db.Where("product_id = ?", id).Order("created_at asc").Find(&events)

	c.JSON(http.StatusOK, gin.H{
		"product": product,
		"history": events,
	})
}

type TransferInput struct {
	NewOwnerUsername string `json:"new_owner_username" binding:"required"`
}

func InitiateTransfer(c *gin.Context) {
	productID := c.Param("id")
	userID, _ := c.Get("user_id")

	var product models.Product
	if err := db.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var lastEvent models.Event
	if err := db.Where("product_id = ? AND event_type = ?", productID, "ownership_transfer").Order("created_at desc").First(&lastEvent).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var currentOwnerID uint
	if lastEvent.ID != 0 {
		var eventData map[string]interface{}
		json.Unmarshal([]byte(lastEvent.EventData), &eventData)
		currentOwnerID = uint(eventData["new_owner_id"].(float64))
	} else {
		// Assume initial owner is the one who registered it
		var regEvent models.Event
		if err := db.Where("product_id = ? AND event_type = ?", productID, "registration").First(&regEvent).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "No registration event found"})
			return
		}
		currentOwnerID = regEvent.CreatedBy
	}

	if currentOwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the current owner can initiate a transfer"})
		return
	}

	var input TransferInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var newOwner models.User
	if err := db.Where("username = ?", input.NewOwnerUsername).First(&newOwner).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "New owner not found"})
		return
	}

	pendingTransfer := models.PendingTransfer{
		ProductID:  product.ID,
		NewOwnerID: newOwner.ID,
	}

	if err := db.Create(&pendingTransfer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initiate transfer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transfer initiated"})
}

func ConfirmTransfer(c *gin.Context) {
	productIDStr := c.Param("id") // Rename to avoid conflict
	userID, _ := c.Get("user_id")

	var pendingTransfer models.PendingTransfer
	if err := db.Where("product_id = ? AND new_owner_id = ?", productIDStr, userID).First(&pendingTransfer).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No pending transfer found"})
		return
	}

	event := models.Event{
		ProductID: pendingTransfer.ProductID,
		EventType: "ownership_transfer",
		EventData: fmt.Sprintf(`{"new_owner_id": %d}`, pendingTransfer.NewOwnerID),
		CreatedBy: userID.(uint),
	}

	if err := createEventRecord(&event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to log transfer event"})
		return
	}

	if err := db.Delete(&pendingTransfer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete pending transfer"})
		return
	}

	// Use the existing variable without redeclaration
	pID := pendingTransfer.ProductID
	newOwnerID := pendingTransfer.NewOwnerID
	currentOwnerID := userID.(uint)

	// Generate new owner contract for the transfer
	contract, err := utils.GenerateOwnerContract(db, pID, newOwnerID, currentOwnerID)
	if err != nil {
		fmt.Printf("Warning: Failed to generate transfer contract: %v\n", err)
	}

	response := gin.H{
		"message": "Transfer confirmed",
	}
	if contract != nil {
		response["contract"] = gin.H{
			"contract_number": contract.ContractNumber,
			"issued_at":       contract.CreatedAt,
		}
	}

	c.JSON(http.StatusOK, response)
}

// GetUserProducts returns all products owned by the currently logged in user
func GetUserProducts(c *gin.Context) {
	userID, _ := c.Get("user_id")

	// Find all contracts where the user is the current owner
	var contracts []models.OwnerContract
	if err := db.Where("owner_id = ?", userID).Find(&contracts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user's contracts"})
		return
	}

	// Extract product IDs from the contracts
	var productIDs []uint
	for _, contract := range contracts {
		productIDs = append(productIDs, contract.ProductID)
	}

	// If user doesn't own any products, return empty array
	if len(productIDs) == 0 {
		c.JSON(http.StatusOK, gin.H{"products": []string{}})
		return
	}

	// Find products by their IDs
	var products []models.Product
	if err := db.Where("id IN ?", productIDs).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	// Prepare response with products and their contracts
	response := make([]gin.H, 0)
	for _, product := range products {
		// Find the contract for this product
		var productContracts []models.OwnerContract
		if err := db.Where("product_id = ? AND owner_id = ?", product.ID, userID).
			Order("created_at DESC").Find(&productContracts).Error; err != nil {
			continue // Skip if contract can't be found
		}

		// Skip if no contracts found (shouldn't happen based on our query)
		if len(productContracts) == 0 {
			continue
		}

		// Use the most recent contract
		latestContract := productContracts[0]

		// Generate IPFS URLs
		ipfsGatewayURL := ""
		if latestContract.IPFSCID != "" {
			ipfsGatewayURL = fmt.Sprintf("https://ipfs.io/ipfs/%s", latestContract.IPFSCID)
		}

		// Add to response
		productData := gin.H{
			"id":            product.ID,
			"serial_number": product.SerialNumber,
			"manufacturer":  product.Manufacturer,
			"model":         product.ProductModel,
			"created_at":    product.CreatedAt,
			"contract": gin.H{
				"id":              latestContract.ID,
				"contract_number": latestContract.ContractNumber,
				"transfer_date":   latestContract.TransferDate,
				"ipfs_cid":        latestContract.IPFSCID,
				"ipfs_url":        ipfsGatewayURL,
			},
		}

		response = append(response, productData)
	}

	c.JSON(http.StatusOK, gin.H{"products": response})
}
