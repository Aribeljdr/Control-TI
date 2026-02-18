@echo off
echo ========================================
echo Iniciando Backend - API GestionTI
echo ========================================
echo.

REM Verificar/Crear usuario admin
echo [1/2] Verificando usuario administrador...
echo.
call npm run create-admin
echo.

REM Iniciar el servidor en modo desarrollo
echo [2/2] Iniciando servidor de desarrollo...
echo.
echo La API estara disponible en: http://localhost:5000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call npm run dev

pause
