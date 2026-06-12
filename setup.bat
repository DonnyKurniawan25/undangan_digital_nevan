@echo off
title Undangan Digital - Setup
echo ============================================
echo   SETUP UNDANGAN PERNIKAHAN DIGITAL
echo ============================================
echo.

echo [1/4] Menyiapkan backend (Django)...
cd /d "%~dp0backend"
if not exist "venv\" (
    echo     - Membuat virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo     - Menginstall dependency Python...
python -m pip install --upgrade pip >nul
pip install -r requirements.txt
if errorlevel 1 goto error

echo.
echo [2/4] Migrasi database...
python manage.py migrate
if errorlevel 1 goto error

echo.
echo [3/4] Mengisi data contoh...
python manage.py seed_demo

echo.
echo [4/4] Menyiapkan frontend (React)...
cd /d "%~dp0frontend"
echo     - Menginstall dependency Node...
call npm install
if errorlevel 1 goto error

echo.
echo ============================================
echo   SETUP SELESAI!
echo   Jalankan start.bat untuk memulai aplikasi.
echo ============================================
echo.
pause
exit /b 0

:error
echo.
echo ============================================
echo   TERJADI KESALAHAN SAAT SETUP.
echo   Periksa pesan error di atas.
echo ============================================
echo.
pause
exit /b 1
