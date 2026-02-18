@echo off
echo ==========================================
echo  INICIANDO SISTEMA COMPLETO - GESTION TI
echo ==========================================
echo.
echo Este script abrira 2 ventanas:
echo  1. Backend API (Puerto 5000)
echo  2. Frontend React (Puerto 3000)
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
echo.

REM Iniciar Backend en una nueva ventana
echo [1/2] Iniciando Backend API...
start "Backend API - GestionTI" cmd /k "cd backend && npm run dev"

REM Esperar 3 segundos para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar Frontend en otra ventana
echo [2/2] Iniciando Frontend React...
start "Frontend React - GestionTI" cmd /k "npm run dev"

echo.
echo ==========================================
echo  SISTEMA INICIADO CORRECTAMENTE
echo ==========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:3000
echo.
echo Espera unos segundos a que ambos servicios terminen de cargar.
echo Luego abre tu navegador en: http://localhost:3000
echo.
echo Para detener el sistema, cierra ambas ventanas.
echo.
pause
