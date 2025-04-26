package controllers

import (
	"backend/models"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var jwtSecret = []byte("dK8xP3qZ7rT2vF5yJ9cM4bN6hG1wS0aE5dR8fL3xV7tP")

var db *gorm.DB

func InitUserController(database *gorm.DB) {
	db = database
}

type RegularUserInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type BrandRegisterInput struct {
	Username       string `json:"username" binding:"required"`
	Password       string `json:"password" binding:"required"`
	CompanyName    string `json:"company_name" binding:"required"`
	TaxID          string `json:"tax_id" binding:"required"`
	ContactEmail   string `json:"contact_email" binding:"required,email"`
	OfficialDomain string `json:"official_domain" binding:"required"`
}

type RepairShopRegisterInput struct {
	Username           string `json:"username" binding:"required"`
	Password           string `json:"password" binding:"required"`
	BusinessName       string `json:"business_name" binding:"required"`
	BusinessLicense    string `json:"business_license" binding:"required"`
	LocationAddress    string `json:"location_address" binding:"required"`
	CertificationProof string `json:"certification_proof" binding:"required"`
	ContactEmail       string `json:"contact_email" binding:"required,email"`
}

type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

func RegisterUser(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Username:     input.Username,
		PasswordHash: string(hash),
		Role:         input.Role,
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered"})
}

func RegisterRegularUser(c *gin.Context) {
	var input RegularUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Username:     input.Username,
		PasswordHash: string(hash),
		Role:         "regular",
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Regular user registered successfully"})
}

func RegisterBrand(c *gin.Context) {
	var input BrandRegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Domain validation - check if email matches official domain
	if !strings.HasSuffix(input.ContactEmail, "@"+input.OfficialDomain) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email must match the official domain"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Username:           input.Username,
		PasswordHash:       string(hash),
		Role:               "brand",
		CompanyName:        input.CompanyName,
		TaxID:              input.TaxID,
		ContactEmail:       input.ContactEmail,
		OfficialDomain:     input.OfficialDomain,
		VerificationStatus: "pending", // Brands need verification
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create brand"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Brand registration submitted for verification",
		"user_id": user.ID,
	})
}

func RegisterRepairShop(c *gin.Context) {
	var input RepairShopRegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Username:           input.Username,
		PasswordHash:       string(hash),
		Role:               "repair_shop",
		CompanyName:        input.BusinessName,
		ContactEmail:       input.ContactEmail,
		BusinessLicense:    input.BusinessLicense,
		LocationAddress:    input.LocationAddress,
		CertificationProof: input.CertificationProof,
		VerificationStatus: "pending", // Repair shops need verification
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create repair shop"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Repair shop registration submitted for verification",
		"user_id": user.ID,
	})
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var LoginInput LoginInput
	if err := c.ShouldBindJSON(&LoginInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := db.First(&user, "username = ?", LoginInput.Username).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(LoginInput.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Check verification status for brand and repair shop
	if (user.Role == "brand" || user.Role == "repair_shop") && user.VerificationStatus != "verified" {
		if user.VerificationStatus == "pending" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Your account is pending verification"})
		} else {
			c.JSON(http.StatusForbidden, gin.H{"error": "Your account verification was rejected"})
		}
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

type VerificationInput struct {
	Status string `json:"status" binding:"required,oneof=verified rejected"`
}

func VerifyUser(c *gin.Context) {
	// Only admins can verify users
	role, _ := c.Get("role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can verify users"})
		return
	}

	userID := c.Param("id")

	var input VerificationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Only brand and repair shop need verification
	if user.Role != "brand" && user.Role != "repair_shop" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This user type doesn't require verification"})
		return
	}

	user.VerificationStatus = input.Status
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update verification status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User verification status updated"})
}

func GetPendingVerifications(c *gin.Context) {
	// Only admins can view pending verifications
	role, _ := c.Get("role")
	if role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admins can view pending verifications"})
		return
	}

	var users []models.User
	if err := db.Where("verification_status = ?", "pending").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending verifications"})
		return
	}

	c.JSON(http.StatusOK, users)
}
