@echo off
echo ========================================
echo   Build de Producao - Sistema Totem
echo ========================================
echo.
echo Este script ira:
echo 1. Fazer build do React
echo 2. Preparar para rodar em porta unica
echo.
pause
echo.
echo [1/2] Fazendo build do frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Build do frontend falhou!
    pause
    exit /b 1
)
echo.
echo ========================================
echo   Build concluido com sucesso!
echo ========================================
echo.
echo Agora execute: INICIAR-PRODUCAO.bat
echo.
pause
