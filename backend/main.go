package main

import (
	"backend/controllers"
	"backend/middlewares"
	"backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	dsn := "root:Vaidik@2005@tcp(localhost:3306)/productverify?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&models.User{}, &models.Product{}, &models.Event{}, &models.PendingTransfer{})

	r := gin.Default()

	controllers.InitUserController(db)
	controllers.InitProductController(db)
	controllers.InitEventController(db)

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
		authorized.POST("/api/products/:id/transfer/confirm", controllers.ConfirmTransfer)
		authorized.GET("/api/products/:id/verify", controllers.VerifyProductHistory)

		// Admin verification endpoints
		authorized.GET("/api/admin/verifications/pending", controllers.GetPendingVerifications)
		authorized.POST("/api/admin/verify-user/:id", controllers.VerifyUser)
	}

	r.Run(":8080")
}
