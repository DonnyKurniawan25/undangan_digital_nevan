@echo off
title Undangan Digital - Frontend (React)
cd /d "%~dp0frontend"

if not exist "node_modules\" (
    echo Dependency belum terinstall. Jalankan setup.bat terlebih dahulu.
    pause
    exit /b 1
)

echo ============================================
echo   FRONTEND REACT  -  http://localhost:5173
echo.
echo   Beranda : http://localhost:5173/
echo   Elegant : http://localhost:5173/undangan/rina-dimas?to=Bapak Andi
echo   Floral  : http://localhost:5173/undangan/sasha-bagas?to=Ibu Sari
echo.
echo   Tekan CTRL+C untuk menghentikan.
echo ============================================
echo.
call npm run dev
pause
