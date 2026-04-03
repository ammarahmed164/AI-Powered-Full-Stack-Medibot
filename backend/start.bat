@echo off
echo ============================================
echo   MediBot Backend Server
echo ============================================
echo.
echo Starting FastAPI backend with Supabase...
echo.

cd /d "%~dp0"

REM Install dependencies if needed
if not exist "venv" (
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo Backend will run on: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop
echo ============================================
echo.

python main.py
