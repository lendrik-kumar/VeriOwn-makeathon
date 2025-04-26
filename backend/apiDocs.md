# Second-Hand Product Verification System API Documentation (Updated)

This API enables users to create, manage, and verify the authenticity and history of products throughout their lifecycle using a blockchain-inspired verification system.

## User Management

### 1. Register Regular User
**POST /api/users/register/regular**

Creates a new regular user account (buyer/seller).

**Request Body:**
```json
{
  "username": "john_smith",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "Regular user registered successfully"
}
```

### 2. Register Brand
**POST /api/users/register/brand**

Creates a new brand account (manufacturer) that requires admin verification.

**Request Body:**
```json
{
  "username": "apple_official",
  "password": "secure_password",
  "company_name": "Apple Inc.",
  "tax_id": "123456789",
  "contact_email": "verification@apple.com",
  "official_domain": "apple.com"
}
```

**Response:**
```json
{
  "message": "Brand registration submitted for verification",
  "user_id": 5
}
```

**Note:** Brand accounts require email domain verification (email must match the official domain) and admin approval before activation.

### 3. Register Repair Shop
**POST /api/users/register/repair-shop**

Creates a new repair shop account that requires admin verification.

**Request Body:**
```json
{
  "username": "fixitpro",
  "password": "secure_password",
  "business_name": "FixIt Pro Repair",
  "business_license": "LIC987654321",
  "location_address": "123 Repair Ave, New York, NY 10001",
  "certification_proof": "https://certifications.com/fixit-pro-cert.pdf",
  "contact_email": "service@fixitpro.com"
}
```

**Response:**
```json
{
  "message": "Repair shop registration submitted for verification",
  "user_id": 6
}
```

### 4. User Login
**POST /api/users/login**

Authenticates a user and provides an access token.

**Request Body:**
```json
{
  "username": "john_smith",
  "password": "secure_password"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Pending Verification):**
```json
{
  "error": "Your account is pending verification"
}
```

**Note:** Brand and repair shop accounts must be verified by an admin before they can log in.

## Admin Verification Endpoints

### 5. Get Pending Verifications
**GET /api/admin/verifications/pending**

Retrieves all accounts awaiting verification (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
[
  {
    "ID": 5,
    "username": "apple_official",
    "role": "brand",
    "company_name": "Apple Inc.",
    "tax_id": "123456789",
    "contact_email": "verification@apple.com",
    "official_domain": "apple.com",
    "verification_status": "pending"
  },
  {
    "ID": 6,
    "username": "fixitpro",
    "role": "repair_shop",
    "company_name": "FixIt Pro Repair",
    "business_license": "LIC987654321",
    "location_address": "123 Repair Ave, New York, NY 10001",
    "certification_proof": "https://certifications.com/fixit-pro-cert.pdf",
    "contact_email": "service@fixitpro.com",
    "verification_status": "pending"
  }
]
```

### 6. Verify User
**POST /api/admin/verify-user/:id**

Approves or rejects a brand or repair shop account (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**URL Parameters:**
- `id`: The user ID to verify

**Request Body:**
```json
{
  "status": "verified"
}
```
*Status Options:* `verified`, `rejected`

**Response:**
```json
{
  "message": "User verification status updated"
}
```

## Product Management

### 7. Register Product
**POST /api/products**

Registers a new product in the system (brand accounts only).

**Headers:**
```
Authorization: Bearer <brand_token>
```

**Request Body:**
```json
{
  "serial_number": "SN12345678",
  "manufacturer": "Apple Inc.",
  "model": "iPhone 15 Pro"
}
```

**Response:**
```json
{
  "id": 1,
  "serial_number": "SN12345678",
  "manufacturer": "Apple Inc.",
  "model": "iPhone 15 Pro",
  "created_at": "2025-04-26T10:30:00Z",
  "updated_at": "2025-04-26T10:30:00Z"
}
```

### 8. Get Product Details
**GET /api/products/:id**

Retrieves complete information about a product including its ownership history.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "product": {
    "id": 1,
    "serial_number": "SN12345678",
    "manufacturer": "Apple Inc.",
    "model": "iPhone 15 Pro"
  },
  "history": [
    {
      "id": 1,
      "event_type": "registration",
      "event_data": "{\"details\": \"Product registered\"}",
      "created_at": "2025-04-26T10:30:00Z",
      "created_by": 5,
      "event_hash": "8f7d9a6c5b4e3d2f1a0b9c8d7e6f5a4b3c2d1e0f",
      "previous_event_hash": ""
    },
    {
      "id": 2,
      "event_type": "ownership_transfer",
      "event_data": "{\"new_owner_id\": 8}",
      "created_at": "2025-04-27T14:15:00Z",
      "created_by": 5,
      "event_hash": "2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
      "previous_event_hash": "8f7d9a6c5b4e3d2f1a0b9c8d7e6f5a4b3c2d1e0f"
    }
  ]
}
```

### 9. Create Product Event
**POST /api/products/:id/events**

Records important events in a product's lifecycle.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Note:** Repair events can only be created by verified repair shop accounts.

**Request Body:**
```json
{
  "event_type": "repair",
  "event_data": "{\"repair_details\": \"Screen replacement\", \"parts_used\": \"Original screen\"}"
}
```

**Response:**
```json
{
  "id": 3,
  "product_id": 1,
  "event_type": "repair",
  "event_data": "{\"repair_details\": \"Screen replacement\", \"parts_used\": \"Original screen\"}",
  "created_at": "2025-04-28T09:45:00Z",
  "created_by": 6,
  "event_hash": "8f7d9a6c5b4e3d2f1a0b9c8d7e6f5a4b3c2d1e0f",
  "previous_event_hash": "2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b"
}
```

### 10. Initiate Ownership Transfer
**POST /api/products/:id/transfer**

Starts the process of transferring ownership to another user.

**Headers:**
```
Authorization: Bearer <current_owner_token>
```

**Request Body:**
```json
{
  "new_owner_username": "alice_jones"
}
```

**Response:**
```json
{
  "message": "Transfer initiated"
}
```

### 11. Confirm Ownership Transfer
**POST /api/products/:id/transfer/confirm**

The recipient confirms acceptance of ownership transfer.

**Headers:**
```
Authorization: Bearer <new_owner_token>
```

**Response:**
```json
{
  "message": "Transfer confirmed"
}
```

### 12. Verify Product History
**GET /api/products/:id/verify**

Validates the integrity of a product's entire event chain.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "message": "History is valid"
}
```

## Authentication

All protected endpoints require a valid JWT token obtained through login. 
Token must be included in the Authorization header:

```
Authorization: Bearer <token>
```

## User Journey Examples

### For Brands
1. Register as a brand
2. Wait for admin verification
3. Log in with verified credentials
4. Register new products
5. Update warranty information via product events

### For Repair Shops
1. Register as a repair shop
2. Wait for admin verification
3. Log in with verified credentials
4. Record repair events on products
5. Provide verifiable repair history

### For Regular Users (Buyers/Sellers)
1. Register as a regular user
2. Browse products and verify their authenticity
3. Purchase products and confirm ownership transfers
4. Sell products by initiating transfers to new owners

### For Admins
1. Log in with admin credentials
2. Review and verify new brand and repair shop registrations
3. Monitor system activity