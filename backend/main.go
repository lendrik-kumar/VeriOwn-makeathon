package main

import (
	"backend/controllers"
	"backend/middlewares"
	"backend/models"
	"backend/utils"
	"fmt"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	// Load environment variables from .env file
	err := godotenv.Load("../.env") // <-- Adjusted path for your structure
	if err != nil {
		fmt.Println("Warning: .env file not found, using system environment variables")
	}

	// Initialize IPFS connection
	ipfsNodeURL := os.Getenv("IPFS_NODE_URL")
	if ipfsNodeURL == "" {
		ipfsNodeURL = "localhost:5001" // Default local node
	}
	utils.InitIPFSShell(ipfsNodeURL)

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.User{}, &models.Product{}, &models.Event{}, &models.PendingTransfer{}, &models.OwnerContract{})

	r := gin.Default()

	// Configure CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	controllers.InitUserController(db)
	controllers.InitEventController(db)

	// Public product verification endpoint (no auth required)
	r.GET("/api/products/public/:id", controllers.GetPublicProductInfo)

	// User registration endpoints - role-specific
	r.POST("/api/users/register/regular", controllers.RegisterRegularUser)
	r.POST("/api/users/register/brand", controllers.RegisterBrand)
	r.POST("/api/users/register/repair-shop", controllers.RegisterRepairShop)
	r.POST("/api/users/login", controllers.Login)

	authorized := r.Group("/").Use(middlewares.AuthMiddleware())
	{
		// Product related endpoints
		authorized.POST("/api/products", controllers.RegisterProduct)
		authorized.GET("/api/products/:id", controllers.GetProduct)
		authorized.POST("/api/products/:id/events", controllers.CreateEvent)
		authorized.POST("/api/products/:id/transfer", controllers.InitiateTransfer)
		authorized.GET("/api/transfers/pending", controllers.GetPendingTransfersForUser)
		authorized.POST("/api/products/:id/transfer/confirm", controllers.ConfirmTransfer)
		authorized.GET("/api/products/:id/verify", controllers.VerifyProductHistory)

		// Admin verification endpoints
		authorized.GET("/api/admin/verifications/pending", controllers.GetPendingVerifications)
		authorized.POST("/api/admin/verify-user/:id", controllers.VerifyUser)
		authorized.GET("/api/products/:id/qr", controllers.GenerateProductQR)
		// Add this to your authorized routes in main.go

		//get product!
		authorized.GET("/api/user/products", controllers.GetUserProducts)

		// Owner contract endpoints
		authorized.GET("/api/products/:id/contracts", controllers.GetProductContracts)
		authorized.GET("/api/contracts/:id/pdf", controllers.GetContractPDF)
		authorized.GET("/api/contracts/:id/ipfs", controllers.GetContractIPFSLink)
		authorized.POST("/api/contracts/:id/regenerate", controllers.RegenerateContractPDF)

		// User related endpoints
		authorized.GET("/api/user/info", controllers.GetUserInfo)
	}

	r.Run(":8080")
}
