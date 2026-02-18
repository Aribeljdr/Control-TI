import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').max(50),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['admin', 'technician', 'viewer']).optional(),
  }),
});

export const equipmentSchema = z.object({
  body: z.object({
    code: z.string().optional(),
    hostname: z.string().min(1, 'El hostname es requerido'),
    user: z.string().min(1, 'El usuario es requerido'),
    area: z.string().min(1, 'El área es requerida'),
    brand: z.string().optional(),
    model: z.string().optional(),
    serial: z.string().optional(),
    os: z.string().optional(),
    purchaseDate: z.string(),
    purchaseYear: z.number(),
    type: z.enum(['PC', 'Laptop', 'AIO', 'Smartphone', 'Monitor', 'Mouse', 'Keyboard']),
    status: z.enum(['OK', 'Riesgo', 'Crítico']).optional(),
    nextMaintenance: z.string(),
    components: z.object({
      cpu: z.object({ model: z.string(), year: z.number() }),
      ram: z.object({ model: z.string(), year: z.number() }),
      disk: z.object({ model: z.string(), year: z.number() }),
      motherboard: z.object({ model: z.string(), year: z.number() }),
      psu: z.object({ model: z.string(), year: z.number() }).optional(),
      gpu: z.object({ model: z.string(), year: z.number() }).optional(),
      monitor: z.object({ model: z.string(), year: z.number() }).optional(),
    }).optional(),
    risks: z.object({
      slowness: z.boolean().optional(),
      restarts: z.boolean().optional(),
      diskHealth: z.boolean().optional(),
      temperature: z.boolean().optional(),
      screen: z.boolean().optional(),
      network: z.boolean().optional(),
      software: z.boolean().optional(),
    }).optional(),
    recommendation: z.enum(['Mantener', 'Actualizar', 'Aumentar RAM', 'Cambiar disco', 'Renovar equipo']).optional(),
    observations: z.string().optional(),
    description: z.string().optional(),
    assignedKeyboard: z.object({
      equipmentId: z.string(),
      assignedDate: z.string(),
    }).optional(),
    assignedMouse: z.object({
      equipmentId: z.string(),
      assignedDate: z.string(),
    }).optional(),
    assignedMonitor: z.object({
      equipmentId: z.string(),
      assignedDate: z.string(),
    }).optional(),
    assignedTo: z.string().optional(),
  }),
});

export const maintenanceSchema = z.object({
  body: z.object({
    equipmentId: z.string().min(1, 'El ID del equipo es requerido'),
    date: z.string(),
    type: z.enum(['Preventivo', 'Correctivo']),
    technician: z.string().min(1, 'El técnico es requerido'),
    actions: z.array(z.string()).optional(),
    problemFound: z.string().optional(),
    solutionApplied: z.string().optional(),
    recommendations: z.string().optional(),
    result: z.enum(['OK', 'Riesgo', 'Crítico']),
    photos: z.array(z.object({
      id: z.string(),
      type: z.enum(['BEFORE', 'AFTER', 'MAIN']),
      url: z.string(),
      caption: z.string().optional(),
      date: z.string(),
    })).optional(),
  }),
});

export const credentialSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'El ID de categoría es requerido'),
    type: z.enum(['EMAIL', 'WIFI', 'CPANEL', 'WORDPRESS', 'PORTAINER', 'CONTANET', 'PC_ACCOUNT', 'OTHER']),
    status: z.enum(['ACTIVO', 'ASIGNADO', 'LIBRE', 'DESACTUALIZADO', 'BAJA']).optional(),
    title: z.string().min(1, 'El título es requerido'),
    company: z.enum(['Aleph', 'Bioelectron', 'Otro']),
    username: z.string().min(1, 'El usuario es requerido'),
    password: z.string().min(1, 'La contraseña es requerida'),
    assignedTo: z.string().optional(),
    area: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    dynamicFields: z.record(z.string()).optional(),
  }),
});
