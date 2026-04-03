# 🚀 MediBot - Complete Setup Guide

**Your AI-Powered Healthcare Chatbot**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker)](#quick-start-docker)
3. [Manual Setup](#manual-setup)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## ✅ Prerequisites

### Required Software

**For Docker Setup (Recommended):**
- Docker Desktop (Windows/Mac) or Docker + Docker Compose (Linux)
- Git

**For Manual Setup:**
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Git

### System Requirements

- **OS:** Windows 10/11, macOS 10.15+, or Linux
- **RAM:** Minimum 8GB (16GB recommended)
- **Storage:** 5GB free space
- **Internet:** For downloading dependencies

---

## 🐳 Quick Start (Docker - Recommended)

### Step 1: Clone Repository

```bash
cd "D:\Gemini CLI\QWEN\AI Powered Medibot\MediBot"
```

### Step 2: Setup Environment Variables

```bash
# Copy environment template
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
```

### Step 3: Start All Services

```bash
cd docker
docker-compose up -d
```

### Step 4: Verify Services

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Admin Panel:** http://localhost:3000/admin

**Default Admin Credentials:**
- Email: `admin@medibot.com`
- Password: `Admin@123`

⚠️ **CHANGE PASSWORD IMMEDIATELY!**

---

## 💻 Manual Setup

### Backend Setup

#### 1. Install Python Dependencies

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Setup PostgreSQL Database

```bash
# Start PostgreSQL service
# Windows: Run from Services
# Mac: brew services start postgresql@15
# Linux: sudo systemctl start postgresql

# Create database
psql -U postgres
CREATE DATABASE medibot;
CREATE USER medibot_user WITH PASSWORD 'MediBot@Secure2024!';
GRANT ALL PRIVILEGES ON DATABASE medibot TO medibot_user;
\q

# Run schema
psql -U medibot_user -d medibot -f database/schema.sql
```

#### 3. Setup Redis

```bash
# Windows: Download from GitHub and run
# Mac: brew install redis && brew services start redis
# Linux: sudo systemctl start redis
```

#### 4. Configure Environment

```bash
# Copy and edit .env
copy .env.example .env

# Update these values:
DATABASE_URL=postgresql://medibot_user:MediBot@Secure2024!@localhost:5432/medibot
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-random-secret-key-here
JWT_SECRET_KEY=your-random-jwt-secret-here
```

#### 5. Run Database Migrations

```bash
# Initialize Alembic
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

#### 6. Start Backend Server

```bash
# Development mode
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
gunicorn app.main:app --bind 0.0.0.0:8000 --workers 4
```

Backend running at: http://localhost:8000

---

### Frontend Setup

#### 1. Install Node.js Dependencies

```bash
cd frontend

# Install packages
npm install

# Or using yarn
yarn install
```

#### 2. Configure Environment

```bash
# Copy environment template
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Edit .env:
VITE_API_URL=http://localhost:8000/api/v1
```

#### 3. Start Development Server

```bash
# Development mode
npm run dev

# Or using yarn
yarn dev
```

Frontend running at: http://localhost:3000

---

## 📁 Project Structure

```
MediBot/
│
├── 📁 backend/                    # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 api/v1/routes/      # API endpoints
│   │   │   ├── auth.py           # Authentication
│   │   │   ├── chat.py           # Chat endpoints
│   │   │   ├── diseases.py       # Disease management
│   │   │   ├── users.py          # User operations
│   │   │   └── admin.py          # Admin panel
│   │   │
│   │   ├── 📁 core/              # Core configurations
│   │   │   ├── config.py         # App settings
│   │   │   ├── security.py       # Auth & encryption
│   │   │   └── database.py       # DB connection
│   │   │
│   │   ├── 📁 models/            # Database models
│   │   │   ├── user.py
│   │   │   ├── disease.py
│   │   │   ├── consultation.py
│   │   │   └── admin.py
│   │   │
│   │   ├── 📁 schemas/           # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── chat.py
│   │   │   └── disease.py
│   │   │
│   │   ├── 📁 nlp/               # NLP Engine ⭐
│   │   │   ├── symptom_extractor.py
│   │   │   └── disease_predictor.py
│   │   │
│   │   └── main.py               # App entry point
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📁 frontend/                   # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Layout.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Chat.tsx          # Main chat interface
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Admin.tsx
│   │   │
│   │   ├── 📁 store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── chatSlice.ts
│   │   │   │   └── diseaseSlice.ts
│   │   │   └── store.ts
│   │   │
│   │   ├── 📁 services/
│   │   │   └── api.ts            # API client
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── Dockerfile
│
├── 📁 database/
│   ├── schema.sql                # PostgreSQL schema
│   ├── init.sql                  # Initialization
│   └── seeds/
│       ├── symptoms_data.py      # 500+ symptoms
│       └── diseases_data.py      # 200+ diseases
│
├── 📁 docker/
│   ├── docker-compose.yml        # Multi-service orchestration
│   └── nginx/
│       └── nginx.conf            # Reverse proxy
│
└── docs/
    ├── DATABASE_SCHEMA.md
    ├── API_DOCUMENTATION.md
    └── UI_UX_DESIGN.md
```

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)

```bash
# Application
APP_NAME=MediBot
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medibot

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-jwt-secret-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

#### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode (Docker)

```bash
cd docker
docker-compose -f docker-compose.yml up -d --build
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:e2e
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

#### 2. **Database Connection Failed**

```bash
# Check PostgreSQL is running
# Windows: Services → PostgreSQL
# Mac: brew services list
# Linux: systemctl status postgresql

# Verify credentials in .env
```

#### 3. **Docker Issues**

```bash
# Clean Docker
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose up -d --build
```

#### 4. **Frontend Not Connecting to Backend**

```bash
# Check API URL in frontend/.env
VITE_API_URL=http://localhost:8000/api/v1

# Verify backend is running
curl http://localhost:8000/health
```

---

## 📊 Database Seeding

To populate the database with medical data:

```bash
cd backend
python -m app.services.seed_database
```

This will add:
- 200+ diseases
- 500+ symptoms
- 400+ home remedies
- 1500+ disease-symptom mappings

---

## 🎯 Next Steps

### After Setup:

1. **Test the Chat**
   - Go to http://localhost:3000/chat
   - Type: "I have fever and headache"
   - See AI-powered response

2. **Create User Account**
   - Register at http://localhost:3000/register
   - Login and access dashboard

3. **Explore Admin Panel**
   - Visit http://localhost:3000/admin
   - Manage diseases and users

4. **Customize**
   - Modify NLP patterns in `backend/app/nlp/`
   - Add more diseases to database
   - Customize UI colors in `tailwind.config.js`

---

## 📞 Support

### Documentation

- **API Docs:** http://localhost:8000/docs
- **Database Schema:** `docs/DATABASE_SCHEMA.md`
- **API Documentation:** `docs/API_DOCUMENTATION.md`

### Team Contacts

- **Mudassir Alam** - Frontend Lead
- **Anas Ali** - Database Lead
- **Neel Kanth** - NLP Lead
- **Syed Hanzala** - Backend Lead

---

## 🎉 Success!

If everything is working:

✅ Backend API running on port 8000  
✅ Frontend running on port 3000  
✅ Database connected  
✅ NLP engine ready  
✅ Chat interface functional  

**You're ready to use MediBot! 🚀**

---

**© 2024 MediBot Team - FYP Project SSUET**
