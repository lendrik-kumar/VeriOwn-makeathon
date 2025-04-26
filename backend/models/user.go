package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username     string `gorm:"unique"`
    PasswordHash string
    Role         string  
	// Brand-specific fields
	CompanyName        string
	TaxID              string
	ContactEmail       string
	OfficialDomain     string
	VerificationStatus string // "pending", "verified", "rejected"
	// Repair shop specific fields
	BusinessLicense    string
	LocationAddress    string
	CertificationProof string
}