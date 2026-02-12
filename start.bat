@echo off
echo Starting GastroChef...
echo.

echo Starting Backend Server...
start "GastroChef Backend" cmd /k "cd /d E:\Cours\MES DEV\GastroChef\server && npm.cmd start"

timeout /t 2 /nobreak > nul

echo Starting Frontend Client...
start "GastroChef Frontend" cmd /k "cd /d E:\Cours\MES DEV\GastroChef\client && npm.cmd run dev"

echo.
echo GastroChef is starting!
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
