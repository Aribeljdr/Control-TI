
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Settings, 
  ShieldCheck, 
  AlertCircle, 
  History, 
  Camera, 
  Cpu, 
  Save,
  Check,
  Zap,
  HardDrive,
  Database,
  ScreenShare,
  Plus
} from 'lucide-react';
import { Equipment, MaintenanceRecord } from '../types';
import { getAgeColor, getStatusBadge, formatDate, calculateAge } from '../utils/helpers';

interface EquipmentDetailProps {
  equipments: Equipment[];
  maintenances: MaintenanceRecord[];
  // Fix: Added onAddMaintenance to the props interface as it's being passed from App.tsx
  onAddMaintenance: (m: MaintenanceRecord) => void;
}

// Fix: Destructured onAddMaintenance from the component props
export const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipments, maintenances, onAddMaintenance }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const equipment = equipments.find(e => e.id === id);
  const eqMaintenances = maintenances.filter(m => m.equipmentId === id);

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <AlertCircle size={48} className="mb-4 text-slate-300" />
        <p>Equipo no encontrado</p>
        <button onClick={() => navigate('/inventario')} className="mt-4 text-blue-600 font-medium">Volver al inventario</button>
      </div>
    );
  }

  const ComponentItem = ({ label, info, icon: Icon }: { label: string, info?: {model: string, year: number}, icon: any }) => {
    if (!info) return null;
    return (
      <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
          <p className="font-bold text-slate-900">{info.model}</p>
          <div className="flex items-center gap-2 mt-1">
             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getAgeColor(info.year)}`}>
               {calculateAge(info.year)} años
             </span>
             <span className="text-[10px] text-slate-400 uppercase font-semibold">Instalación: {info.year}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/inventario')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver al Inventario</span>
        </button>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
             <Settings size={18} /> Editar Info
           </button>
           <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200">
             <Plus size={18} /> Registrar Mantenimiento
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General Info & Photo */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-1">
              <div className="aspect-square relative rounded-xl overflow-hidden group">
                <img 
                  src={equipment.photoUrl || 'https://picsum.photos/400/400'} 
                  alt={equipment.code}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                />
                <div className="absolute top-4 left-4">
                   <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                     Foto Actual del Equipo
                   </span>
                </div>
                <button className="absolute bottom-4 right-4 bg-white p-2.5 rounded-xl text-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">{equipment.code}</h2>
              <p className="text-slate-500 text-sm mb-4">{equipment.brand} {equipment.model} &bull; SN: {equipment.serial}</p>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Usuario</p>
                  <p className="text-sm font-semibold text-slate-800">{equipment.user}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Área</p>
                  <p className="text-sm font-semibold text-slate-800">{equipment.area}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SO</p>
                  <p className="text-sm font-semibold text-slate-800">{equipment.os}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hostname</p>
                  <p className="text-sm font-semibold text-slate-800">{equipment.hostname}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-600" />
              Estado y Riesgos
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                 <span className="text-sm font-medium text-slate-700">Estado General</span>
                 <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(equipment.status)}`}>
                   {equipment.status}
                 </span>
               </div>
               
               <div className="grid grid-cols-2 gap-2">
                 {Object.entries(equipment.risks).map(([key, val]) => (
                   <div key={key} className={`flex items-center gap-2 p-2 rounded-lg border ${val ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                     {val ? <AlertCircle size={14} /> : <Check size={14} />}
                     <span className="text-[10px] font-bold uppercase">{key}</span>
                   </div>
                 ))}
               </div>

               <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-1">Recomendación IT</p>
                  <p className="text-blue-900 font-bold">{equipment.recommendation}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Center/Right Column: Components and History */}
        <div className="lg:col-span-2 space-y-8">
           <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Cpu size={22} className="text-slate-500" />
                Componentes de Hardware
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComponentItem label="Procesador (CPU)" info={equipment.components.cpu} icon={Cpu} />
                <ComponentItem label="Memoria RAM" info={equipment.components.ram} icon={Zap} />
                <ComponentItem label="Almacenamiento (Disco)" info={equipment.components.disk} icon={HardDrive} />
                <ComponentItem label="Placa Madre" info={equipment.components.motherboard} icon={Database} />
                {equipment.components.monitor && <ComponentItem label="Monitor" info={equipment.components.monitor} icon={ScreenShare} />}
              </div>
           </section>

           <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <History size={22} className="text-slate-500" />
                  Historial de Mantenimientos
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{eqMaintenances.length} registros</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {eqMaintenances.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {eqMaintenances.map((m) => (
                      <div key={m.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-slate-900">{formatDate(m.date)}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${m.type === 'Preventivo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {m.type}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(m.result)}`}>
                                Resultado: {m.result}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Técnico: {m.technician}</p>
                          </div>
                          <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                            <Camera size={16} /> Ver fotos de evidencia
                          </button>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-700"><span className="font-semibold">Acciones:</span> {m.actions.join(', ')}</p>
                          <p className="text-sm text-slate-600 bg-slate-100 p-3 rounded-xl italic">"{m.recommendations}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <History size={32} />
                    </div>
                    <p className="text-slate-500">No se registran mantenimientos previos para este equipo.</p>
                  </div>
                )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};
