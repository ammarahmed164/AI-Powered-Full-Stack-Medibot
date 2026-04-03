# 🚀 MediBot - Quick Start Guide

## Complete Login System Setup

### ✅ What's Been Implemented:

1. **User Login System**
   - Professional registration with complete medical profile
   - Data saved securely to PostgreSQL database
   - JWT token authentication
   - Password hashing with bcrypt

2. **Admin Portal**
   - Separate admin login page
   - View all registered users
   - Complete medical profile dashboard
   - User statistics and analytics

3. **Backend & Frontend**
   - FastAPI backend with full authentication
   - React frontend with professional UI
   - Docker database setup (PostgreSQL + Redis)

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Python 3.11+** installed
- ✅ **Node.js 18+** installed
- ✅ **Docker Desktop** installed and running
- ✅ **Git** (optional, for cloning)

---

## 🎯 Quick Start (3 Easy Steps)

### Option 1: Start Everything with One Click

```bash
# Double-click this file or run from command line:
start-all.bat
```

This will automatically:
1. ✅ Start Docker database (PostgreSQL + Redis)
2. ✅ Start Backend server (http://localhost:8000)
3. ✅ Start Frontend server (http://localhost:3000)
4. ✅ Open browser automatically

---

### Option 2: Manual Start (Step by Step)

#### Step 1: Start Database

```bash
cd docker
docker-compose -f docker-compose-db.yml up -d
```

Wait 10 seconds for database to initialize.

#### Step 2: Start Backend

```bash
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

# Install dependencies (first time only)
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

#### Step 3: Start Frontend

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🔐 Login Credentials

### 👨‍💼 Admin Login

**Access:** http://localhost:3000/admin-login

```
Email: admin@medibot.com
Password: Admin@123
```

**Features:**
- View all registered users
- Complete medical profiles
- User statistics
- Active/inactive status

### 👤 User Login

**Access:** http://localhost:3000/login

**New Users:** Register at http://localhost:3000/register

**Registration saves:**
- Email & Password (hashed)
- Full Name
- Phone Number
- Date of Birth
- Gender
- Blood Group
- Height & Weight (BMI calculated)
- Medical History
- Allergies
- Current Medications

---

## 📊 How It Works

### User Registration Flow:

```
1. User fills registration form
   ↓
2. Frontend sends POST to /api/v1/auth/register
   ↓
3. Backend validates data
   ↓
4. Password hashed with bcrypt
   ↓
5. User saved to PostgreSQL database
   ↓
6. Success! Redirect to login
```

### User Login Flow:

```
1. User enters email & password
   ↓
2. Frontend sends POST to /api/v1/auth/login
   ↓
3. Backend verifies credentials
   ↓
4. JWT token generated
   ↓
5. Check user role:
   - If admin → Redirect to /admin-panel
   - If user → Redirect to /dashboard
```

### Admin Portal Flow:

```
1. Admin enters credentials
   ↓
2. Frontend sends POST to /api/v1/admin/admin/login
   ↓
3. Backend verifies admin credentials
   ↓
4. Admin token generated
   ↓
5. Redirect to /admin-panel
   ↓
6. Load all users from database
   ↓
7. Display in professional table
```

---

## 🗄️ Database Information

### Connection Details:

```
Host: localhost
Port: 5432
Database: medibot
User: medibot_user
Password: MediBot@Secure2024!
```

### View Database:

```bash
# Using psql
docker exec -it medibot_postgres psql -U medibot_user -d medibot

# View all users
SELECT email, full_name, role, created_at FROM users;

# View admin users
SELECT * FROM admin_users;
```

---

## 🧪 Testing the System

### Test 1: User Registration

1. Go to http://localhost:3000/register
2. Fill in the form:
   - Email: test@example.com
   - Password: Test@123
   - Full Name: John Doe
   - Phone: +1234567890
3. Click "Sign Up"
4. ✅ User saved to database!

### Test 2: User Login

1. Go to http://localhost:3000/login
2. Enter credentials from registration
3. Click "Login"
4. ✅ Redirected to dashboard!

### Test 3: Admin Login

1. Go to http://localhost:3000/admin-login
2. Enter:
   - Email: admin@medibot.com
   - Password: Admin@123
3. Click "Login as Admin"
4. ✅ Redirected to admin panel!
5. ✅ See all registered users!

---

## 🔧 Troubleshooting

### Issue: Docker containers won't start

**Solution:**
```bash
# Check Docker is running
docker ps

# Restart Docker Desktop
# Windows: Right-click Docker icon → Restart
# Mac: Right-click Docker icon → Restart

# Remove old containers
docker-compose -f docker-compose-db.yml down -v
docker-compose -f docker-compose-db.yml up -d
```

### Issue: Backend won't start

**Solution:**
```bash
cd backend

# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip uninstall -y -r requirements.txt
pip install -r requirements.txt

# Check .env file exists
if not exist .env copy .env.example .env
```

### Issue: Frontend won't start

**Solution:**
```bash
cd frontend

# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Start again
npm run dev
```

### Issue: CORS errors

**Solution:**
Check backend `.env` file:
```
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Issue: Database connection error

**Solution:**
```bash
# Check containers are running
docker ps

# Should see:
# medibot_postgres
# medibot_redis

# If not running:
cd docker
docker-compose -f docker-compose-db.yml up -d
```

---

## 📁 Project Structure

```
MediBot/
│
├── 📁 backend/                    # FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 api/v1/routes/
│   │   │   ├── auth.py           # User authentication
│   │   │   └── admin.py          # Admin panel APIs
│   │   ├── 📁 core/
│   │   │   ├── config.py         # Settings
│   │   │   ├── security.py       # Password hashing, JWT
│   │   │   └── database.py       # DB connection
│   │   ├── 📁 models/
│   │   │   ├── user.py           # User model
│   │   │   └── admin.py          # Admin model
│   │   └── main.py               # Entry point
│   ├── .env                      # Configuration
│   └── requirements.txt          # Dependencies
│
├── 📁 frontend/                   # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Login.tsx         # User login
│   │   │   ├── Register.tsx      # User registration
│   │   │   ├── AdminLogin.tsx    # Admin login
│   │   │   └── AdminPanel.tsx    # Admin dashboard
│   │   ├── 📁 store/
│   │   │   └── slices/
│   │   │       └── authSlice.ts  # Authentication state
│   │   └── 📁 services/
│   │       └── api.ts            # API calls
│   ├── .env                      # Frontend config
│   └── package.json
│
├── 📁 docker/
│   └── docker-compose-db.yml     # PostgreSQL + Redis
│
├── start-all.bat                 # One-click startup
├── run-backend.bat               # Backend only
└── README.md                     # This file
```

---

## 🛡️ Security Features

### Password Security:
- ✅ Bcrypt hashing (12 rounds)
- ✅ Minimum 8 characters
- ✅ Requires uppercase letter
- ✅ Requires number
- ✅ Requires special character

### Token Security:
- ✅ JWT tokens (HS256 algorithm)
- ✅ 30-minute access token expiry
- ✅ 7-day refresh token expiry
- ✅ Automatic token validation

### Database Security:
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Email format validation
- ✅ Role-based access control (RBAC)
- ✅ HIPAA-compliant audit logging

---

## 📞 Support

### View API Documentation:
http://localhost:8000/docs

### Check Backend Logs:
Look at the backend terminal window

### Check Frontend Console:
Press F12 in browser → Console tab

### Check Database:
```bash
docker exec -it medibot_postgres psql -U medibot_user -d medibot
```

---

## ✅ Success Checklist

After starting everything, verify:

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Database running on localhost:5432
- [ ] Can access API docs at http://localhost:8000/docs
- [ ] Can register new user
- [ ] Can login as user
- [ ] Can login as admin
- [ ] Can see users in admin panel

---

## 🎉 You're All Set!

Your MediBot system is now running with:
- ✅ Professional user authentication
- ✅ Complete medical profile storage
- ✅ Admin dashboard with user management
- ✅ Secure database integration
- ✅ Beautiful, responsive UI

**Happy coding! 🚀**

---

*© 2024 MediBot Team - BS Computer Science, Batch 2022F, SSUET*
