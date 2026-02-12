@echo off
echo Setting up GastroChef...
echo.

echo Seeding database...
cd /d E:\Cours\MES DEV\GastroChef\server
node seed.js

if %errorlevel% neq 0 (
    echo Seeding failed!
    pause
    exit /b 1
)

echo Database seeded successfully!
echo.

echo Starting Backend Server...
start "GastroChef Backend" cmd /k "cd /d E:\Cours\MES DEV\GastroChef\server && npm.cmd start"

timeout /t 2 /nobreak > nul

echo Starting Frontend Client...
start "GastroChef Frontend" cmd /k "cd /d E:\Cours\MES DEV\GastroChef\client && npm.cmd run dev"

echo.
echo GastroChef is ready!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
pause
