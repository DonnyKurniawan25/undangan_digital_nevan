@echo off
title Undangan Digital - Backend (Django)
cd /d "%~dp0backend"

if not exist "venv\" (
    echo Virtual environment belum ada. Jalankan setup.bat terlebih dahulu.
    pause
    exit /b 1
)

call venv\Scripts\activate.bat
echo ============================================
echo   BACKEND DJANGO  -  http://127.0.0.1:8000
echo   Admin: /admin  (user: admin / pass: admin123)
echo   Tekan CTRL+C untuk menghentikan.
echo ============================================
echo.
python manage.py runserver 8000
pause
