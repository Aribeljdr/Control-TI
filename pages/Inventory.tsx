
import React, { useState } from 'react';
import {
  Search,
  Plus,
  Monitor,
  Laptop,
  Smartphone,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { Equipment, EquipmentType, EquipmentStatus } from '../types';
import { getStatusBadge, formatDate } from '../utils/helpers';

interface InventoryProps {
  equipments: Equipment[];
  onAddEquipment: (eq: Equipment) => void;
  onUpdateEquipment?: (id: string, data: Partial<Equipment>) => Promise<any>;
  onDeleteEquipment?: (id: string) => Promise<any>;
}

export const Inventory: React.FC<InventoryProps> = ({ equipments, onAddEquipment, onUpdateEquipment, onDeleteEquipment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfile, setFilterProfile] = useState<'All' | 'Computing' | 'Mobile'>('All');
  const [filterStatus, setFilterStatus] = useState<EquipmentStatus | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);

  // Función para generar el siguiente código según el tipo
  const generateNextCode = (type: EquipmentType): string => {
    const prefixes: Record<EquipmentType, string> = {
      'PC': 'PC',
      'Laptop': 'LP',
      'Monitor': 'MT',
      'Mouse': 'MS',
      'Keyboard': 'KB',
      'Smartphone': 'SP',
      'AIO': 'AIO'
    };

    const prefix = prefixes[type];

    // Filtrar equipos del mismo tipo
    const sameTypeEquipments = equipments.filter(eq => eq.type === type);

    if (sameTypeEquipments.length === 0) {
      return `${prefix}-001`;
    }

    // Extraer números de los códigos existentes
    const numbers = sameTypeEquipments
      .map(eq => {
        const match = eq.code.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => !isNaN(num));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = maxNumber + 1;

    return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
  };

  // Form State
  const [formData, setFormData] = useState({
    code: '', user: '', area: '', brand: '', model: '', type: 'PC' as EquipmentType,
    serial: '', os: '', description: '', purchaseYear: new Date().getFullYear(),
    assignedKeyboardId: '', assignedKeyboardDate: '',
    assignedMouseId: '', assignedMouseDate: '',
    assignedMonitorId: '', assignedMonitorDate: ''
  });

  // Generar código cuando cambia el tipo (solo en modo agregar)
  React.useEffect(() => {
    if (isModalOpen && !isEditMode) {
      const newCode = generateNextCode(formData.type);
      setFormData(prev => ({ ...prev, code: newCode }));
    }
  }, [formData.type, isModalOpen, isEditMode]);

  // Cargar datos cuando se abre en modo edición
  React.useEffect(() => {
    if (isModalOpen && isEditMode && equipmentToEdit) {
      setFormData({
        code: equipmentToEdit.code,
        user: equipmentToEdit.user,
        area: equipmentToEdit.area,
        brand: equipmentToEdit.brand || '',
        model: equipmentToEdit.model || '',
        type: equipmentToEdit.type,
        serial: equipmentToEdit.serial || '',
        os: equipmentToEdit.os || '',
        description: equipmentToEdit.description || '',
        purchaseYear: equipmentToEdit.purchaseYear,
        assignedKeyboardId: equipmentToEdit.assignedKeyboard?.equipmentId || '',
        assignedKeyboardDate: equipmentToEdit.assignedKeyboard?.assignedDate || '',
        assignedMouseId: equipmentToEdit.assignedMouse?.equipmentId || '',
        assignedMouseDate: equipmentToEdit.assignedMouse?.assignedDate || '',
        assignedMonitorId: equipmentToEdit.assignedMonitor?.equipmentId || '',
        assignedMonitorDate: equipmentToEdit.assignedMonitor?.assignedDate || '',
      });
    }
  }, [isModalOpen, isEditMode, equipmentToEdit]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const isPeripheral = formData.type === 'Mouse' || formData.type === 'Keyboard' || formData.type === 'Monitor';
      const isComputer = formData.type === 'PC' || formData.type === 'Laptop' || formData.type === 'AIO';

      // Si estamos en modo edición
      if (isEditMode && equipmentToEdit && onUpdateEquipment) {
        const updatedData: Partial<Equipment> = {
          user: formData.user,
          area: formData.area,
          purchaseYear: formData.purchaseYear,
        };

        // Campos específicos según el tipo
        if (formData.type === 'PC') {
          updatedData.description = formData.description;
          updatedData.os = formData.os;
        } else if (formData.type === 'Laptop') {
          updatedData.brand = formData.brand;
          updatedData.model = formData.model;
          updatedData.serial = formData.serial;
          updatedData.os = formData.os;
          if (formData.description) {
            updatedData.description = formData.description;
          }
        } else if (formData.type === 'Smartphone' || formData.type === 'AIO') {
          updatedData.brand = formData.brand;
          updatedData.model = formData.model;
          updatedData.serial = formData.serial;
          updatedData.os = formData.os;
        } else if (isPeripheral) {
          updatedData.brand = formData.brand;
          updatedData.model = formData.model;
        }

        // Periféricos asignados (solo para PC y Laptop)
        if (formData.type === 'PC' || formData.type === 'Laptop') {
          if (formData.assignedKeyboardId && formData.assignedKeyboardDate) {
            updatedData.assignedKeyboard = {
              equipmentId: formData.assignedKeyboardId,
              assignedDate: formData.assignedKeyboardDate
            };
          }
          if (formData.assignedMouseId && formData.assignedMouseDate) {
            updatedData.assignedMouse = {
              equipmentId: formData.assignedMouseId,
              assignedDate: formData.assignedMouseDate
            };
          }
          if (formData.assignedMonitorId && formData.assignedMonitorDate) {
            updatedData.assignedMonitor = {
              equipmentId: formData.assignedMonitorId,
              assignedDate: formData.assignedMonitorDate
            };
          }
        }

        await onUpdateEquipment(equipmentToEdit.id, updatedData);
        setSaveSuccess(true);

        setTimeout(() => {
          setIsModalOpen(false);
          setSaveSuccess(false);
          setIsEditMode(false);
          setEquipmentToEdit(null);
          setFormData({
            code: '', user: '', area: '', brand: '', model: '', type: 'PC', serial: '', os: '',
            description: '', purchaseYear: new Date().getFullYear(),
            assignedKeyboardId: '', assignedKeyboardDate: '',
            assignedMouseId: '', assignedMouseDate: '',
            assignedMonitorId: '', assignedMonitorDate: ''
          });
        }, 1500);
        return;
      }

      // Modo agregar nuevo equipo
      const newEq: Equipment = {
        code: formData.code,
        user: formData.user,
        area: formData.area,
        type: formData.type,
        purchaseYear: formData.purchaseYear,
        id: Math.random().toString(36).substr(2, 9),
        hostname: `${formData.type}-${formData.code}`,
        purchaseDate: `${formData.purchaseYear}-01-01`,
        status: 'OK',
        nextMaintenance: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
        observations: 'Nuevo ingreso.'
      };

      // Campos para computadoras
      if (isComputer) {
        newEq.components = {
          cpu: { model: 'Estándar', year: formData.purchaseYear },
          ram: { model: 'Estándar', year: formData.purchaseYear },
          disk: { model: 'Estándar', year: formData.purchaseYear },
          motherboard: { model: 'Estándar', year: formData.purchaseYear }
        };
        newEq.risks = { slowness: false, restarts: false, diskHealth: false, temperature: false, screen: false, network: false, software: false };
        newEq.recommendation = 'Mantener';
      }

      // Serial y OS (no para PC ni periféricos)
      if (formData.type !== 'PC' && !isPeripheral && formData.serial) {
        newEq.serial = formData.serial;
      }
      if (!isPeripheral && formData.os) {
        newEq.os = formData.os;
      }

      // Campos específicos según el tipo
      if (formData.type === 'PC') {
        newEq.description = formData.description;
      } else if (formData.type === 'Laptop') {
        newEq.brand = formData.brand;
        newEq.model = formData.model;
        newEq.serial = formData.serial;
        if (formData.description) {
          newEq.description = formData.description;
        }
      } else if (formData.type === 'Smartphone' || formData.type === 'AIO') {
        newEq.brand = formData.brand;
        newEq.model = formData.model;
        newEq.serial = formData.serial;
      } else if (isPeripheral) {
        newEq.brand = formData.brand;
        newEq.model = formData.model;
      }

      // Periféricos asignados (solo para PC y Laptop)
      if (formData.type === 'PC' || formData.type === 'Laptop') {
        if (formData.assignedKeyboardId && formData.assignedKeyboardDate) {
          newEq.assignedKeyboard = {
            equipmentId: formData.assignedKeyboardId,
            assignedDate: formData.assignedKeyboardDate
          };
        }
        if (formData.assignedMouseId && formData.assignedMouseDate) {
          newEq.assignedMouse = {
            equipmentId: formData.assignedMouseId,
            assignedDate: formData.assignedMouseDate
          };
        }
        if (formData.assignedMonitorId && formData.assignedMonitorDate) {
          newEq.assignedMonitor = {
            equipmentId: formData.assignedMonitorId,
            assignedDate: formData.assignedMonitorDate
          };
        }
      }

      // Llamar a la función para agregar el equipo
      await onAddEquipment(newEq);

      // Si llegamos aquí, el guardado fue exitoso
      setSaveSuccess(true);

      // Cerrar el modal después de 1 segundo
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
        setFormData({
          code: '', user: '', area: '', brand: '', model: '', type: 'PC', serial: '', os: '',
          description: '', purchaseYear: new Date().getFullYear(),
          assignedKeyboardId: '', assignedKeyboardDate: '',
          assignedMouseId: '', assignedMouseDate: '',
          assignedMonitorId: '', assignedMonitorDate: ''
        });
      }, 1500);
    } catch (error: any) {
      console.error('Error al guardar equipo:', error);
      setSaveError(error.message || 'Error al guardar el equipo. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (equipment: Equipment) => {
    setEquipmentToEdit(equipment);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (equipment: Equipment) => {
    setEquipmentToDelete(equipment);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!equipmentToDelete || !onDeleteEquipment) return;

    setIsDeleting(true);
    try {
      await onDeleteEquipment(equipmentToDelete.id);
      setDeleteModalOpen(false);
      setEquipmentToDelete(null);
    } catch (error: any) {
      console.error('Error al eliminar equipo:', error);
      alert('Error al eliminar el equipo: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = equipments.filter(eq => {
    const matchesSearch =
      eq.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.area.toLowerCase().includes(searchTerm.toLowerCase());

    const isMobile = eq.type === 'Smartphone';
    const matchesProfile = filterProfile === 'All' ||
                          (filterProfile === 'Computing' && !isMobile) ||
                          (filterProfile === 'Mobile' && isMobile);

    const matchesStatus = filterStatus === 'All' || eq.status === filterStatus;

    return matchesSearch && matchesProfile && matchesStatus;
  });

  const getIcon = (type: EquipmentType) => {
    switch (type) {
      case 'PC': return <Monitor size={18} />;
      case 'Laptop': return <Laptop size={18} />;
      case 'Smartphone': return <Smartphone size={18} />;
      case 'AIO': return <Monitor size={18} />;
      default: return <Monitor size={18} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventario de Activos IT</h1>
          <p className="text-slate-500">Gestión centralizada de PCs y Dispositivos Móviles</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Nuevo Registro
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
        <button 
          onClick={() => setFilterProfile('All')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filterProfile === 'All' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Todos
        </button>
        <button 
          onClick={() => setFilterProfile('Computing')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filterProfile === 'Computing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          PCs y Laptops
        </button>
        <button
          onClick={() => setFilterProfile('Mobile')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filterProfile === 'Mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Celulares
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por usuario, código, área..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
          >
            <option value="All">Todos los Estados</option>
            <option value="OK">Operativo</option>
            <option value="Riesgo">En Riesgo</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Equipo</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Mantenimiento</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(eq => (
                <tr key={eq.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        {getIcon(eq.type)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{eq.code}</div>
                        <div className="text-xs text-slate-500">{eq.brand} {eq.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{eq.user}</div>
                    <div className="text-xs text-slate-500">{eq.area}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-medium">{eq.purchaseYear}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(eq.status)}`}>
                      {eq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[10px]">
                      <p className="text-slate-400 font-bold">Último: {formatDate(eq.lastMaintenance)}</p>
                      <p className="text-slate-700 font-bold">Próx: {formatDate(eq.nextMaintenance)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {onUpdateEquipment && (
                        <button
                          onClick={() => handleEditClick(eq)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDeleteEquipment && (
                        <button
                          onClick={() => handleDeleteClick(eq)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditMode ? 'Editar Equipo' : 'Nuevo Registro de Activo'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEquipmentToEdit(null);
                  setFormData({
                    code: '', user: '', area: '', brand: '', model: '', type: 'PC', serial: '', os: '',
                    description: '', purchaseYear: new Date().getFullYear(),
                    assignedKeyboardId: '', assignedKeyboardDate: '',
                    assignedMouseId: '', assignedMouseDate: '',
                    assignedMonitorId: '', assignedMonitorDate: ''
                  });
                }}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Código Inventario</label>
                  <div className="relative">
                    <input
                      readOnly
                      className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 font-bold cursor-not-allowed"
                      value={formData.code}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-semibold">AUTO</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Generado automáticamente</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Equipo</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    disabled={isEditMode}
                  >
                    <optgroup label="Computadoras">
                      <option value="PC">PC Escritorio</option>
                      <option value="Laptop">Laptop</option>
                      <option value="AIO">All-In-One</option>
                    </optgroup>
                    <optgroup label="Móviles">
                      <option value="Smartphone">Smartphone (Celular)</option>
                    </optgroup>
                    <optgroup label="Periféricos">
                      <option value="Monitor">Monitor</option>
                      <option value="Mouse">Mouse</option>
                      <option value="Keyboard">Teclado</option>
                    </optgroup>
                  </select>
                  {isEditMode && (
                    <p className="text-[10px] text-slate-400 italic">No se puede cambiar el tipo en modo edición</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Responsable / Usuario</label>
                  <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Nombre completo"
                    value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Área</label>
                  <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ej: Finanzas"
                    value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Año de Compra</label>
                  <input
                    type="number"
                    required
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder={new Date().getFullYear().toString()}
                    value={formData.purchaseYear}
                    onChange={e => setFormData({...formData, purchaseYear: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              {/* Campos específicos según tipo */}
              {formData.type === 'PC' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Descripción del Equipo</label>
                    <textarea
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                      placeholder="Describe los componentes: Ej: Intel Core i5 10400, 8GB RAM DDR4, SSD 256GB, Fuente 500W..."
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Sistema Operativo</label>
                    <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ej: Windows 11 Pro"
                      value={formData.os} onChange={e => setFormData({...formData, os: e.target.value})} />
                  </div>
                </>
              )}

              {formData.type === 'Laptop' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Marca</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Dell, HP, Lenovo..."
                        value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Modelo</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ej: Latitude 3420"
                        value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Serie / Serial</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Número de serie"
                        value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Sistema Operativo</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ej: Windows 11 Pro"
                        value={formData.os} onChange={e => setFormData({...formData, os: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Descripción Adicional</label>
                    <textarea
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                      placeholder="Otras especificaciones: RAM, disco, procesador, etc."
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </>
              )}

              {(formData.type === 'Smartphone' || formData.type === 'AIO') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Marca</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Apple, Samsung..."
                        value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Modelo</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ej: iPhone 13"
                        value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Serie / Serial</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Número de serie"
                        value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Sistema Operativo</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ej: iOS 16, Android 13"
                        value={formData.os} onChange={e => setFormData({...formData, os: e.target.value})} />
                    </div>
                  </div>
                </>
              )}

              {(formData.type === 'Monitor' || formData.type === 'Mouse' || formData.type === 'Keyboard') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Marca</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Dell, Logitech, HP..."
                        value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Modelo</label>
                      <input required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Ej: MX Master 3"
                        value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                    </div>
                  </div>
                </>
              )}

              {/* Asignación de periféricos (solo para PC y Laptop) */}
              {(formData.type === 'PC' || formData.type === 'Laptop') && (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Asignación de Periféricos (Opcional)</h3>
                  <p className="text-xs text-slate-500 mb-4">Selecciona periféricos ya registrados en el inventario</p>

                  {/* Teclado */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                    <label className="text-xs font-bold text-slate-600 uppercase block mb-2">Teclado</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                        value={formData.assignedKeyboardId}
                        onChange={e => setFormData({...formData, assignedKeyboardId: e.target.value})}
                      >
                        <option value="">Sin asignar</option>
                        {equipments.filter(eq => eq.type === 'Keyboard' && !eq.assignedTo).map(kb => (
                          <option key={kb.id} value={kb.id}>{kb.code} - {kb.brand} {kb.model}</option>
                        ))}
                      </select>
                      {formData.assignedKeyboardId && (
                        <input
                          type="date"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                          value={formData.assignedKeyboardDate}
                          onChange={e => setFormData({...formData, assignedKeyboardDate: e.target.value})}
                          placeholder="Fecha asignación"
                        />
                      )}
                    </div>
                  </div>

                  {/* Mouse */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                    <label className="text-xs font-bold text-slate-600 uppercase block mb-2">Mouse</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                        value={formData.assignedMouseId}
                        onChange={e => setFormData({...formData, assignedMouseId: e.target.value})}
                      >
                        <option value="">Sin asignar</option>
                        {equipments.filter(eq => eq.type === 'Mouse' && !eq.assignedTo).map(m => (
                          <option key={m.id} value={m.id}>{m.code} - {m.brand} {m.model}</option>
                        ))}
                      </select>
                      {formData.assignedMouseId && (
                        <input
                          type="date"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                          value={formData.assignedMouseDate}
                          onChange={e => setFormData({...formData, assignedMouseDate: e.target.value})}
                          placeholder="Fecha asignación"
                        />
                      )}
                    </div>
                  </div>

                  {/* Monitor */}
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <label className="text-xs font-bold text-slate-600 uppercase block mb-2">Monitor</label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                        value={formData.assignedMonitorId}
                        onChange={e => setFormData({...formData, assignedMonitorId: e.target.value})}
                      >
                        <option value="">Sin asignar</option>
                        {equipments.filter(eq => eq.type === 'Monitor' && !eq.assignedTo).map(mon => (
                          <option key={mon.id} value={mon.id}>{mon.code} - {mon.brand} {mon.model}</option>
                        ))}
                      </select>
                      {formData.assignedMonitorId && (
                        <input
                          type="date"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                          value={formData.assignedMonitorDate}
                          onChange={e => setFormData({...formData, assignedMonitorDate: e.target.value})}
                          placeholder="Fecha asignación"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mensajes de error y éxito */}
              {saveError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">
                    Error: {saveError}
                  </p>
                </div>
              )}

              {saveSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-600 font-medium">
                    {isEditMode ? 'Equipo actualizado exitosamente' : 'Equipo guardado exitosamente'}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setEquipmentToEdit(null);
                    setFormData({
                      code: '', user: '', area: '', brand: '', model: '', type: 'PC', serial: '', os: '',
                      description: '', purchaseYear: new Date().getFullYear(),
                      assignedKeyboardId: '', assignedKeyboardDate: '',
                      assignedMouseId: '', assignedMouseDate: '',
                      assignedMonitorId: '', assignedMonitorDate: ''
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? (isEditMode ? 'Actualizando...' : 'Guardando...') : (isEditMode ? 'Actualizar Equipo' : 'Guardar Activo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModalOpen && equipmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-red-50">
              <h2 className="text-xl font-bold text-red-600">Confirmar Eliminación</h2>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setEquipmentToDelete(null);
                }}
                className="p-2 hover:bg-red-100 rounded-full text-red-500"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600 mb-2">Estás a punto de eliminar el siguiente equipo:</p>
                <div className="font-bold text-slate-900">
                  <p>Código: {equipmentToDelete.code}</p>
                  <p>Usuario: {equipmentToDelete.user}</p>
                  <p>Área: {equipmentToDelete.area}</p>
                </div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ Esta acción no se puede deshacer. El equipo será eliminado permanentemente de la base de datos.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setEquipmentToDelete(null);
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-8 py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar Equipo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
