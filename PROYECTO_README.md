# Sistema de Gestión de Mantenimiento Preventivo TI

Sistema completo de gestión de mantenimiento preventivo para equipos de TI, con arquitectura Cliente-Servidor separada.

## 🏗️ Arquitectura del Proyecto

Este proyecto utiliza una **arquitectura Cliente-Servidor separada**:

```
mantenimiento-preventivo-it/
├── backend/              # API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/      # Configuración (DB, env)
│   │   ├── models/      # Modelos Mongoose
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── routes/      # Rutas del API
│   │   ├── middleware/  # Auth, validación, errores
│   │   ├── utils/       # JWT, helpers
│   │   └── server.ts    # Servidor principal
│   ├── .env            # Variables de entorno
│   └── package.json
│
├── (resto del proyecto) # Frontend React + Vite
│   ├── components/      # Componentes React
│   ├── pages/          # Páginas/Vistas
│   ├── services/       # Servicios API
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilidades
│   └── types.ts        # Tipos TypeScript
│
├── .env.local          # Variables entorno frontend
└── iniciar.bat         # Script inicio frontend
```

## 🚀 Tecnologías

### Backend
- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Zod** - Validación
- **Helmet** - Seguridad

### Frontend
- **React 19** + **TypeScript**
- **Vite** - Build tool
- **React Router** - Navegación
- **Lucide React** - Iconos
- **Recharts** - Gráficos

## 📋 Prerrequisitos

1. **Node.js** (v18 o superior)
2. **MongoDB** (local o remoto)
3. **Git** (opcional)

## 🔧 Instalación y Configuración

### 1. Configurar Backend

```bash
# Ir a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Edita backend/.env con tus configuraciones:
# - MONGODB_URI (URL de tu MongoDB)
# - JWT_SECRET (clave secreta para JWT)
# - CORS_ORIGIN (URL del frontend)

# Crear usuario administrador
npm run create-admin
```

### 2. Configurar Frontend

```bash
# Volver a la raíz del proyecto
cd ..

# Instalar dependencias (si no están instaladas)
npm install

# Configurar variables de entorno
# Edita .env.local con:
# - VITE_API_URL=http://localhost:5000/api
```

## ▶️ Iniciar el Proyecto

### Opción 1: Scripts BAT (Windows)

```bash
# Terminal 1: Iniciar Backend
cd backend
iniciar-backend.bat

# Terminal 2: Iniciar Frontend
iniciar.bat
```

### Opción 2: Comandos NPM

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd ..
npm run dev
```

## 🔐 Credenciales por Defecto

Después de ejecutar `npm run create-admin` en el backend:

- **Usuario:** soporteti
- **Contraseña:** admin2025
- **Rol:** admin

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login en producción.

## 📡 URLs del Sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## 🎯 Funcionalidades Principales

### ✅ Implementado

1. **Autenticación JWT**
   - Login con usuario/contraseña
   - Tokens con expiración
   - Middleware de autenticación
   - Roles (admin, technician, viewer)

2. **Gestión de Equipos**
   - CRUD completo
   - Filtros por área, estado, tipo
   - Componentes detallados
   - Historial de mantenimientos

3. **Mantenimientos**
   - Preventivos y correctivos
   - Registro de acciones
   - Fotos antes/después
   - Actualización automática de estado

4. **Bitácora TI**
   - Registro diario de actividades
   - Solicitudes de soporte
   - Estados del día
   - Resúmenes

5. **Credenciales**
   - Gestión de contraseñas
   - Categorías personalizadas
   - Campos dinámicos
   - Auditoría de cambios
   - Verificación de credenciales

6. **Manuales / Wiki TI**
   - Carpetas organizadas
   - Contenido rico
   - Imágenes embebidas
   - Tags y búsqueda

7. **Seguridad**
   - Contraseñas hasheadas (bcrypt)
   - Validación con Zod
   - Rate limiting
   - CORS configurado
   - Helmet headers

## 📊 API Endpoints

Ver documentación completa en: `backend/README.md`

### Principales endpoints:

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/equipments` - Listar equipos
- `POST /api/equipments` - Crear equipo
- `GET /api/maintenances` - Listar mantenimientos
- `GET /api/bitacora` - Obtener bitácoras
- `GET /api/credentials` - Listar credenciales
- `GET /api/manuals` - Listar manuales

## 🔒 Seguridad

### Backend
- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ JWT con expiración (7 días access, 30 días refresh)
- ✅ Validación de datos con Zod
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet para headers seguros
- ✅ CORS configurado
- ✅ Variables de entorno (.env)

### Frontend
- ✅ Tokens almacenados en localStorage (considerar httpOnly cookies)
- ✅ Rutas protegidas con ProtectedRoute
- ✅ Logout automático en 401
- ✅ Sanitización de inputs

## 🚧 Próximos Pasos (Opcional)

### Para Producción:
- [ ] Implementar HTTPS
- [ ] Configurar Nginx como proxy reverso
- [ ] Docker + Docker Compose
- [ ] CI/CD con GitHub Actions
- [ ] Backups automáticos de MongoDB
- [ ] Logs centralizados
- [ ] Monitoreo (PM2, New Relic, etc.)
- [ ] Tests unitarios e integración

### Mejoras Funcionales:
- [ ] Exportar reportes a PDF/Excel
- [ ] Notificaciones por email
- [ ] Dashboard avanzado con métricas
- [ ] Carga masiva de equipos (CSV/Excel)
- [ ] Firma digital en mantenimientos
- [ ] Historial de cambios (audit log completo)

## 🐛 Troubleshooting

### Backend no inicia
- Verifica que MongoDB esté corriendo
- Revisa las variables en `backend/.env`
- Comprueba que el puerto 5000 no esté en uso

### Frontend no conecta con Backend
- Verifica que `VITE_API_URL` en `.env.local` sea correcto
- Asegúrate de que el backend esté corriendo
- Revisa la consola del navegador para errores CORS

### Error de autenticación
- Verifica que hayas creado el usuario admin (`npm run create-admin`)
- Comprueba que las credenciales sean correctas
- Revisa que el token JWT no haya expirado

## 📝 Notas Importantes

1. **MongoDB**: El proyecto está configurado para usar la base de datos `GestionTI`
2. **Puertos**: Backend usa 5000, Frontend usa 3000 (configurable en vite.config.ts)
3. **CORS**: Backend permite solo requests desde `http://localhost:3000` por defecto
4. **Tokens**: Los JWT access tokens expiran en 7 días
5. **Rate Limiting**: 100 requests por 15 minutos por IP

## 👥 Roles y Permisos

- **admin**: Acceso total (CRUD en todo)
- **technician**: Puede crear y editar, pero no eliminar
- **viewer**: Solo lectura

## 📞 Soporte

Para reportar bugs o solicitar features, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0
**Fecha:** Diciembre 2025
**Desarrollado para:** Aleph / Bioelectron
