@echo off
REM ============================================
REM MediBot - Complete Startup Script
REM ============================================
REM This script starts:
REM 1. Docker Database (PostgreSQL + Redis)
REM 2. Backend Server (FastAPI)
REM 3. Frontend Server (React/Vite)
REM ============================================

echo ============================================
echo   MediBot - AI-Powered Healthcare Chatbot
echo ============================================
echo.

REM Set project directory
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

REM ============================================
REM Step 1: Check and Start Docker Database
REM ============================================
echo [1/3] Starting Database Containers...
echo.

cd /d "%PROJECT_DIR%docker"

REM Check if containers are running
docker ps | findstr "medibot_postgres" >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting Docker containers...
    docker-compose -f docker-compose-db.yml up -d
    
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Failed to start Docker containers!
        echo Please ensure Docker Desktop is running.
        pause
        exit /b 1
    )
    
    echo Waiting for database to be ready (10 seconds)...
    timeout /t 10 /nobreak >nul
) else (
    echo Database containers already running!
)

echo.
echo [OK] Database is ready!
echo.

REM ============================================
REM Step 2: Start Backend Server
REM ============================================
echo [2/3] Starting Backend Server...
echo.

cd /d "%PROJECT_DIR%backend"

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    if exist ".env.example" (
        copy .env.example .env >nul
    ) else (
        echo ERROR: .env.example not found!
        pause
        exit /b 1
    )
)

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Start backend in a new window
echo Starting FastAPI backend on http://localhost:8000...
start "MediBot Backend" cmd /k "cd /d %PROJECT_DIR%backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start (5 seconds)...
timeout /t 5 /nobreak >nul

echo.
echo [OK] Backend server started!
echo.

REM ============================================
REM Step 3: Start Frontend Server
REM ============================================
echo [3/3] Starting Frontend Server...
echo.

cd /d "%PROJECT_DIR%frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start frontend in a new window
echo Starting React frontend on http://localhost:3000...
start "MediBot Frontend" cmd /k "cd /d %PROJECT_DIR%frontend && npm run dev"

echo Waiting for frontend to start (5 seconds)...
timeout /t 5 /nobreak >nul

echo.
echo [OK] Frontend server started!
echo.

REM ============================================
REM Startup Complete
REM ============================================
echo ============================================
echo   MediBot Startup Complete!
echo ============================================
echo.
echo Services Running:
echo   [OK] Database    - localhost:5432
echo   [OK] Backend     - http://localhost:8000
echo   [OK] Frontend    - http://localhost:3000
echo   [OK] API Docs    - http://localhost:8000/docs
echo.
echo Login Credentials:
echo.
echo   User Login:
echo     - Register at: http://localhost:3000/register
echo.
echo   Admin Login:
echo     Email: admin@medibot.com
echo     Password: Admin@123
echo.
echo ============================================
echo.
echo Opening browser...
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:3000

echo.
echo Press any key to stop all services...
pause >nul

REM Stop services
echo.
echo Stopping MediBot...
echo.

echo Stopping backend and frontend...
taskkill /FI "WINDOWTITLE eq MediBot Backend" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq MediBot Frontend" /T /F >nul 2>&1

echo Stopping Docker containers...
cd /d "%PROJECT_DIR%docker"
docker-compose -f docker-compose-db.yml down

echo.
echo MediBot stopped successfully!
echo.
pause
