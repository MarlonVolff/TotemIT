@echo off
echo ========================================
echo   Sistema de Totem - Equipamentos TI
echo ========================================
echo.
echo Iniciando backend...
start cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Iniciando frontend...
start cmd /k "cd frontend && npm start"
echo.
echo ========================================
echo   Servidores iniciados!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Usuario padrao TI: admin / admin123
echo.
echo Para acessar via tablet, use o IP do PC:
echo Ex: http://192.168.1.100:3000
echo.
echo Para descobrir seu IP, abra outro terminal e digite: ipconfig
echo.
pause
