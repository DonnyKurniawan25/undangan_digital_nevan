@echo off
title Undangan Digital - Launcher
echo ============================================
echo   MENJALANKAN UNDANGAN PERNIKAHAN DIGITAL
echo ============================================
echo.

if not exist "%~dp0backend\venv\" (
    echo Backend belum di-setup. Menjalankan setup.bat...
    echo.
    call "%~dp0setup.bat"
)
if not exist "%~dp0frontend\node_modules\" (
    echo Frontend belum di-setup. Menjalankan setup.bat...
    echo.
    call "%~dp0setup.bat"
)

echo Membuka server backend dan frontend di jendela terpisah...
start "Backend Django" cmd /k "%~dp0run-backend.bat"
timeout /t 3 /nobreak >nul
start "Frontend React" cmd /k "%~dp0run-frontend.bat"

echo.
echo ============================================
echo   Backend  : http://127.0.0.1:8000
echo   Frontend : http://localhost:5173
echo.
echo   Browser akan terbuka otomatis sebentar lagi.
echo ============================================
timeout /t 6 /nobreak >nul
start "" "http://localhost:5173/"
exit /b 0
