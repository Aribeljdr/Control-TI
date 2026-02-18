# 🗄️ MODELO DE DATOS ACTUAL (Schema Real)

Este documento refleja la estructura **exacta** de la base de datos tal como está implementada en el código (`backend/src/models`), ignorando documentación obsoleta.

---

## 1. 🔐 Credenciales (Credential & CredentialCategory)
*El módulo más complejo y actualizado del sistema.*

### Colección: `credentials`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `categoryId` | ObjectId | Referencia a la categoría (Correo, Wifi, etc.) |
| `type` | Enum | `EMAIL`, `WIFI`, `CPANEL`, `WORDPRESS`, `PORTAINER`, `CONTANET`, `PC_ACCOUNT`, `OTHER` |
| `status` | Enum | `ACTIVO`, `ASIGNADO`, `LIBRE`, `DESACTUALIZADO`, `BAJA` |
| `company` | Enum | `Aleph`, `Bioelectron`, `Otro` |
| `title` | String | Título descriptivo (ej: "Cuenta Admin Google") |
| `username` | String | Usuario / Correo |
| `password` | String | Contraseña (Actualmente texto plano, pendiente encriptar) |
| `dynamicFields` | Map | **Flexible:** Permite agregar campos extra arbitrarios (Key: Value) |
| `history` | Array | **Auditoría:** Historial de cambios (`action`, `actor`, `changes`, `date`) |
| `isVerified` | Boolean | Si la credencial ha sido verificada recientemente |
| `verifiedAt` | String | Fecha de verificación |

### Colección: `credentialcategories`
Define los tipos visuales de credenciales (Icono, Color, Nombre).

---

## 2. 💻 Equipos e Inventario (Equipment)
*Soporta tanto PCs como periféricos y sus relaciones.*

### Colección: `equipments`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `code` | String | Código único de activo (ej: PC-001) |
| `type` | Enum | `PC`, `Laptop`, `AIO`, `Smartphone`, `Monitor`, `Mouse`, `Keyboard` |
| `status` | Enum | `OK`, `Riesgo`, `Crítico` |
| `components` | Object | **Detalle Técnico:** CPU, RAM, Disk, Motherboard, PSU, GPU. Incluye modelo y año. |
| `risks` | Object | **Diagnóstico:** Flags booleanos (`slowness`, `restarts`, `diskHealth`, `temperature`, etc.) |
| `recommendation`| Enum | Acción sugerida: `Mantener`, `Actualizar`, `Aumentar RAM`, `Renovar equipo` |
| `assignedKeyboard`| Object | Relación: ID y fecha del teclado asignado |
| `assignedMouse` | Object | Relación: ID y fecha del mouse asignado |
| `assignedMonitor` | Object | Relación: ID y fecha del monitor asignado |
| `assignedTo` | String | Si es un periférico, ID del equipo padre. |

---

## 3. 📝 Bitácora Diaria (Bitacora)
*Registro operativo del departamento TI.*

### Colección: `bitacoras`
La unidad principal es el "Día".
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `date` | String | Fecha única (ID lógico) |
| `status` | Enum | Estado del día: `OK`, `RISK`, `INCIDENT`, `NONE`, `SUNDAY` |
| `requests` | Array | **Tickets:** Solicitudes de usuarios (`priority`, `status`, `area`) |
| `activities` | Array | **Tareas:** Trabajo interno realizado (`category`, `result`) |
| `summary` | String | Resumen narrativo del día |

---

## 4. 🔧 Mantenimientos (Maintenance)
*Historial técnico de intervenciones.*

### Colección: `maintenances`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `equipmentId` | ObjectId | Equipo intervenido |
| `type` | Enum | `Preventivo` o `Correctivo` |
| `actions` | Array | Lista de strings de acciones realizadas |
| `photos` | Array | Evidencia fotográfica (`BEFORE`, `AFTER`) |
| `result` | Enum | Estado final del equipo tras el mantenimiento |

---

## 5. 📚 Manuales (Manual)
*Base de conocimiento (Wiki).*

### Colección: `manualfolders` & `manuals`
Estructura jerárquica simple: Carpeta -> Archivos.
Los manuales contienen `content` (Markdown/HTML), `tags` e `images` (Base64).
