@echo off
echo =========================================
echo Starting Jedi Archives (Local Admin Mode)
echo =========================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.8+ to use the local editor.
    pause
    exit /b
)

echo Starting the local management server...
python manage_blog.py

pause
