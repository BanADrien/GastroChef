# Setup and Start GastroChef - Seed + Backend + Frontend
Write-Host "Setting up GastroChef..." -ForegroundColor Green

# Seed database
Write-Host "`nSeeding database..." -ForegroundColor Yellow
cd "E:\Cours\MES DEV\GastroChef\server"
node seed.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database seeded successfully!" -ForegroundColor Green
} else {
    Write-Host "Seeding failed!" -ForegroundColor Red
    exit 1
}

# Start Server
Write-Host "`nStarting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\Cours\MES DEV\GastroChef\server'; npm.cmd start"

# Wait for server to start
Start-Sleep -Seconds 2

# Start Client
Write-Host "Starting Frontend Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\Cours\MES DEV\GastroChef\client'; npm.cmd run dev"

Write-Host "`nGastroChef is ready!" -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
