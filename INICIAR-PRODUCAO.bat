@echo off
echo ========================================
echo   Sistema Totem - Modo Producao
echo   (Porta Unica - Sem Bloqueio)
echo ========================================
echo.

REM Verificar se o build existe
if not exist "frontend\build\index.html" (
    echo ERRO: Build do frontend nao encontrado!
    echo.
    echo Execute primeiro: BUILD-PRODUCAO.bat
    echo.
    pause
    exit /b 1
)

echo Sistema rodando em PORTA UNICA (porta 80)
echo Frontend e Backend no mesmo servidor
echo.
echo Iniciando servidor...
echo.

cd backend
node src/server.js

pause
