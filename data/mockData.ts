
import { Equipment } from '../types';

export const INITIAL_EQUIPMENTS: Equipment[] = [
  // ... (Equipos anteriores se mantienen igual, solo añado los nuevos al final para brevedad)
  {
    id: '1',
    code: 'TI-PC-001',
    hostname: 'DESKTOP-FIN01',
    user: 'Juan Perez',
    area: 'Finanzas',
    brand: 'Dell',
    model: 'Optiplex 7080',
    serial: 'MXL-293847-F',
    os: 'Windows 11 Pro',
    purchaseDate: '2021-03-15',
    purchaseYear: 2021,
    type: 'PC',
    status: 'OK',
    lastMaintenance: '2023-11-10',
    nextMaintenance: '2024-05-10',
    photoUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&auto=format&fit=crop&q=60',
    components: {
      cpu: { model: 'i7-10700', year: 2020 },
      ram: { model: '16GB DDR4', year: 2021 },
      disk: { model: '512GB NVMe', year: 2021 },
      motherboard: { model: 'Dell Q470', year: 2020 }
    },
    risks: { slowness: false, restarts: false, diskHealth: false, temperature: false, screen: false, network: false, software: false },
    recommendation: 'Mantener',
    observations: 'Equipo en excelente estado operativo.'
  },
  {
    id: '11',
    code: 'TI-CEL-011',
    hostname: 'CEL-VENTAS-01',
    user: 'Ricardo Silva',
    area: 'Ventas',
    brand: 'Samsung',
    model: 'Galaxy S21 FE',
    serial: 'SN-SAM-9922',
    os: 'Android 14',
    purchaseDate: '2022-05-20',
    purchaseYear: 2022,
    type: 'Smartphone',
    status: 'OK',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-07-05',
    photoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=60',
    components: {
      cpu: { model: 'Exynos 2100', year: 2021 },
      ram: { model: '8GB LPDDR5', year: 2022 },
      disk: { model: '128GB UFS 3.1', year: 2022 },
      motherboard: { model: 'Samsung SOC', year: 2021 }
    },
    risks: { slowness: false, restarts: false, diskHealth: false, temperature: false, screen: false, network: false, software: false },
    recommendation: 'Mantener',
    observations: 'Dispositivo móvil corporativo.'
  },
  {
    id: '12',
    code: 'TI-CEL-012',
    hostname: 'CEL-LOG-02',
    user: 'Camila Rojas',
    area: 'Logística',
    brand: 'Xiaomi',
    model: 'Redmi Note 12',
    serial: 'SN-XIA-1100',
    os: 'Android 13',
    purchaseDate: '2023-02-10',
    purchaseYear: 2023,
    type: 'Smartphone',
    status: 'Riesgo',
    lastMaintenance: '2023-12-10',
    nextMaintenance: '2024-06-10',
    photoUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=60',
    components: {
      cpu: { model: 'Snapdragon 685', year: 2022 },
      ram: { model: '4GB DDR4', year: 2023 },
      disk: { model: '64GB eMMC', year: 2023 },
      motherboard: { model: 'Xiaomi SOC', year: 2022 }
    },
    risks: { slowness: true, restarts: false, diskHealth: false, temperature: false, screen: true, network: false, software: false },
    recommendation: 'Actualizar',
    observations: 'Pantalla con fisura leve.'
  }
];
