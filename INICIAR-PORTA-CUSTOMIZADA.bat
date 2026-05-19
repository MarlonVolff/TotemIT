@echo off
echo ========================================
echo   Sistema Totem - Porta Customizada
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

echo Qual porta voce deseja usar?
echo.
echo Portas comuns permitidas em empresas:
echo   80  - HTTP padrao (requer admin)
echo   8080 - Alternativa comum
echo   8000 - Alternativa comum
echo   5000 - Alternativa comum
echo   3000 - Alternativa (pode estar bloqueada)
echo.
set /p PORTA="Digite a porta (ex: 8080): "

echo.
echo Iniciando servidor na porta %PORTA%...
echo.

cd backend
set PORT=%PORTA%
node src/server.js

pause
