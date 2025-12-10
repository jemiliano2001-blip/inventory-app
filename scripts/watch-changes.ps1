# Script para monitorear cambios en tiempo real y hacer commit automatico

param(
    [string]$Branch = "main",
    [int]$IntervalSeconds = 30
)

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MONITOREO AUTOMATICO ACTIVADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Intervalo de verificacion: $IntervalSeconds segundos" -ForegroundColor Gray
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Funcion para hacer commit y push
function CommitAndPush {
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        return $false
    }
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $commitMessage = "Auto-update: $timestamp"
    
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] [*] Cambios detectados..." -ForegroundColor Yellow
    
    git add . 2>&1 | Out-Null
    $commitOutput = git commit -m $commitMessage 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] [OK] Commit creado: $commitMessage" -ForegroundColor Green
        
        $pushOutput = git push origin $Branch 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] [OK] Push exitoso a GitHub" -ForegroundColor Green
        } else {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] [ERROR] Error en push" -ForegroundColor Red
            Write-Host $pushOutput -ForegroundColor Red
        }
        return $true
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] [ERROR] Error al crear commit" -ForegroundColor Red
        Write-Host $commitOutput -ForegroundColor Red
    }
    return $false
}

# Loop principal
$checkCount = 0
try {
    while ($true) {
        $checkCount++
        $currentTime = Get-Date -Format 'HH:mm:ss'
        
        # Mostrar estado cada 10 verificaciones (5 minutos si intervalo es 30s)
        if ($checkCount % 10 -eq 0) {
            Write-Host "[$currentTime] Verificando... (check #$checkCount)" -ForegroundColor Gray
        }
        
        CommitAndPush | Out-Null
        Start-Sleep -Seconds $IntervalSeconds
    }
} catch {
    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "MONITOREO DETENIDO" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
}

