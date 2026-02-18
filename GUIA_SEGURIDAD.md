# 🔒 GUÍA DE SEGURIDAD
## Sistema de Mantenimiento Preventivo IT

---

## ⚠️ ACCIONES URGENTES ANTES DE PRODUCCIÓN

### 1. Cambiar JWT Secrets

Las claves JWT actuales son valores de ejemplo y DEBEN cambiarse en producción.

**Generar claves seguras:**

```bash
# Abrir terminal de Node.js y ejecutar:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Esto generará una clave aleatoria de 128 caracteres hexadecimales.

**Ejecutar DOS veces** para obtener:
1. `JWT_SECRET`
2. `JWT_REFRESH_SECRET`

**Editar archivo `backend/.env`:**

```env
# Reemplazar con las claves generadas
JWT_SECRET=tu_clave_generada_aqui_128_caracteres
JWT_REFRESH_SECRET=otra_clave_diferente_aqui_128_caracteres
```

---

### 2. Cambiar Contraseña del Administrador

**Credenciales actuales (INSEGURAS):**
- Usuario: `soporteti`
- Contraseña: `admin2025`

**Método 1: Cambiar desde la interfaz**
1. Iniciar sesión con las credenciales actuales
2. Ir a perfil de usuario
3. Cambiar contraseña a una segura

**Método 2: Cambiar desde la base de datos**
```bash
cd backend
# Crear script temporal para cambiar password
```

**Contraseña segura debe tener:**
- Mínimo 12 caracteres
- Mayúsculas y minúsculas
- Números
- Caracteres especiales
- No palabras del diccionario

**Ejemplo de contraseña segura:**
```
R@nd0mP@ssw0rd!2026#Secure
```

---

### 3. Verificar Archivos .env NO están en Git

```bash
# Verificar status de Git
git status --ignored

# Si ves .env o .env.local listados, DETENTE
# Asegúrate de que .gitignore incluye:
# .env
# .env.local
# backend/.env

# Si accidentalmente commiteaste archivos .env:
git rm --cached .env
git rm --cached backend/.env
git rm --cached .env.local
git commit -m "Remove sensitive files"
```

---

### 4. Configurar CORS para Producción

**Editar `backend/.env`:**

```env
# Desarrollo
CORS_ORIGIN=http://localhost:3000

# Producción (reemplazar con tu dominio)
CORS_ORIGIN=https://tudominio.com
```

---

### 5. Configurar MongoDB para Producción

**MongoDB Atlas (Recomendado):**

1. Crear cuenta en https://cloud.mongodb.com
2. Crear cluster gratuito
3. Crear usuario de base de datos
4. Obtener connection string
5. Configurar IP whitelist

**Editar `backend/.env`:**

```env
# Desarrollo (local)
MONGODB_URI=mongodb://localhost:27017/GestionTI

# Producción (Atlas)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/GestionTI?retryWrites=true&w=majority
```

**IMPORTANTE:** Nunca incluir la contraseña de MongoDB en el código

---

## 🛡️ MEJORES PRÁCTICAS DE SEGURIDAD

### Gestión de Contraseñas

#### Para Usuarios
- ✅ Longitud mínima: 12 caracteres
- ✅ Complejidad: mayúsculas, minúsculas, números, símbolos
- ✅ No reutilizar contraseñas
- ✅ Cambiar cada 90 días
- ❌ No compartir credenciales
- ❌ No escribir en papel

#### Para Administradores
- ✅ Implementar política de contraseñas fuertes
- ✅ Forzar cambio de contraseña inicial
- ✅ Implementar bloqueo tras intentos fallidos
- ✅ Registrar intentos de login
- ✅ Considerar 2FA (Two-Factor Authentication)

---

### Gestión de Tokens JWT

#### Tiempos de Expiración Recomendados

```env
# Desarrollo
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Producción
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
```

#### Rotación de Refresh Tokens
Implementar rotación de refresh tokens para mayor seguridad:
1. Cuando se usa un refresh token, invalidarlo
2. Generar nuevo refresh token
3. Guardar solo el token más reciente

---

### Base de Datos

#### Conexión Segura
- ✅ Usar autenticación
- ✅ Usar TLS/SSL
- ✅ Restringir IPs permitidas
- ✅ Usuarios con mínimos privilegios

#### Backup
```bash
# Backup manual de MongoDB
mongodump --uri="mongodb://localhost:27017/GestionTI" --out=./backup

# Restaurar backup
mongorestore --uri="mongodb://localhost:27017/GestionTI" ./backup/GestionTI
```

#### Backup Automatizado (Recomendado)
Configurar cron job o tarea programada:
```bash
# Linux/Mac - Crontab
0 2 * * * mongodump --uri="mongodb://localhost:27017/GestionTI" --out=/backup/$(date +\%Y-\%m-\%d)

# Windows - Task Scheduler
# Crear tarea que ejecute script de backup diariamente
```

---

### HTTPS en Producción

#### Certificado SSL Gratuito con Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get install certbot

# Obtener certificado
sudo certbot certonly --standalone -d tudominio.com
```

#### Configurar HTTPS en Express

```javascript
// backend/src/server.ts
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

---

### Variables de Entorno

#### Nunca Hardcodear
❌ **MAL:**
```javascript
const JWT_SECRET = "mi_clave_secreta_123";
```

✅ **BIEN:**
```javascript
const JWT_SECRET = process.env.JWT_SECRET;
```

#### Validar Variables Requeridas
```javascript
// backend/src/config/env.ts
const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'MONGODB_URI'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Variable de entorno ${varName} no configurada`);
  }
});
```

---

## 🚨 MÓDULO DE CREDENCIALES - CONSIDERACIONES ESPECIALES

El módulo "Servicios y Contraseñas" almacena credenciales empresariales.

### Recomendaciones Críticas

#### 1. Encriptar Contraseñas en Base de Datos

Actualmente las contraseñas se guardan en texto plano. **PELIGROSO**.

**Solución: Implementar encriptación AES-256**

```typescript
// Crear backend/src/utils/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

**Agregar a .env:**
```env
# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=tu_clave_de_32_bytes_en_hexadecimal
```

#### 2. Auditoría de Acceso

Registrar quién accede a qué credenciales:

```typescript
// Modelo de auditoría
interface CredentialAccess {
  credentialId: string;
  userId: string;
  action: 'view' | 'create' | 'update' | 'delete';
  timestamp: Date;
  ipAddress: string;
}
```

#### 3. Permisos Granulares

No todos deben ver todas las credenciales:

```typescript
// Implementar niveles de acceso
interface Credential {
  // ... campos existentes
  accessLevel: 'public' | 'team' | 'admin' | 'restricted';
  allowedRoles: string[];
  allowedUsers: string[];
}
```

---

## 🔍 MONITOREO Y LOGGING

### Implementar Winston para Logging

```bash
cd backend
npm install winston
```

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### Logs Importantes a Registrar

- ✅ Intentos de login (exitosos y fallidos)
- ✅ Cambios de contraseña
- ✅ Creación/modificación de usuarios
- ✅ Acceso a credenciales sensibles
- ✅ Errores de servidor
- ✅ Cambios en configuración
- ✅ Operaciones de backup/restore

---

## 🎯 RATE LIMITING

### Protección contra Fuerza Bruta

**Configuración actual:**
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100   # 100 requests
```

**Recomendado para Login:**
```typescript
// backend/src/routes/authRoutes.ts
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de login. Intenta en 15 minutos.',
});

router.post('/login', loginLimiter, login);
```

---

## 🔐 CHECKLIST DE SEGURIDAD COMPLETO

### Antes del Primer Deploy

#### Configuración
- [ ] Cambiar `JWT_SECRET` y `JWT_REFRESH_SECRET`
- [ ] Cambiar contraseña de admin
- [ ] Configurar `MONGODB_URI` de producción
- [ ] Configurar `CORS_ORIGIN` correcto
- [ ] Generar `ENCRYPTION_KEY` para credenciales
- [ ] Configurar `NODE_ENV=production`

#### Base de Datos
- [ ] Habilitar autenticación MongoDB
- [ ] Configurar backup automatizado
- [ ] Restringir IPs permitidas
- [ ] Usar TLS/SSL
- [ ] Crear índices apropiados

#### Servidor
- [ ] Configurar HTTPS
- [ ] Configurar firewall
- [ ] Desactivar endpoints de debug
- [ ] Configurar logs de producción
- [ ] Implementar health checks
- [ ] Configurar monitoreo

#### Aplicación
- [ ] Implementar encriptación de credenciales
- [ ] Implementar auditoría de acceso
- [ ] Configurar rate limiting estricto
- [ ] Validar todas las entradas
- [ ] Sanitizar salidas
- [ ] Implementar CSP headers

#### Testing
- [ ] Pruebas de penetración
- [ ] Auditoría de seguridad
- [ ] Verificar OWASP Top 10
- [ ] Escaneo de vulnerabilidades
- [ ] Test de carga

#### Documentación
- [ ] Documentar procedimientos de emergencia
- [ ] Plan de respuesta a incidentes
- [ ] Contactos de soporte
- [ ] Procedimientos de backup/restore

---

## 🆘 PROCEDIMIENTOS DE EMERGENCIA

### Compromiso de Credenciales

1. **Acción Inmediata:**
   - Cambiar todas las contraseñas afectadas
   - Invalidar todos los tokens JWT
   - Revisar logs de acceso

2. **Investigación:**
   - Identificar el vector de ataque
   - Revisar logs de auditoría
   - Determinar alcance del compromiso

3. **Mitigación:**
   - Aplicar parches de seguridad
   - Fortalecer controles
   - Notificar usuarios afectados

### Caída del Sistema

1. **Verificar servicios:**
   ```bash
   # MongoDB
   systemctl status mongod

   # Backend
   pm2 status

   # Logs
   tail -f /var/log/app/error.log
   ```

2. **Restaurar desde backup:**
   ```bash
   mongorestore --uri="mongodb://..." ./backup/fecha
   ```

3. **Reiniciar servicios:**
   ```bash
   pm2 restart all
   ```

---

## 📞 CONTACTOS DE SEGURIDAD

En caso de detectar una vulnerabilidad:

1. **NO** publicar la vulnerabilidad públicamente
2. Contactar al equipo de desarrollo
3. Proporcionar detalles técnicos
4. Esperar confirmación y plan de acción

---

## 📚 RECURSOS ADICIONALES

### Documentación
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

### Herramientas
- [OWASP ZAP](https://www.zaproxy.org/) - Escáner de vulnerabilidades
- [Snyk](https://snyk.io/) - Análisis de dependencias
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Auditoría de paquetes

---

**Última actualización:** 2026-01-03
**Versión:** 1.0.0
**Responsable de Seguridad:** [A completar]
