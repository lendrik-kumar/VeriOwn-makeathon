package controllers

import (
	"backend/models"
	"encoding/json"
	"net/http"
	"github.com/skip2/go-qrcode"
    "encoding/base64"

	"github.com/gin-gonic/gin"
)

func GetPublicProductInfo(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if err := db.First(&product, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Product not found"})
		return
	}

	var events []models.Event
	db.Where("product_id = ?", id).Order("created_at asc").Find(&events)

	// Filter sensitive information from events
	publicEvents := []gin.H{}
	for _, event := range events {
		// Simplify event data to remove sensitive info
		var eventDataMap map[string]interface{}
		json.Unmarshal([]byte(event.EventData), &eventDataMap)

		// Remove sensitive fields if present
		delete(eventDataMap, "new_owner_id") // Hide actual owner IDs

		publicEvent := gin.H{
			"event_type": event.EventType,
			"created_at": event.CreatedAt,
			"event_hash": event.EventHash,
		}

		// Add simplified event data
		if event.EventType == "repair" {
			publicEvent["repair_details"] = eventDataMap["repair_details"]
		} else if event.EventType == "registration" {
			publicEvent["details"] = "Product registered by manufacturer"
		} else if event.EventType == "ownership_transfer" {
			publicEvent["details"] = "Ownership transferred"
		}

		publicEvents = append(publicEvents, publicEvent)
	}

	c.JSON(http.StatusOK, gin.H{
		"product": gin.H{
			"serial_number":      product.SerialNumber,
			"manufacturer":       product.Manufacturer,
			"model":              product.ProductModel,
			"manufacturing_date": product.CreatedAt.Format("2006-01-02"),
		},
		"history":             publicEvents,
		"verification_status": "authentic", // You might want to calculate this
	})
}

func GenerateProductQR(c *gin.Context){
	productID := c.Param("id")
	userID, _ := c.Get("user_id")
	role,_ := c.Get("role")

	// Only brands or current owners can generate QR codes
	if role != "brand" {
		// Check if user is current owner
		isOwner := false
			
		// Get last ownership transfer event
		var lastEvent models.Event
		if err := db.Where("product_id = ? AND event_type = ?", productID, "ownership_transfer").
			Order("created_at desc").First(&lastEvent).Error; err == nil {
			var eventData map[string]interface{}
			json.Unmarshal([]byte(lastEvent.EventData), &eventData)
			if newOwnerID, ok := eventData["new_owner_id"].(float64); ok && uint(newOwnerID) == userID.(uint) {
				isOwner = true
			}
		} else if err := db.Where("product_id = ? AND event_type = ?", productID, "registration").
			First(&lastEvent).Error; err == nil {
			// Initial owner is the brand that registered it
			if lastEvent.CreatedBy == userID.(uint) {
				isOwner = true
			}
		}
			
		if !isOwner {
			c.JSON(http.StatusForbidden, gin.H{"error": "Only product owners or manufacturers can generate QR codes"})
			return
		}
	}

	// generate the qr code
	
		baseURL := "https://localhost:5173/verify/"
		verificationURL := baseURL + productID
		
		// Generate QR code
		qrCode, err := qrcode.Encode(verificationURL, qrcode.Medium, 256)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate QR code"})
			return
		}
		
		// Return QR code as base64 encoded image
		base64QR := base64.StdEncoding.EncodeToString(qrCode)
		
		c.JSON(http.StatusOK, gin.H{
			"qr_code": "data:image/png;base64," + base64QR,
			"url": verificationURL,
		})

 }