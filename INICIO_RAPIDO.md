# 🚀 Guía de Inicio Rápido

## ⚡ Pasos para Iniciar el Sistema

### 1. Asegúrate de tener MongoDB corriendo

Tu MongoDB debe estar corriendo en `mongodb://localhost:27017` o en tu servidor de Portainer.

**Verificar si MongoDB está corriendo:**
```bash
# En Windows (cmd o PowerShell)
tasklist | findstr mongod

# O abrir MongoDB Compass y conectarte a localhost:27017
```

Si no está corriendo, inícialo desde los servicios de Windows o Docker.

---

### 2. Configurar el Backend

#### a) Ir a la carpeta backend
```bash
cd backend
```

#### b) Verificar archivo .env
Abre `backend/.env` y asegúrate de que la configuración esté correcta:

```env
MONGODB_URI=mongodb://localhost:27017/GestionTI
PORT=5000
JWT_SECRET=tu_clave_secreta_super_segura
```

Si tu MongoDB está en otro servidor, cambia la URL.

#### c) Crear usuario administrador
```bash
npm run create-admin
```

Esto creará el usuario:
- **Username:** soporteti
- **Password:** admin2025

---

### 3. Iniciar el Backend

#### Opción A: Usando el .bat
```bash
iniciar-backend.bat
```

#### Opción B: Con npm
```bash
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
🚀 Servidor iniciado correctamente
📡 Puerto: 5000
```

**Deja esta terminal abierta.**

---

### 4. Iniciar el Frontend

#### Abrir una NUEVA terminal

Desde la raíz del proyecto (no desde backend):

```bash
# Volver a la raíz si estás en backend
cd ..

# Iniciar frontend
iniciar.bat
```

O con npm:
```bash
npm run dev
```

El frontend debería abrir en: **http://localhost:3000**

---

### 5. Acceder al Sistema

1. Abre tu navegador en http://localhost:3000
2. Espera a pasar las pantallas de Splash e Intro
3. En el Login, usa:
   - **Usuario:** soporteti
   - **Contraseña:** admin2025

---

## ✅ Verificación Rápida

### Backend corriendo correctamente:
Abre http://localhost:5000/health en tu navegador.

Deberías ver:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "environment": "development"
}
```

### Frontend conectado al Backend:
Después de hacer login, si ves el Dashboard cargando, ¡todo funciona!

---

## 🐛 Problemas Comunes

### Error: "Cannot connect to MongoDB"
- ✅ Verifica que MongoDB esté corriendo
- ✅ Revisa la URL en `backend/.env`
- ✅ Si usas Docker, asegúrate de que el contenedor esté activo

### Error: "Network Error" o "Failed to fetch"
- ✅ Asegúrate de que el backend esté corriendo en el puerto 5000
- ✅ Verifica que `.env.local` tenga `VITE_API_URL=http://localhost:5000/api`

### El frontend no carga datos
- ✅ Abre la consola del navegador (F12) y busca errores
- ✅ Verifica que el backend esté corriendo
- ✅ Revisa que hayas hecho login correctamente

### Puerto 5000 o 3000 ya está en uso
**Backend (puerto 5000):**
- Cambia `PORT=5001` en `backend/.env`
- Cambia `VITE_API_URL=http://localhost:5001/api` en `.env.local`

**Frontend (puerto 3000):**
- Edita `vite.config.ts` y cambia el puerto en `server.port`

---

## 📝 Estructura de Archivos Importantes

```
.
├── backend/
│   ├── .env                  ← Configuración del backend
│   ├── iniciar-backend.bat   ← Script de inicio
│   └── src/
│       └── server.ts         ← Servidor principal
│
├── .env.local                ← Configuración del frontend
├── iniciar.bat               ← Script de inicio frontend
└── App.tsx                   ← Aplicación React
```

---

## 🔧 Comandos Útiles

### Backend
```bash
cd backend
npm run dev          # Modo desarrollo (auto-reload)
npm run build        # Compilar a producción
npm start            # Ejecutar versión compilada
npm run create-admin # Crear usuario admin
```

### Frontend
```bash
npm run dev          # Modo desarrollo
npm run build        # Compilar a producción
npm run preview      # Ver versión compilada
```

---

## 🎯 Siguiente Paso

Una vez que todo esté funcionando:

1. ✅ Cambia la contraseña del admin desde el sistema
2. ✅ Crea usuarios adicionales si es necesario
3. ✅ Empieza a agregar equipos al inventario
4. ✅ Explora todas las funcionalidades

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa los logs en las terminales
2. Verifica que MongoDB esté corriendo
3. Asegúrate de que ambos servidores (backend y frontend) estén activos

**URLs importantes:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health
- MongoDB: mongodb://localhost:27017

---

¡Listo! Tu sistema de Gestión TI está funcionando. 🎉
