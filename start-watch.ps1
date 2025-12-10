# Script simple para iniciar monitoreo automatico
# Uso: .\start-watch.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INICIANDO MONITOREO AUTOMATICO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script monitoreara cambios cada 30 segundos" -ForegroundColor Gray
Write-Host "y hara commit/push automatico a GitHub." -ForegroundColor Gray
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el monitoreo" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Iniciar el script de watch
powershell -ExecutionPolicy Bypass -File scripts/watch-changes.ps1

