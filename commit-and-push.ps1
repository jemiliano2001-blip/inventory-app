# Script simple para commit y push rápido
# Uso: .\commit-and-push.ps1 "Mensaje del commit"

param(
    [string]$Message = ""
)

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = "Actualización: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

Write-Host "🔍 Verificando cambios..." -ForegroundColor Cyan

$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "✓ No hay cambios" -ForegroundColor Green
    exit 0
}

Write-Host "📝 Cambios encontrados:" -ForegroundColor Yellow
git status --short

Write-Host "`n➕ Agregando archivos..." -ForegroundColor Cyan
git add .

Write-Host "💾 Creando commit: $Message" -ForegroundColor Cyan
git commit -m $Message

if ($LASTEXITCODE -eq 0) {
    Write-Host "🚀 Enviando a GitHub..." -ForegroundColor Cyan
    $branch = git rev-parse --abbrev-ref HEAD
    git push origin $branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Completado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error en push" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Error en commit" -ForegroundColor Red
}

