# ⚙️ ESTADO FUNCIONAL REAL DEL SISTEMA
*Análisis basado en la inspección de código del 09/01/2026*

Este documento describe qué hace el sistema **realmente** a día de hoy, diferenciando funcionalidades completas de aquellas que podrían ser placeholders.

## 1. Gestión de Identidad y Acceso (Auth)
- **Funcional:** Login completo con JWT (Access + Refresh Tokens).
- **Roles:** Soporta `admin`, `technician`, `viewer`. El middleware `auth.ts` protege las rutas correctamente.
- **Seguridad:** Las contraseñas de usuario se hashean con Bcrypt.

## 2. Inventario Inteligente (Inventory)
- **Funcional:** CRUD completo de equipos.
- **Característica Destacada:** No es solo una lista plana.
    - El sistema permite registrar **riesgos específicos** (lentitud, temperatura) y genera una **recomendación automática** (ej: "Aumentar RAM").
    - **Gestión de Periféricos:** Puedes crear un Mouse o Teclado como activo independiente y "asignarlo" a una PC. El código (`assignedKeyboard`, etc.) maneja esta vinculación.

## 3. Gestor de Contraseñas Empresarial (Credential Manager)
- **Muy Avanzado:** Este módulo es más robusto de lo habitual.
- **Campos Dinámicos:** Si una credencial necesita un campo raro (ej: "Puerto SMTP"), el usuario puede agregarlo sin cambios en la base de datos.
- **Auditoría:** Cada vez que alguien ve, edita o verifica una contraseña, se guarda en el historial (`history`). Sabes quién cambió qué.
- **Verificación:** Permite marcar contraseñas como "Verificadas" para asegurar que siguen funcionando.
- **⚠️ Nota de Seguridad:** Aunque el código para gestionarlas es avanzado, el almacenamiento del campo `password` en la base de datos sigue siendo texto plano (según `Credential.ts`). La encriptación es el próximo paso lógico.

## 4. Operaciones Diarias (Bitácora)
- **Funcional:** Permite registrar el día a día.
- **Estructura:** Divide claramente entre "Lo que me piden" (Requests) y "Lo que hago proactivamente" (Activities).
- **Semáforo:** Calcula un estado del día (Rojo/Amarillo/Verde) basado en incidentes.

## 5. Wiki / Base de Conocimiento
- **Funcional:** Sistema de gestión documental.
- **Capacidades:** Permite crear carpetas, subir manuales con formato rico y adjuntar imágenes directamente.
- **Búsqueda:** Incluye sistema de tags para encontrar información rápidamente.

## 6. Mantenimiento
- **Funcional:** Vincula intervenciones a equipos.
- **Evidencia:** Está diseñado para obligar/permitir la carga de fotos "Antes" y "Después", lo cual es excelente para auditorías de calidad.

## 📋 Conclusión del Estado Actual
El sistema **NO es un prototipo básico**. Tiene lógica de negocio compleja implementada (especialmente en Inventario y Credenciales). Está listo para despliegue operativo, siempre y cuando se atiendan las configuraciones de seguridad (claves JWT y encriptación de credenciales).
