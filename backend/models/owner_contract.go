package models

import (
	"gorm.io/gorm"
	"time"
)

type OwnerContract struct {
    gorm.Model
    ProductID       uint
    OwnerID         uint
    ContractHash    string  // For verification
    PreviousOwnerID uint    // Will be 0 for first contract (initial registration)
    TransferDate    time.Time
    DocumentData    string  // JSON containing all contract details
    ContractNumber  string  // Unique identifier for the contract
    PDFPath         string  // Path to stored PDF file
}

