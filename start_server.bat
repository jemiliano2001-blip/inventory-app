@echo off
echo 🚀 Iniciando servidor local para la aplicacion de inventario...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no esta instalado o no esta en el PATH
    echo.
    echo 💡 Soluciones:
    echo    1. Instalar Python desde https://python.org
    echo    2. O usar Node.js con: npx http-server
    echo    3. O usar PHP con: php -S localhost:8000
    echo.
    pause
    exit /b 1
)

echo ✅ Python encontrado, iniciando servidor...
python start_server.py

pause
