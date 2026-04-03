# 🏥 MediBot - AI-Powered Healthcare Chatbot

<div align="center">

![MediBot Banner](docs/images/banner.png)

**Your Intelligent Healthcare Assistant**

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [NLP Pipeline](#-nlp-pipeline)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Overview

**MediBot** is an advanced AI-powered healthcare chatbot that provides intelligent medical guidance based on user symptoms. Built with cutting-edge NLP technologies (spaCy + BERT), MediBot understands natural language input, extracts symptoms, predicts possible diseases, and offers evidence-based health advice.

### 🌟 Key Highlights

- ✅ **No External Datasets** - Custom professional PostgreSQL database with 200+ diseases and 500+ symptoms
- ✅ **Advanced NLP** - Hybrid spaCy + BERT model for accurate symptom extraction
- ✅ **Voice Input** - Hands-free interaction with speech-to-text
- ✅ **Multi-language** - English + Urdu support
- ✅ **HIPAA-Compliant** - Secure health data handling with audit logging
- ✅ **Professional UI** - Beautiful, responsive React + TypeScript frontend
- ✅ **Admin Panel** - Complete content and user management

---

## ✨ Features

### 🎯 Core Features

| Feature | Description |
|---------|-------------|
| **Symptom Analysis** | AI-powered symptom extraction from natural language text |
| **Disease Prediction** | Intelligent disease matching with confidence scoring |
| **Health Guidance** | Evidence-based advice and home remedies |
| **Doctor Alerts** | Automatic flagging for critical conditions |
| **Voice Input** | Speech-to-text for hands-free interaction |
| **Consultation History** | Complete history of all health consultations |
| **Health Dashboard** | Visual health statistics and trends |

### 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control (RBAC)
- HIPAA-compliant audit logging
- SQL injection prevention
- XSS protection
- Rate limiting

### 🎨 User Experience

- Modern, clean UI with Tailwind CSS
- Smooth animations with Framer Motion
- Mobile-first responsive design
- Progressive Web App (PWA) support
- Dark mode toggle
- Accessibility (WCAG 2.1 AA)

---

## 🛠️ Tech Stack

### Frontend
```
React 18 + TypeScript
Tailwind CSS + Framer Motion
Redux Toolkit
React Query
Web Speech API
```

### Backend
```
FastAPI (Python 3.11+)
SQLAlchemy (ORM)
Pydantic (Validation)
JWT Authentication
```

### Database
```
PostgreSQL 15 (Primary)
Redis (Cache)
Alembic (Migrations)
```

### NLP & AI
```
spaCy (NER)
HuggingFace BERT
PyTorch
NLTK
```

### DevOps
```
Docker + Docker Compose
GitHub Actions (CI/CD)
Nginx (Reverse Proxy)
AWS/Azure (Deployment)
```

---

## 📁 Project Structure

```
MediBot/
│
├── 📁 backend/                    # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 api/v1/routes/      # API endpoints
│   │   │   ├── auth.py           # Authentication routes
│   │   │   ├── chat.py           # Chat endpoints
│   │   │   ├── diseases.py       # Disease management
│   │   │   ├── users.py          # User operations
│   │   │   └── admin.py          # Admin panel APIs
│   │   │
│   │   ├── 📁 core/              # Core configurations
│   │   │   ├── config.py         # App settings
│   │   │   ├── security.py       # Auth & encryption
│   │   │   └── database.py       # DB connection
│   │   │
│   │   ├── 📁 models/            # Database models
│   │   │   ├── user.py
│   │   │   ├── disease.py
│   │   │   ├── symptom.py
│   │   │   └── consultation.py
│   │   │
│   │   ├── 📁 schemas/           # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── chat.py
│   │   │   └── disease.py
│   │   │
│   │   ├── 📁 nlp/               # NLP Engine
│   │   │   ├── symptom_extractor.py
│   │   │   ├── disease_predictor.py
│   │   │   └── preprocessing.py
│   │   │
│   │   ├── 📁 services/          # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── chat_service.py
│   │   │   └── notification_service.py
│   │   │
│   │   └── main.py               # App entry point
│   │
│   ├── 📁 alembic/               # Database migrations
│   ├── 📁 tests/                 # Backend tests
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📁 frontend/                   # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── common/           # Reusable components
│   │   │   ├── chat/             # Chat components
│   │   │   ├── dashboard/        # Dashboard widgets
│   │   │   └── admin/            # Admin components
│   │   │
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Admin.tsx
│   │   │
│   │   ├── 📁 hooks/             # Custom hooks
│   │   ├── 📁 store/             # Redux store
│   │   ├── 📁 services/          # API services
│   │   ├── 📁 utils/             # Utilities
│   │   └── 📁 styles/            # Global styles
│   │
│   ├── package.json
│   └── Dockerfile
│
├── 📁 database/                   # Database Scripts
│   ├── 📁 migrations/
│   ├── 📁 seeds/
│   │   ├── seed_diseases.py
│   │   ├── seed_symptoms.py
│   │   └── seed_remedies.py
│   ├── init.sql
│   └── schema.sql
│
├── 📁 nlp_models/                 # NLP Training
│   ├── 📁 training/
│   └── 📁 models/
│
├── 📁 docs/                       # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── USER_MANUAL.md
│   └── DEPLOYMENT_GUIDE.md
│
├── 📁 docker/                     # Docker Config
│   └── docker-compose.yml
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- **Redis** - [Download](https://redis.io/download/)
- **Git** - [Download](https://git-scm.com/)

### 📥 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medibot.git
cd medibot
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Run database migrations
alembic upgrade head

# Seed the database
python -m app.services.seed_database
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Start development server
npm run dev
```

---

## 🎮 Usage

### Starting the Application

#### Option 1: Manual Start

```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate  # or: source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Option 2: Docker Compose (Recommended)

```bash
cd docker
docker-compose up -d
```

### Accessing the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Admin Panel:** http://localhost:3000/admin

### Default Admin Credentials

```
Email: admin@medibot.com
Password: Admin@123
```

⚠️ **Change these credentials immediately after first login!**

---

## 📖 API Documentation

### Authentication Endpoints

```http
POST   /api/v1/auth/register     # Register new user
POST   /api/v1/auth/login        # User login
POST   /api/v1/auth/logout       # User logout
GET    /api/v1/auth/me           # Get current user
```

### Chat Endpoints

```http
POST   /api/v1/chat/message            # Send message to bot
GET    /api/v1/chat/history            # Get consultation history
GET    /api/v1/chat/history/{id}       # Get specific consultation
DELETE /api/v1/chat/history/{id}       # Delete consultation
```

### Disease Endpoints

```http
GET    /api/v1/diseases                # List all diseases
GET    /api/v1/diseases/{id}           # Get disease details
GET    /api/v1/diseases/search?q=cold  # Search diseases
```

### Example: Send Message to Bot

```bash
curl -X POST "http://localhost:8000/api/v1/chat/message" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have fever and headache since 2 days"}'
```

### Example Response

```json
{
  "consultation_id": "12345",
  "extracted_symptoms": ["fever", "headache"],
  "predicted_diseases": [
    {
      "name": "Common Cold",
      "confidence": 0.85,
      "severity": "Mild"
    },
    {
      "name": "Viral Fever",
      "confidence": 0.72,
      "severity": "Moderate"
    }
  ],
  "advice": [
    "Rest and stay hydrated",
    "Take paracetamol for fever",
    "Monitor temperature regularly"
  ],
  "doctor_alert": false,
  "home_remedies": [
    "Warm salt water gargle",
    "Steam inhalation",
    "Vitamin C rich foods"
  ]
}
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐
│     USERS        │       │    DISEASES      │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ email            │       │ name             │
│ password_hash    │       │ description      │
│ full_name        │       │ severity_level   │
│ date_of_birth    │       │ category         │
│ gender           │       │ icd10_code       │
│ created_at       │       │ created_at       │
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         │ 1:N                      │ N:M
         │                          │
         ▼                          ▼
┌──────────────────┐       ┌──────────────────┐
│  CONSULTATIONS   │       │    SYMPTOMS      │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ user_id (FK)     │       │ name             │
│ symptoms_text    │       │ medical_term     │
│ predicted_disease│       │ category         │
│ confidence_score │       │ created_at       │
│ advice_given     │       └────────┬─────────┘
│ doctor_alert     │                │
│ created_at       │                │
└──────────────────┘                │
                                    │
                          ┌─────────┴─────────┐
                          │                   │
                          ▼                   ▼
                  ┌──────────────────┐ ┌──────────────────┐
                  │ DISEASE_SYMTOMS  │ │   HOME_REMEDIES  │
                  ├──────────────────┤ ├──────────────────┤
                  │ disease_id (FK)  │ │ disease_id (FK)  │
                  │ symptom_id (FK)  │ │ remedy_text      │
                  │ confidence       │ │ effectiveness    │
                  │ is_primary       │ └──────────────────┘
                  └──────────────────┘
```

### Database Statistics

| Entity | Count |
|--------|-------|
| Diseases | 200+ |
| Symptoms | 500+ |
| Home Remedies | 400+ |
| Disease-Symptom Mappings | 1500+ |

---

## 🧠 NLP Pipeline

### Architecture

```
User Input (Text/Voice)
        ↓
    Preprocessing
    (Cleaning, Tokenization)
        ↓
    NER (spaCy)
    (Entity Recognition)
        ↓
    Symptom Extraction
    (Medical Term Mapping)
        ↓
    BERT Classification
    (Disease Prediction)
        ↓
    Confidence Scoring
    (0-100%)
        ↓
    Response Generation
    (Advice + Remedies)
```

### Supported Symptoms

The NLP model can extract and recognize:

- **General Symptoms:** fever, headache, fatigue, weakness
- **Respiratory:** cough, cold, sore throat, breathing difficulty
- **Gastrointestinal:** nausea, vomiting, diarrhea, abdominal pain
- **Neurological:** dizziness, confusion, seizures
- **Dermatological:** rash, itching, swelling
- **And 500+ more symptoms!**

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm test

# E2E tests
cd frontend
npm run test:e2e
```

### Test Coverage

| Component | Coverage | Status |
|-----------|----------|--------|
| Backend API | 85%+ | ✅ Pass |
| NLP Pipeline | 90%+ | ✅ Pass |
| Frontend Components | 80%+ | ✅ Pass |
| Integration Tests | 75%+ | ✅ Pass |

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
cd docker
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Cloud Deployment (AWS)

```bash
# Deploy to AWS Elastic Beanstalk
cd backend
eb init
eb create medibot-production
eb deploy

# Deploy to AWS S3 + CloudFront (Frontend)
cd frontend
npm run build
aws s3 sync build/ s3://medibot-frontend
```

### Environment Variables

```bash
# .env file configuration
DATABASE_URL=postgresql://user:password@localhost:5432/medibot
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key
SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

---

## 👥 Team

**BS Computer Science, Batch 2022F**  
**Sir Syed University of Engineering & Technology**

| Name | Role | Email |
|------|------|-------|
| **Mudassir Alam** | Frontend Lead | 2022F-CS-151@ssuet.edu.pk |
| **Anas Ali** | Database Lead | 2022F-CS-072@ssuet.edu.pk |
| **Neel Kanth** | NLP Lead | 2022F-CS-028@ssuet.edu.pk |
| **Syed Hanzala** | Backend Lead | 2022F-CS-286@ssuet.edu.pk |

**Supervisor:** Miss Sobia Ashar

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Sir Syed University of Engineering & Technology
- Department of Computer Science & IT
- Miss Sobia Ashar (Project Supervisor)
- WHO Health Data Repository
- Kaggle Medical Datasets

---

## 📞 Support

For issues, questions, or contributions:

- **GitHub Issues:** [Report a bug](https://github.com/your-username/medibot/issues)
- **Email:** support@medibot.com
- **Documentation:** [View full docs](docs/)

---

<div align="center">

**Made with ❤️ for Better Healthcare**

© 2024 MediBot Team. All rights reserved.

</div>
