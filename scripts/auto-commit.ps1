# Script de PowerShell para hacer commit y push automático de cambios

param(
    [string]$Message = "Actualización automática: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

Write-Host "🔍 Verificando cambios en el repositorio..." -ForegroundColor Cyan

# Cambiar al directorio del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Verificar si hay cambios
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✓ No hay cambios para commitear" -ForegroundColor Green
    exit 0
}

Write-Host "📝 Cambios detectados:" -ForegroundColor Yellow
git status --short

# Agregar todos los cambios
Write-Host "`n➕ Agregando cambios..." -ForegroundColor Cyan
git add .

# Hacer commit
Write-Host "💾 Creando commit..." -ForegroundColor Cyan
git commit -m $Message

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit creado exitosamente" -ForegroundColor Green
    
    # Hacer push
    Write-Host "🚀 Enviando a GitHub..." -ForegroundColor Cyan
    git push origin $Branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cambios enviados exitosamente a GitHub" -ForegroundColor Green
    } else {
        Write-Host "❌ Error al enviar cambios a GitHub" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Error al crear commit" -ForegroundColor Red
    exit 1
}

