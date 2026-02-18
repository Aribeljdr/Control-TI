# Backend - API GestionTI

Backend API REST para el Sistema de Mantenimiento Preventivo TI.

## Tecnologías

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Zod** - Validación de datos
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Edita el archivo `.env` con tus configuraciones:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/GestionTI

# JWT Secrets (CÁMBIALOS EN PRODUCCIÓN)
JWT_SECRET=tu_clave_secreta_aqui
JWT_REFRESH_SECRET=tu_clave_refresh_aqui

# Frontend URL
CORS_ORIGIN=http://localhost:3000
```

### 3. Iniciar MongoDB

Asegúrate de que MongoDB esté corriendo en tu servidor:

```bash
# Si usas MongoDB local
mongod
```

### 4. Crear usuario administrador

```bash
npm run create-admin
```

Esto creará un usuario con las siguientes credenciales:
- **Username:** soporteti
- **Password:** admin2025
- **Role:** admin

### 5. Iniciar el servidor

#### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

#### Modo producción:
```bash
npm run build
npm start
```

O usa el archivo BAT:
```bash
iniciar-backend.bat
```

## Endpoints del API

Base URL: `http://localhost:5000/api`

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Equipos

- `GET /api/equipments` - Listar todos los equipos
- `GET /api/equipments/:id` - Obtener equipo por ID
- `POST /api/equipments` - Crear equipo
- `PUT /api/equipments/:id` - Actualizar equipo
- `DELETE /api/equipments/:id` - Eliminar equipo

### Mantenimientos

- `GET /api/maintenances` - Listar mantenimientos
- `GET /api/maintenances/:id` - Obtener mantenimiento por ID
- `POST /api/maintenances` - Crear mantenimiento
- `PUT /api/maintenances/:id` - Actualizar mantenimiento
- `DELETE /api/maintenances/:id` - Eliminar mantenimiento

### Bitácora TI

- `GET /api/bitacora` - Listar todas las bitácoras
- `GET /api/bitacora/:date` - Obtener bitácora por fecha
- `POST /api/bitacora` - Crear/Actualizar bitácora
- `DELETE /api/bitacora/:date` - Eliminar bitácora

### Credenciales

- `GET /api/credentials/categories` - Listar categorías
- `POST /api/credentials/categories` - Crear categoría
- `GET /api/credentials` - Listar credenciales
- `GET /api/credentials/:id` - Obtener credencial por ID
- `POST /api/credentials` - Crear credencial
- `PUT /api/credentials/:id` - Actualizar credencial
- `DELETE /api/credentials/:id` - Eliminar credencial

### Manuales TI

- `GET /api/manuals/folders` - Listar carpetas
- `POST /api/manuals/folders` - Crear carpeta
- `PUT /api/manuals/folders/:id` - Actualizar carpeta
- `DELETE /api/manuals/folders/:id` - Eliminar carpeta
- `GET /api/manuals` - Listar manuales
- `GET /api/manuals/:id` - Obtener manual por ID
- `POST /api/manuals` - Crear manual
- `PUT /api/manuals/:id` - Actualizar manual
- `DELETE /api/manuals/:id` - Eliminar manual

## Autenticación

Todos los endpoints (excepto `/auth/register` y `/auth/login`) requieren autenticación JWT.

### Uso del token:

```javascript
headers: {
  'Authorization': 'Bearer TU_TOKEN_AQUI'
}
```

## Roles de Usuario

- **admin**: Acceso completo (crear, editar, eliminar)
- **technician**: Puede crear y editar, pero no eliminar
- **viewer**: Solo lectura

## Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Rate limiting (100 requests por 15 minutos)
- Helmet para headers de seguridad
- CORS configurado
- Validación de datos con Zod

## Desarrollo

### Estructura de carpetas

```
backend/
├── src/
│   ├── config/          # Configuración (DB, env)
│   ├── models/          # Modelos de Mongoose
│   ├── controllers/     # Lógica de negocio
│   ├── routes/          # Rutas del API
│   ├── middleware/      # Middlewares (auth, validación, errores)
│   ├── utils/           # Utilidades (JWT, helpers)
│   ├── types/           # Tipos de TypeScript
│   ├── scripts/         # Scripts de utilidad
│   └── server.ts        # Punto de entrada
├── .env                 # Variables de entorno
└── package.json
```

## Troubleshooting

### Error: "Cannot connect to MongoDB"

- Verifica que MongoDB esté corriendo
- Comprueba la URL de conexión en `.env`
- Asegúrate de que la base de datos "GestionTI" exista

### Error: "JWT malformed"

- Verifica que estés enviando el token en el header correcto
- Asegúrate de que el token no haya expirado

### Error: "Port already in use"

- Cambia el puerto en `.env` (PORT=5001)
- O cierra la aplicación que está usando el puerto 5000
