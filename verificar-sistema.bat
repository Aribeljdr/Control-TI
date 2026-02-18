@echo off
chcp 65001 >nul
echo.
echo ========================================
echo  VERIFICACIÓN DEL SISTEMA - GESTIÓN TI
echo ========================================
echo.
echo Este script verifica que todos los componentes
echo del sistema estén correctamente configurados.
echo.
pause
echo.

set ERRORES=0

REM Verificar Node.js
echo [1/8] Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js NO está instalado
    echo    Descargar desde: https://nodejs.org
    set /a ERRORES+=1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js instalado: %NODE_VERSION%
)
echo.

REM Verificar npm
echo [2/8] Verificando npm...
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm NO está instalado
    set /a ERRORES+=1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm instalado: %NPM_VERSION%
)
echo.

REM Verificar MongoDB
echo [3/8] Verificando MongoDB...
mongod --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MongoDB NO está instalado o no está en PATH
    echo    Opciones:
    echo    - Instalar MongoDB Community: https://www.mongodb.com/try/download/community
    echo    - Usar MongoDB Atlas (nube): https://cloud.mongodb.com
    set /a ERRORES+=1
) else (
    for /f "tokens=3" %%i in ('mongod --version ^| findstr "version"') do set MONGO_VERSION=%%i
    echo ✅ MongoDB instalado
)
echo.

REM Verificar archivo package.json en raíz
echo [4/8] Verificando dependencias del frontend...
if not exist "package.json" (
    echo ❌ No se encontró package.json en la raíz
    set /a ERRORES+=1
) else (
    if not exist "node_modules" (
        echo ⚠️  Dependencias NO instaladas
        echo    Ejecutar: npm install
        set /a ERRORES+=1
    ) else (
        echo ✅ Dependencias del frontend instaladas
    )
)
echo.

REM Verificar backend
echo [5/8] Verificando dependencias del backend...
if not exist "backend\package.json" (
    echo ❌ No se encontró backend\package.json
    set /a ERRORES+=1
) else (
    if not exist "backend\node_modules" (
        echo ⚠️  Dependencias del backend NO instaladas
        echo    Ejecutar: cd backend ^&^& npm install
        set /a ERRORES+=1
    ) else (
        echo ✅ Dependencias del backend instaladas
    )
)
echo.

REM Verificar archivos de configuración
echo [6/8] Verificando archivos de configuración...

REM Frontend .env.local
if not exist ".env.local" (
    echo ⚠️  No se encontró .env.local
    if exist ".env.example" (
        echo    Copiar .env.example a .env.local
        echo    Comando: copy .env.example .env.local
    )
    set /a ERRORES+=1
) else (
    echo ✅ Archivo .env.local existe
)

REM Backend .env
if not exist "backend\.env" (
    echo ⚠️  No se encontró backend\.env
    if exist "backend\.env.example" (
        echo    Copiar backend\.env.example a backend\.env
        echo    Comando: copy backend\.env.example backend\.env
    )
    set /a ERRORES+=1
) else (
    echo ✅ Archivo backend\.env existe
)
echo.

REM Verificar archivos críticos
echo [7/8] Verificando archivos críticos del proyecto...

set ARCHIVOS_CRITICOS=0

if not exist "index.html" (
    echo ❌ index.html NO encontrado
    set /a ERRORES+=1
    set /a ARCHIVOS_CRITICOS+=1
) else (
    echo ✅ index.html
)

if not exist "index.tsx" (
    echo ❌ index.tsx NO encontrado
    set /a ERRORES+=1
    set /a ARCHIVOS_CRITICOS+=1
) else (
    echo ✅ index.tsx
)

if not exist "index.css" (
    echo ❌ index.css NO encontrado
    set /a ERRORES+=1
    set /a ARCHIVOS_CRITICOS+=1
) else (
    echo ✅ index.css
)

if not exist "App.tsx" (
    echo ❌ App.tsx NO encontrado
    set /a ERRORES+=1
    set /a ARCHIVOS_CRITICOS+=1
) else (
    echo ✅ App.tsx
)

if not exist "backend\src\server.ts" (
    echo ❌ backend\src\server.ts NO encontrado
    set /a ERRORES+=1
    set /a ARCHIVOS_CRITICOS+=1
) else (
    echo ✅ backend\src\server.ts
)
echo.

REM Verificar MongoDB corriendo
echo [8/8] Verificando conexión a MongoDB...
echo.
echo Intentando conectar a MongoDB local (localhost:27017)...
echo.

REM Crear script temporal de verificación
echo const mongoose = require('mongoose'); > temp_check.js
echo mongoose.connect('mongodb://localhost:27017/test', { >> temp_check.js
echo   serverSelectionTimeoutMS: 3000 >> temp_check.js
echo }).then(() =^> { >> temp_check.js
echo   console.log('CONECTADO'); >> temp_check.js
echo   process.exit(0); >> temp_check.js
echo }).catch(() =^> { >> temp_check.js
echo   console.log('NO_CONECTADO'); >> temp_check.js
echo   process.exit(1); >> temp_check.js
echo }); >> temp_check.js

if exist "backend\node_modules\mongoose" (
    cd backend
    node ..\temp_check.js >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MongoDB está corriendo y aceptando conexiones
    ) else (
        echo ⚠️  MongoDB NO está corriendo o no acepta conexiones
        echo    Opciones:
        echo    1. Iniciar MongoDB local:
        echo       - Windows Service: net start MongoDB
        echo       - Manual: mongod --dbpath "C:\data\db"
        echo    2. Usar MongoDB Atlas (configurar en backend\.env)
        set /a ERRORES+=1
    )
    cd ..
) else (
    echo ⚠️  No se puede verificar MongoDB (mongoose no instalado)
    echo    Ejecutar: cd backend ^&^& npm install
)

del temp_check.js >nul 2>&1

echo.
echo ========================================
echo  RESULTADO DE LA VERIFICACIÓN
echo ========================================
echo.

if %ERRORES% EQU 0 (
    echo ✅ SISTEMA LISTO PARA USAR
    echo.
    echo Todo está configurado correctamente.
    echo Puedes iniciar el sistema con:
    echo    iniciar-sistema-completo.bat
    echo.
) else (
    echo ⚠️  SE ENCONTRARON %ERRORES% PROBLEMA(S)
    echo.
    echo Por favor, corrige los errores indicados arriba
    echo antes de iniciar el sistema.
    echo.
    echo Necesitas ayuda? Consulta:
    echo - INICIO_RAPIDO.md
    echo - PROYECTO_README.md
    echo - CAMBIOS_Y_MEJORAS.md
)

echo ========================================
echo.
pause
