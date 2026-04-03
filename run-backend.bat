@echo off
REM ============================================
REM MediBot Backend Startup Script
REM ============================================
REM This script starts only the backend server
REM ============================================

echo ============================================
echo   MediBot Backend Server
echo ============================================
echo.

REM Set project directory
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

REM Check if .env exists in backend folder
cd /d "%PROJECT_DIR%backend"
if not exist ".env" (
    echo Creating .env file...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo .env file created!
    ) else (
        echo WARNING: .env.example not found!
    )
)

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo.
    echo WARNING: Virtual environment not found!
    echo Install dependencies with: pip install -r requirements.txt
    echo.
)

echo.
echo Starting FastAPI backend...
echo.
echo Server will run on: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.
echo ============================================
echo.

REM Start the backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
