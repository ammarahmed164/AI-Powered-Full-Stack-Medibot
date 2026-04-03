# 📡 MediBot API Documentation

## Overview

MediBot provides a comprehensive RESTful API for all healthcare chatbot functionalities. This documentation covers all endpoints, authentication, request/response formats, and usage examples.

---

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Code Examples](#code-examples)

---

## 🔗 Base URL

```
Production:  https://api.medibot.com/api/v1
Development: http://localhost:8000/api/v1
```

---

## 🔐 Authentication

### JWT Token-Based Authentication

All protected endpoints require a valid JWT token in the Authorization header.

### Getting a Token

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "patient"
  }
}
```

### Using the Token

Include the token in all requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "Male"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": false
  }
}
```

---

#### 2. Login

**POST** `/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "patient"
  }
}
```

---

#### 3. Logout

**POST** `/auth/logout`

Invalidate current token and logout.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### 4. Get Current User

**GET** `/auth/me`

Get authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "Male",
  "blood_group": "O+",
  "role": "patient",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

#### 5. Refresh Token

**POST** `/auth/refresh`

Get new access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "new_access_token...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

### Chat & Consultation Endpoints

#### 6. Send Message to Bot

**POST** `/chat/message`

Send a message and get AI-powered health guidance.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I have fever and headache since 2 days",
  "session_id": "optional-session-id"
}
```

**Response (200 OK):**
```json
{
  "consultation_id": "uuid",
  "message": "Based on your symptoms, you may be experiencing...",
  "extracted_symptoms": [
    {"name": "Fever", "confidence": 0.95},
    {"name": "Headache", "confidence": 0.92}
  ],
  "predicted_diseases": [
    {
      "name": "Common Cold",
      "icd10_code": "J00",
      "confidence": 0.85,
      "severity": "Mild"
    },
    {
      "name": "Viral Fever",
      "icd10_code": "A90",
      "confidence": 0.72,
      "severity": "Moderate"
    }
  ],
  "advice": [
    "Rest and stay hydrated",
    "Take paracetamol for fever",
    "Monitor your temperature regularly"
  ],
  "home_remedies": [
    "Warm salt water gargle for sore throat",
    "Steam inhalation for congestion",
    "Vitamin C rich foods like oranges"
  ],
  "doctor_alert": false,
  "alert_reason": null,
  "confidence_score": 0.85,
  "response_time_ms": 245
}
```

---

#### 7. Get Chat History

**GET** `/chat/history`

Get user's consultation history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `start_date` (ISO date, optional)
- `end_date` (ISO date, optional)

**Response (200 OK):**
```json
{
  "total": 15,
  "page": 1,
  "limit": 20,
  "consultations": [
    {
      "id": "uuid",
      "symptoms_input": "I have fever and headache",
      "predicted_diseases": [
        {"name": "Common Cold", "confidence": 0.85}
      ],
      "advice_given": "Rest and hydration",
      "doctor_alert": false,
      "created_at": "2024-03-20T10:30:00Z"
    }
  ]
}
```

---

#### 8. Get Specific Consultation

**GET** `/chat/history/{consultation_id}`

Get details of a specific consultation.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "uuid",
  "symptoms_input": "I have fever and headache since 2 days",
  "extracted_symptoms": [
    {"name": "Fever", "confidence": 0.95},
    {"name": "Headache", "confidence": 0.92}
  ],
  "predicted_diseases": [
    {
      "name": "Common Cold",
      "icd10_code": "J00",
      "confidence": 0.85
    }
  ],
  "advice_given": "Rest, hydration, paracetamol",
  "home_remedies_suggested": ["Steam inhalation", "Vitamin C"],
  "doctor_alert": false,
  "created_at": "2024-03-20T10:30:00Z"
}
```

---

#### 9. Delete Consultation

**DELETE** `/chat/history/{consultation_id}`

Delete a specific consultation from history.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Consultation deleted successfully"
}
```

---

### Disease Endpoints

#### 10. List All Diseases

**GET** `/diseases`

Get list of all diseases (paginated).

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `category` (string, optional)
- `severity` (string, optional)
- `is_common` (boolean, optional)

**Response (200 OK):**
```json
{
  "total": 200,
  "page": 1,
  "limit": 20,
  "diseases": [
    {
      "id": "uuid",
      "name": "Common Cold",
      "medical_name": "Acute Nasopharyngitis",
      "icd10_code": "J00",
      "category": "Respiratory",
      "severity": "Mild",
      "is_common": true
    }
  ]
}
```

---

#### 11. Get Disease Details

**GET** `/diseases/{disease_id}`

Get detailed information about a specific disease.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Common Cold",
  "medical_name": "Acute Nasopharyngitis",
  "icd10_code": "J00",
  "category": "Respiratory",
  "severity": "Mild",
  "description": "Viral infection of upper respiratory tract...",
  "causes": "Rhinovirus, coronavirus, or other respiratory viruses",
  "risk_factors": "Weakened immune system, close contact",
  "complications": "Ear infection, sinusitis, pneumonia",
  "when_to_see_doctor": "Symptoms last more than 10 days",
  "symptoms": [
    {"name": "Runny Nose", "is_primary": true},
    {"name": "Sneezing", "is_primary": true},
    {"name": "Sore Throat", "is_primary": false}
  ],
  "home_remedies": [
    {
      "remedy_text": "Warm salt water gargle",
      "effectiveness_rating": 4.2
    }
  ]
}
```

---

#### 12. Search Diseases

**GET** `/diseases/search`

Search diseases by name or symptoms.

**Query Parameters:**
- `q` (string, required): Search query
- `limit` (integer, default: 10)

**Response (200 OK):**
```json
{
  "query": "cold",
  "results": [
    {
      "id": "uuid",
      "name": "Common Cold",
      "icd10_code": "J00",
      "category": "Respiratory",
      "severity": "Mild",
      "match_score": 0.95
    },
    {
      "id": "uuid",
      "name": "Cold Sores",
      "icd10_code": "B00.1",
      "category": "Dermatological",
      "severity": "Mild",
      "match_score": 0.75
    }
  ]
}
```

---

### Symptom Endpoints

#### 13. List All Symptoms

**GET** `/symptoms`

Get list of all symptoms.

**Query Parameters:**
- `category` (string, optional)
- `is_common` (boolean, optional)

**Response (200 OK):**
```json
{
  "total": 500,
  "symptoms": [
    {
      "id": "uuid",
      "name": "Fever",
      "medical_term": "Pyrexia",
      "category": "Vital Signs",
      "is_common": true,
      "requires_immediate_attention": false
    }
  ]
}
```

---

#### 14. Check Symptoms

**POST** `/symptoms/check`

Check if input text contains recognizable symptoms.

**Request Body:**
```json
{
  "text": "I have fever and headache"
}
```

**Response (200 OK):**
```json
{
  "extracted_symptoms": [
    {
      "name": "Fever",
      "medical_term": "Pyrexia",
      "confidence": 0.95,
      "category": "Vital Signs"
    },
    {
      "name": "Headache",
      "medical_term": "Cephalalgia",
      "confidence": 0.92,
      "category": "Pain"
    }
  ],
  "unrecognized_terms": []
}
```

---

### User Profile Endpoints

#### 15. Get User Profile

**GET** `/users/profile`

Get authenticated user's complete profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "gender": "Male",
  "blood_group": "O+",
  "height_cm": 175,
  "weight_kg": 70,
  "medical_history": "No known chronic conditions",
  "allergies": "Penicillin",
  "current_medications": "None",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

#### 16. Update User Profile

**PUT** `/users/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "+1234567890",
  "height_cm": 175,
  "weight_kg": 70,
  "medical_history": "Hypertension",
  "allergies": "Penicillin, Aspirin"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "full_name": "John Doe Updated",
    "phone": "+1234567890",
    "updated_at": "2024-03-25T12:00:00Z"
  }
}
```

---

#### 17. Get User Health Metrics

**GET** `/users/health-metrics`

Get user's recorded health metrics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `metric_type` (string, optional): weight, blood_pressure, etc.
- `start_date` (ISO date, optional)
- `end_date` (ISO date, optional)

**Response (200 OK):**
```json
{
  "metrics": [
    {
      "id": "uuid",
      "metric_type": "weight",
      "metric_value": 70.5,
      "unit": "kg",
      "recorded_at": "2024-03-20T10:00:00Z"
    },
    {
      "id": "uuid",
      "metric_type": "blood_pressure_systolic",
      "metric_value": 120,
      "unit": "mmHg",
      "recorded_at": "2024-03-20T10:00:00Z"
    }
  ]
}
```

---

#### 18. Add Health Metric

**POST** `/users/health-metrics`

Record a new health metric.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "metric_type": "weight",
  "metric_value": 70.5,
  "unit": "kg",
  "notes": "Morning weight"
}
```

**Response (201 Created):**
```json
{
  "message": "Health metric recorded successfully",
  "metric": {
    "id": "uuid",
    "metric_type": "weight",
    "metric_value": 70.5,
    "unit": "kg",
    "created_at": "2024-03-25T12:00:00Z"
  }
}
```

---

### Notification Endpoints

#### 19. Get Notifications

**GET** `/notifications`

Get user notifications.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "unread_count": 3,
  "notifications": [
    {
      "id": "uuid",
      "title": "Health Tip",
      "message": "Remember to stay hydrated today!",
      "type": "info",
      "is_read": false,
      "created_at": "2024-03-25T08:00:00Z"
    }
  ]
}
```

---

#### 20. Mark Notification as Read

**PUT** `/notifications/{notification_id}/read`

Mark a notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Notification marked as read"
}
```

---

### Admin Endpoints

#### 21. Get All Users (Admin Only)

**GET** `/admin/users`

Get list of all users (requires admin role).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `role` (string, optional)
- `is_active` (boolean, optional)

**Response (200 OK):**
```json
{
  "total": 1000,
  "page": 1,
  "limit": 20,
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "patient",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### 22. Get Analytics Dashboard (Admin Only)

**GET** `/admin/analytics`

Get platform analytics and statistics.

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200 OK):**
```json
{
  "total_users": 1000,
  "active_users_today": 150,
  "total_consultations": 5000,
  "consultations_today": 75,
  "average_confidence_score": 0.82,
  "doctor_alerts_triggered": 45,
  "top_diseases": [
    {"name": "Common Cold", "count": 500},
    {"name": "Viral Fever", "count": 350},
    {"name": "Migraine", "count": 200}
  ],
  "user_growth": [
    {"date": "2024-03-01", "count": 50},
    {"date": "2024-03-02", "count": 55}
  ]
}
```

---

#### 23. Add Disease (Admin Only)

**POST** `/admin/diseases`

Add a new disease to database.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Disease",
  "medical_name": "Medical Name",
  "icd10_code": "X99.9",
  "category": "General",
  "severity": "Moderate",
  "description": "Description",
  "causes": "Causes",
  "risk_factors": "Risk factors",
  "complications": "Complications",
  "when_to_see_doctor": "When to see doctor"
}
```

**Response (201 Created):**
```json
{
  "message": "Disease added successfully",
  "disease": {
    "id": "uuid",
    "name": "New Disease",
    "icd10_code": "X99.9",
    "created_at": "2024-03-25T12:00:00Z"
  }
}
```

---

#### 24. Update Disease (Admin Only)

**PUT** `/admin/diseases/{disease_id}`

Update an existing disease.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Updated Disease Name",
  "severity": "Severe",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "message": "Disease updated successfully"
}
```

---

#### 25. Delete Disease (Admin Only)

**DELETE** `/admin/diseases/{disease_id}`

Delete a disease from database.

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200 OK):**
```json
{
  "message": "Disease deleted successfully"
}
```

---

## ❌ Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Examples

**400 Bad Request:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

**401 Unauthorized:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid authentication token"
  }
}
```

**404 Not Found:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Disease not found"
  }
}
```

**429 Too Many Requests:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds.",
    "details": {
      "retry_after": 60
    }
  }
}
```

---

## 🚦 Rate Limiting

### Default Limits

| Endpoint Type | Limit |
|---------------|-------|
| Authentication | 10 requests/minute |
| Chat/Messages | 20 requests/minute |
| General API | 100 requests/minute |
| Admin Endpoints | 50 requests/minute |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1647360000
```

---

## 💻 Code Examples

### Python Example

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Login
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "user@example.com",
    "password": "SecurePassword123"
})

token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Send message to bot
chat_response = requests.post(
    f"{BASE_URL}/chat/message",
    headers=headers,
    json={"message": "I have fever and headache"}
)

print(chat_response.json())
```

### JavaScript Example

```javascript
const BASE_URL = 'http://localhost:8000/api/v1';

// Login
async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return data.access_token;
}

// Send message
async function sendMessage(token, message) {
  const response = await fetch(`${BASE_URL}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  return await response.json();
}

// Usage
const token = await login('user@example.com', 'password');
const result = await sendMessage(token, 'I have fever');
console.log(result);
```

### cURL Example

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Send message
curl -X POST http://localhost:8000/api/v1/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I have fever and headache"}'
```

---

## 📊 Swagger/OpenAPI Documentation

Interactive API documentation is available at:

```
Development: http://localhost:8000/docs
Production:  https://api.medibot.com/docs
```

---

## 📞 Support

For API-related issues:
- Email: api-support@medibot.com
- GitHub Issues: https://github.com/medibot/api/issues

---

**© 2024 MediBot Team. All Rights Reserved.**
