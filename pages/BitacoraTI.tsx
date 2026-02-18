
import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Info,
  Calendar as CalendarIcon,
  X,
  FileText,
  Activity as ActivityIcon,
  AlertCircle,
  Trash2,
  Edit
} from 'lucide-react';
import { BitacoraDay, ITRequest, ITActivity, DayStatus, RequestPriority, ActivityCategory } from '../types';

interface BitacoraTIProps {
  bitacora: Record<string, BitacoraDay>;
  onSaveDay: (day: BitacoraDay) => void;
}

// Función auxiliar para obtener el día de la semana sin errores de zona horaria
const getLocalDayOfWeek = (year: number, month: number, day: number) => {
  return new Date(year, month, day).getDay();
};

// Función para formatear fecha de objeto Date a YYYY-MM-DD local
const toISOLocal = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export const BitacoraTI: React.FC<BitacoraTIProps> = ({ bitacora, onSaveDay }) => {
  const today = new Date();
  const todayStr = toISOLocal(today);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<'requests' | 'activities' | 'summary'>('requests');
  const [isModalOpen, setIsModalOpen] = useState<'request' | 'activity' | 'status' | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'request' | 'activity', id: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [reqForm, setReqForm] = useState<Partial<ITRequest>>({ priority: 'Baja', status: 'Pendiente' });
  const [actForm, setActForm] = useState<Partial<ITActivity>>({ category: 'Soporte', result: 'OK' });

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // El primer día del mes (0 = Domingo, 1 = Lunes...)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  const getDayData = (dateStr: string): BitacoraDay => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    
    return bitacora[dateStr] || {
      date: dateStr,
      status: dayOfWeek === 0 ? 'SUNDAY' : 'NONE',
      requests: [],
      activities: []
    };
  };

  const selectedDayData = useMemo(() => getDayData(selectedDate), [bitacora, selectedDate]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1));
  const handleYearChange = (y: number) => setCurrentDate(new Date(y, month));

  const getDayColor = (dateStr: string) => {
    const data = getDayData(dateStr);
    const [y, m, d] = dateStr.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    
    if (dayOfWeek === 0) return 'bg-rose-500 text-white border-rose-600'; // Domingo rojo fijo
    
    if (data.status === 'RISK') return 'bg-amber-400 text-white border-amber-500';
    if (data.status === 'INCIDENT') return 'bg-purple-500 text-white border-purple-600';
    if (data.status === 'OK') return 'bg-emerald-500 text-white border-emerald-600';
    
    // Auto-verde si hay data pero el estado es NONE
    if (data.status === 'NONE' && (data.requests.length > 0 || data.activities.length > 0)) {
      return 'bg-emerald-400 text-white border-emerald-500';
    }
    
    return 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100';
  };

  const addRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Modo edición
      const updatedRequests = selectedDayData.requests.map(req =>
        req.id === editingId ? { ...reqForm as ITRequest, id: editingId } : req
      );
      onSaveDay({ ...selectedDayData, requests: updatedRequests });
    } else {
      // Modo creación
      const newReq: ITRequest = {
        ...reqForm as ITRequest,
        id: Math.random().toString(36).substr(2, 9),
      };
      const updatedDay = { ...selectedDayData, requests: [...selectedDayData.requests, newReq] };
      onSaveDay(updatedDay);
    }
    setIsModalOpen(null);
    setReqForm({ priority: 'Baja', status: 'Pendiente' });
    setEditingId(null);
  };

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Modo edición
      const updatedActivities = selectedDayData.activities.map(act =>
        act.id === editingId ? { ...actForm as ITActivity, id: editingId } : act
      );
      onSaveDay({ ...selectedDayData, activities: updatedActivities });
    } else {
      // Modo creación
      const newAct: ITActivity = {
        ...actForm as ITActivity,
        id: Math.random().toString(36).substr(2, 9),
      };
      const updatedDay = { ...selectedDayData, activities: [...selectedDayData.activities, newAct] };
      onSaveDay(updatedDay);
    }
    setIsModalOpen(null);
    setActForm({ category: 'Soporte', result: 'OK' });
    setEditingId(null);
  };

  const updateDayStatus = (status: DayStatus) => {
    onSaveDay({ ...selectedDayData, status });
    setIsModalOpen(null);
  };

  const deleteRequest = (id: string) => {
    const updatedRequests = selectedDayData.requests.filter(req => req.id !== id);
    onSaveDay({ ...selectedDayData, requests: updatedRequests });
    setDeleteConfirm(null);
  };

  const deleteActivity = (id: string) => {
    const updatedActivities = selectedDayData.activities.filter(act => act.id !== id);
    onSaveDay({ ...selectedDayData, activities: updatedActivities });
    setDeleteConfirm(null);
  };

  const editRequest = (req: ITRequest) => {
    setReqForm(req);
    setEditingId(req.id);
    setIsModalOpen('request');
  };

  const editActivity = (act: ITActivity) => {
    setActForm(act);
    setEditingId(act.id);
    setIsModalOpen('activity');
  };

  const monthStats = useMemo(() => {
    let totalRequests = 0;
    let totalActivities = 0;
    let incidentDays = 0;
    let riskDays = 0;
    let activeDays = 0;

    (Object.values(bitacora) as BitacoraDay[]).forEach(day => {
      const [y, m] = day.date.split('-').map(Number);
      if (y === year && m === (month + 1)) {
        totalRequests += day.requests.length;
        totalActivities += day.activities.length;
        if (day.status === 'INCIDENT') incidentDays++;
        if (day.status === 'RISK') riskDays++;
        if (day.requests.length > 0 || day.activities.length > 0) activeDays++;
      }
    });

    return { totalRequests, totalActivities, incidentDays, riskDays, activeDays };
  }, [bitacora, year, month]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bitácora TI</h1>
          <p className="text-slate-500">Actividades diarias y gestión de incidentes</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
          {years.map(y => (
            <button 
              key={y}
              onClick={() => handleYearChange(y)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${year === y ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lado Izquierdo: Calendario */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{monthNames[month]} {year}</h2>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-200"><ChevronLeft size={20}/></button>
                <button onClick={handleNextMonth} className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-200"><ChevronRight size={20}/></button>
              </div>
            </div>

            <div className="p-5 max-w-lg mx-auto">
              <div className="grid grid-cols-7 gap-1.5 mb-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d, idx) => (
                  <div key={d} className={`text-center text-[10px] font-black uppercase py-1.5 ${idx === 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {/* Rellenar días del mes anterior */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-12 md:h-14 opacity-0 pointer-events-none"></div>
                ))}

                {/* Días del mes actual */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const isToday = todayStr === dateStr;
                  const dayData = getDayData(dateStr);

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-12 md:h-14 w-full aspect-square relative rounded-lg border-2 transition-all flex flex-col p-1.5 text-left group
                        ${isSelected ? 'ring-2 ring-blue-100 border-blue-600 scale-105 z-10' : ''}
                        ${getDayColor(dateStr)}
                      `}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-sm md:text-base font-black">{dayNum}</span>
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shadow-sm ring-1 ring-white"></span>
                        )}
                      </div>

                      {/* Indicadores de contenido */}
                      <div className="mt-auto flex gap-1">
                        {dayData.requests.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/90" title="Solicitudes"></div>
                        )}
                        {dayData.activities.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60" title="Actividades"></div>
                        )}
                      </div>

                      {/* Tooltip de estado */}
                      {dayData.status !== 'NONE' && dayData.status !== 'SUNDAY' && (
                        <div className="absolute top-1 right-1 opacity-40">
                           <Info size={10} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-x-5 gap-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                <div className="w-3 h-3 rounded-md bg-emerald-500 shadow-sm"></div> Operativo
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                <div className="w-3 h-3 rounded-md bg-amber-400 shadow-sm"></div> Riesgo
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                <div className="w-3 h-3 rounded-md bg-purple-500 shadow-sm"></div> Incidente
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                <div className="w-3 h-3 rounded-md bg-rose-500 shadow-sm"></div> Domingo
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                <div className="w-3 h-3 rounded-md bg-white border-2 border-slate-200"></div> Sin Data
              </div>
            </div>
          </div>

          {/* Estadísticas del Mes */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white grid grid-cols-2 md:grid-cols-4 gap-6 shadow-2xl shadow-slate-200">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Días con Gestión</p>
              <h4 className="text-3xl font-black">{monthStats.activeDays}</h4>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Solicitudes Totales</p>
              <h4 className="text-3xl font-black">{monthStats.totalRequests}</h4>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incidentes Críticos</p>
              <h4 className="text-3xl font-black text-purple-400">{monthStats.incidentDays}</h4>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alertas Riesgo</p>
              <h4 className="text-3xl font-black text-amber-400">{monthStats.riskDays}</h4>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Detalle del Día */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[750px] sticky top-24">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-2 text-blue-600 mb-2 font-black uppercase text-[10px] tracking-widest">
                 <CalendarIcon size={14} />
                 <span>Bitácora del día</span>
               </div>
               <div className="flex justify-between items-start gap-4">
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen('status')}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 transition-all hover:scale-105 active:scale-95
                      ${selectedDayData.status === 'SUNDAY' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                        selectedDayData.status === 'RISK' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        selectedDayData.status === 'INCIDENT' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                  >
                    {selectedDayData.status === 'SUNDAY' ? 'DOMINGO' : selectedDayData.status === 'NONE' ? 'DEFINIR ESTADO' : selectedDayData.status}
                  </button>
               </div>
            </div>

            <div className="flex bg-slate-50/30">
              {(['requests', 'activities', 'summary'] as const).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all border-b-4 
                    ${activeTab === tab ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab === 'requests' ? 'Solicitudes' : tab === 'activities' ? 'Actividades' : 'Resumen'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
               {selectedDayData.status === 'SUNDAY' ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-6">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-6">
                       <X size={40} />
                    </div>
                    <p className="font-black text-xl text-slate-800 uppercase tracking-tight">Día No Laboral</p>
                    <p className="text-sm mt-2 font-medium text-slate-500">Los domingos están reservados para descanso. No se permite registro de actividades.</p>
                 </div>
               ) : (
                 <>
                    {activeTab === 'requests' && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedDayData.requests.length} SOLICITUDES</span>
                          <button 
                            onClick={() => setIsModalOpen('request')}
                            className="bg-blue-50 text-blue-600 text-[10px] font-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
                          >
                            <Plus size={14} /> AGREGAR NUEVA
                          </button>
                        </div>
                        <div className="space-y-4">
                          {selectedDayData.requests.map(req => (
                            <div key={req.id} className="p-5 border-2 border-slate-100 rounded-3xl bg-slate-50/50 hover:border-blue-200 transition-all group relative">
                               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                 <button
                                   onClick={() => editRequest(req)}
                                   className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-110 transition-all"
                                   title="Editar solicitud"
                                 >
                                   <Edit size={16} />
                                 </button>
                                 <button
                                   onClick={() => setDeleteConfirm({ type: 'request', id: req.id })}
                                   className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 hover:scale-110 transition-all"
                                   title="Eliminar solicitud"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                               <div className="flex justify-between items-center mb-3 pr-20">
                                 <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase shadow-sm ${req.priority === 'Alta' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
                                   PRIORIDAD {req.priority}
                                 </span>
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                   <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'Resuelto' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                   {req.status}
                                 </div>
                               </div>
                               <h4 className="font-black text-slate-900 text-lg mb-1 leading-tight">{req.title}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">{req.area}</p>
                               <div className="p-3 bg-white rounded-2xl border border-slate-100 text-xs text-slate-600 italic">
                                 "{req.description}"
                               </div>
                            </div>
                          ))}
                          {selectedDayData.requests.length === 0 && (
                            <div className="py-16 text-center">
                               <FileText size={40} className="mx-auto mb-3 text-slate-200" />
                               <p className="text-sm font-bold text-slate-400">Sin reportes pendientes</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'activities' && (
                      <div className="space-y-6">
                         <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedDayData.activities.length} ACTIVIDADES</span>
                          <button 
                            onClick={() => setIsModalOpen('activity')}
                            className="bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
                          >
                            <Plus size={14} /> REGISTRAR LOG
                          </button>
                        </div>
                        <div className="space-y-4">
                          {selectedDayData.activities.map(act => (
                            <div key={act.id} className="p-5 border-2 border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-lg transition-all border-l-4 border-l-blue-500 group relative">
                               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                 <button
                                   onClick={() => editActivity(act)}
                                   className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-110 transition-all"
                                   title="Editar actividad"
                                 >
                                   <Edit size={16} />
                                 </button>
                                 <button
                                   onClick={() => setDeleteConfirm({ type: 'activity', id: act.id })}
                                   className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 hover:scale-110 transition-all"
                                   title="Eliminar actividad"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                               <div className="flex items-center gap-2 mb-3 pr-24">
                                 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                   <ActivityIcon size={16} />
                                 </div>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.category}</span>
                                 <span className={`ml-auto px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${act.result === 'OK' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                   {act.result}
                                 </span>
                               </div>
                               <h4 className="font-black text-slate-900 text-lg mb-2">{act.title}</h4>
                               <p className="text-xs text-slate-500 font-medium leading-relaxed">{act.description}</p>
                            </div>
                          ))}
                           {selectedDayData.activities.length === 0 && (
                            <div className="py-16 text-center">
                               <ActivityIcon size={40} className="mx-auto mb-3 text-slate-200" />
                               <p className="text-sm font-bold text-slate-400">Ninguna actividad registrada hoy</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'summary' && (
                      <div className="space-y-6">
                         <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Nota de Gestión Ejecutiva</label>
                         <textarea 
                          className="w-full h-48 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                          placeholder="Escribe un resumen rápido de lo más relevante de hoy para Gerencia..."
                          value={selectedDayData.summary || ''}
                          onChange={(e) => onSaveDay({ ...selectedDayData, summary: e.target.value })}
                         />
                         <div className="p-5 bg-blue-600 rounded-3xl text-white flex items-start gap-4 shadow-xl shadow-blue-100">
                            <AlertCircle size={24} className="shrink-0" />
                            <div>
                               <p className="font-black uppercase text-[10px] tracking-widest mb-1 opacity-70">Nota del Sistema</p>
                               <p className="text-sm font-medium leading-tight">Este resumen se incluirá automáticamente en el informe semanal de gestión IT.</p>
                            </div>
                         </div>
                      </div>
                    )}
                 </>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SOLICITUD */}
      {isModalOpen === 'request' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                 <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl">{editingId ? 'Editar' : 'Nueva'} Solicitud</h3>
                 <p className="text-xs text-slate-400 font-bold">{editingId ? 'Modificar registro existente' : 'Registro de requerimiento externo'}</p>
               </div>
               <button onClick={() => { setIsModalOpen(null); setEditingId(null); setReqForm({ priority: 'Baja', status: 'Pendiente' }); }} className="p-2 hover:bg-white hover:shadow-md rounded-full text-slate-400 transition-all"><X size={20}/></button>
             </div>
             <form onSubmit={addRequest} className="p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Título de Incidencia</label>
                  <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold" placeholder="Ej: Falla en Red Cobranzas" 
                    value={reqForm.title || ''} onChange={e => setReqForm({...reqForm, title: e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Área Solicitante</label>
                  <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold" placeholder="Ej: Contabilidad" 
                    value={reqForm.area || ''} onChange={e => setReqForm({...reqForm, area: e.target.value})}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Prioridad</label>
                    <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold" 
                      value={reqForm.priority} onChange={e => setReqForm({...reqForm, priority: e.target.value as any})}>
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </select>
                   </div>
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Estado</label>
                    <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold"
                      value={reqForm.status} onChange={e => setReqForm({...reqForm, status: e.target.value as any})}>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Resuelto">Resuelto</option>
                    </select>
                   </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Detalles Técnicos</label>
                  <textarea required className="w-full h-28 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-medium" placeholder="Escribe aquí el reporte..."
                    value={reqForm.description || ''} onChange={e => setReqForm({...reqForm, description: e.target.value})}/>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">{editingId ? 'Actualizar' : 'Guardar en Bitácora'}</button>
             </form>
          </div>
        </div>
      )}

      {/* MODAL ACTIVIDAD (Simétrico al de solicitud) */}
      {isModalOpen === 'activity' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                 <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl">{editingId ? 'Editar' : 'Nueva'} Actividad</h3>
                 <p className="text-xs text-slate-400 font-bold">{editingId ? 'Modificar registro existente' : 'Log de trabajo interno'}</p>
               </div>
               <button onClick={() => { setIsModalOpen(null); setEditingId(null); setActForm({ category: 'Soporte', result: 'OK' }); }} className="p-2 hover:bg-white hover:shadow-md rounded-full text-slate-400 transition-all"><X size={20}/></button>
             </div>
             <form onSubmit={addActivity} className="p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nombre de Actividad</label>
                  <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold" placeholder="Ej: Depuración de BD" 
                    value={actForm.title || ''} onChange={e => setActForm({...actForm, title: e.target.value})}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Categoría</label>
                    <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold"
                      value={actForm.category} onChange={e => setActForm({...actForm, category: e.target.value as any})}>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Soporte">Soporte</option>
                      <option value="Redes">Redes</option>
                      <option value="Sistemas">Sistemas</option>
                      <option value="Reunión">Reunión</option>
                    </select>
                   </div>
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Resultado</label>
                    <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold"
                      value={actForm.result} onChange={e => setActForm({...actForm, result: e.target.value as any})}>
                      <option value="OK">Exitoso</option>
                      <option value="Observación">Observado</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                   </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Descripción de Labores</label>
                  <textarea required className="w-full h-28 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-medium" placeholder="Describe los pasos realizados..."
                    value={actForm.description || ''} onChange={e => setActForm({...actForm, description: e.target.value})}/>
                </div>
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">{editingId ? 'Actualizar' : 'Registrar en Log'}</button>
             </form>
          </div>
        </div>
      )}

      {/* MODAL ESTADO DÍA (Simétrico) */}
      {isModalOpen === 'status' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xs rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-100 bg-slate-50/50 text-center">
               <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg">Estado de Gestión</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Semaforización del día</p>
             </div>
             <div className="p-6 space-y-3">
                <button onClick={() => updateDayStatus('OK')} className="w-full p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-500 hover:text-white transition-all border-2 border-emerald-100 shadow-sm">
                  OPERATIVO / OK
                </button>
                <button onClick={() => updateDayStatus('RISK')} className="w-full p-4 bg-amber-50 text-amber-700 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-amber-400 hover:text-white transition-all border-2 border-amber-100 shadow-sm">
                  ADVERTENCIA / RIESGO
                </button>
                <button onClick={() => updateDayStatus('INCIDENT')} className="w-full p-4 bg-purple-50 text-purple-700 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-purple-500 hover:text-white transition-all border-2 border-purple-100 shadow-sm">
                  INCIDENTE / CRÍTICO
                </button>
                <div className="h-px bg-slate-100 my-2"></div>
                <button onClick={() => updateDayStatus('NONE')} className="w-full p-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all">
                  ELIMINAR ESTADO
                </button>
                <button onClick={() => setIsModalOpen(null)} className="w-full p-3 text-slate-400 font-bold uppercase text-[10px] hover:text-slate-900 transition-colors">
                  CERRAR
                </button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN ELIMINACIÓN */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 border-b border-slate-100 bg-rose-50/50 text-center">
               <div className="w-16 h-16 bg-rose-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                 <Trash2 size={28} className="text-rose-600" />
               </div>
               <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl mb-2">¿Estás Seguro?</h3>
               <p className="text-sm text-slate-600 font-medium">Esta acción no se puede deshacer. Se eliminará {deleteConfirm.type === 'request' ? 'la solicitud' : 'la actividad'} permanentemente.</p>
             </div>
             <div className="p-6 space-y-3">
                <button
                  onClick={() => deleteConfirm.type === 'request' ? deleteRequest(deleteConfirm.id) : deleteActivity(deleteConfirm.id)}
                  className="w-full py-4 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
                >
                  Sí, Eliminar
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="w-full py-4 bg-slate-100 text-slate-700 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                >
                  No, Cancelar
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
