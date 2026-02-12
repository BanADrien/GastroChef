# Start GastroChef - Backend and Frontend
Write-Host "Starting GastroChef..." -ForegroundColor Green

# Start Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\Cours\MES DEV\GastroChef\server'; npm.cmd start"

# Wait a bit for server to start
Start-Sleep -Seconds 2

# Start Client
Write-Host "Starting Frontend Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\Cours\MES DEV\GastroChef\client'; npm.cmd run dev"

Write-Host "`nGastroChef is starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
