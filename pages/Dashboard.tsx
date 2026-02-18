import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CalendarDays,
  ArrowRight,
  Zap,
  Server,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { equipmentService } from '../services/equipmentService';
import { bitacoraService } from '../services/bitacoraService';
import { credentialService } from '../services/credentialService';
import { Equipment, BitacoraDay, CredentialRecord } from '../types';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayStatus: 'NONE' as string, // OK, RISK, INCIDENT, NONE
    criticalEquipments: 0,
    unverifiedCreds: 0,
    pendingRequests: 0,
    activeActivities: 0,
    totalEquipments: 0
  });
  const [todayActivities, setTodayActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        
        const [eqRes, bitRes, credRes] = await Promise.all([
          equipmentService.getAll(),
          bitacoraService.getByDate(todayStr).catch(() => ({ data: null })), // Puede no existir hoy
          credentialService.getAll()
        ]);

        const equipments = eqRes.data || [];
        const bitacoraToday = bitRes.data as BitacoraDay | null;
        const credentials = credRes.data || [];

        setStats({
          todayStatus: bitacoraToday?.status || 'NONE',
          criticalEquipments: equipments.filter(e => e.status === 'Crítico').length,
          unverifiedCreds: credentials.filter(c => !c.isVerified && c.status === 'ACTIVO').length,
          pendingRequests: bitacoraToday?.requests.filter(r => r.status !== 'Resuelto').length || 0,
          activeActivities: bitacoraToday?.activities.filter(a => a.result === 'Pendiente').length || 0,
          totalEquipments: equipments.length
        });

        if (bitacoraToday) {
          // Combinar solicitudes y actividades para el feed
          const feed = [
            ...bitacoraToday.requests.map(r => ({ ...r, type: 'REQUEST' })),
            ...bitacoraToday.activities.map(a => ({ ...a, type: 'ACTIVITY' }))
          ].slice(0, 5);
          setTodayActivities(feed);
        }

      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Configuración visual según el estado del día
  const getStatusConfig = () => {
    switch (stats.todayStatus) {
      case 'OK': return { color: 'bg-emerald-500', text: 'Operación Normal', sub: 'Todos los sistemas funcionando correctamente.', icon: CheckCircle2 };
      case 'RISK': return { color: 'bg-amber-500', text: 'Atención Requerida', sub: 'Se han detectado riesgos operativos hoy.', icon: AlertTriangle };
      case 'INCIDENT': return { color: 'bg-rose-500', text: 'Incidente Activo', sub: 'Hay problemas críticos afectando la operación.', icon: Activity };
      default: return { color: 'bg-slate-500', text: 'Día Sin Iniciar', sub: 'Aún no se ha registrado actividad en la bitácora.', icon: Clock };
    }
  };

  const statusUI = getStatusConfig();

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando métricas...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Header Zen */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hola, Soporte TI</h1>
          <p className="text-slate-500 font-medium mt-1">Aquí tienes el pulso de la infraestructura hoy.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Hero Card: El estado del día */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl transition-all duration-500 ${statusUI.color}`}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
             <div className="flex items-center gap-3 mb-2 opacity-90">
                <statusUI.icon size={24} />
                <span className="text-sm font-bold uppercase tracking-widest">Estado del Día</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{statusUI.text}</h2>
             <p className="text-lg opacity-80 font-medium max-w-xl">{statusUI.sub}</p>
          </div>
          <Link to="/bitacora" className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2">
            Gestionar Bitácora <ArrowRight size={16} />
          </Link>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid de Atención: Solo lo importante */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Inventario Crítico */}
        <Link to="/inventario" className="group bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 no-underline">
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                 <div className={`p-4 rounded-2xl ${stats.criticalEquipments > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Server size={24} />
                 </div>
                 <p className="text-sm font-extrabold text-slate-700 group-hover:text-rose-600 transition-colors uppercase tracking-tight leading-tight">Equipos<br/>Críticos</p>
              </div>
              {stats.criticalEquipments > 0 && <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-200 mt-2"></span>}
           </div>
           <p className="text-4xl font-black text-slate-900 mb-2 leading-none">{stats.criticalEquipments}</p>
           <p className="text-xs text-slate-400 font-medium leading-relaxed">Requieren atención técnica o sustitución inmediata por falla.</p>
        </Link>

        {/* Card 2: Seguridad / Credenciales */}
        <Link to="/servicios" className="group bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 no-underline">
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                 <div className={`p-4 rounded-2xl ${stats.unverifiedCreds > 0 ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Lock size={24} />
                 </div>
                 <p className="text-sm font-extrabold text-slate-700 group-hover:text-amber-600 transition-colors uppercase tracking-tight leading-tight">Claves Sin<br/>Verificar</p>
              </div>
              {stats.unverifiedCreds > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-200 mt-2"></span>}
           </div>
           <p className="text-4xl font-black text-slate-900 mb-2 leading-none">{stats.unverifiedCreds}</p>
           <p className="text-xs text-slate-400 font-medium leading-relaxed">Accesos corporativos que requieren validación de integridad.</p>
        </Link>

        {/* Card 3: Soporte Pendiente */}
        <Link to="/bitacora" className="group bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 no-underline">
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                    <Zap size={24} />
                 </div>
                 <p className="text-sm font-extrabold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">Pendientes<br/>Hoy</p>
              </div>
              {(stats.pendingRequests + stats.activeActivities) > 0 && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-200 mt-2"></span>}
           </div>
           <p className="text-4xl font-black text-slate-900 mb-2 leading-none">{stats.pendingRequests + stats.activeActivities}</p>
           <p className="text-xs text-slate-400 font-medium leading-relaxed">Solicitudes de soporte y tareas internas por completar.</p>
        </Link>
      </div>

      {/* Feed de Actividad Reciente */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-8 pb-4 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-xl text-slate-900">Actividad Reciente</h3>
            <Link to="/bitacora" className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest">Ver Bitácora Completa</Link>
         </div>
         <div className="p-2">
            {todayActivities.length > 0 ? (
              todayActivities.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors flex items-center gap-4">
                   <div className={`p-2 rounded-xl shrink-0 ${item.priority === 'Alta' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                      {item.type === 'REQUEST' ? <Activity size={18} /> : <CheckCircle2 size={18} />}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 truncate">{item.description}</p>
                   </div>
                   <div className="text-right shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        item.status === 'Resuelto' || item.result === 'OK' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.status || item.result}
                      </span>
                   </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                 <CalendarDays size={32} className="mx-auto mb-2 opacity-20" />
                 <p className="font-bold text-xs uppercase tracking-widest">Sin actividad registrada hoy</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};