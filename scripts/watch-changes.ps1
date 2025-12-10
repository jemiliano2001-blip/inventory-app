# Script para monitorear cambios en tiempo real y hacer commit automático

param(
    [string]$Branch = "main",
    [int]$IntervalSeconds = 30
)

$ErrorActionPreference = "Continue"

Write-Host "👀 Monitoreando cambios en el proyecto..." -ForegroundColor Cyan
Write-Host "Intervalo de verificación: $IntervalSeconds segundos" -ForegroundColor Gray
Write-Host "Presiona Ctrl+C para detener`n" -ForegroundColor Yellow

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Función para hacer commit y push
function CommitAndPush {
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        return $false
    }
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $commitMessage = "Auto-update: $timestamp"
    
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] 🔄 Cambios detectados..." -ForegroundColor Yellow
    
    git add . | Out-Null
    git commit -m $commitMessage | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✅ Commit creado: $commitMessage" -ForegroundColor Green
        
        git push origin $Branch | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✅ Push exitoso a GitHub" -ForegroundColor Green
        } else {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⚠️ Error en push" -ForegroundColor Red
        }
        return $true
    }
    return $false
}

# Loop principal
try {
    while ($true) {
        CommitAndPush | Out-Null
        Start-Sleep -Seconds $IntervalSeconds
    }
} catch {
    Write-Host "`n🛑 Monitoreo detenido" -ForegroundColor Yellow
}

