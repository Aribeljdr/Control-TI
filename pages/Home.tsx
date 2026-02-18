import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Monitor,
  Camera,
  ShieldCheck,
  ChevronRight,
  Server,
  AlertTriangle,
  BookOpen,
  Clock,
  Activity
} from 'lucide-react';
import { equipmentService } from '../services/equipmentService';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    criticalEquipments: 0,
    totalEquipments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const eqRes = await equipmentService.getAll();
        const equipments = eqRes.data || [];

        setStats({
          criticalEquipments: equipments.filter(e => e.status === 'Crítico').length,
          totalEquipments: equipments.length
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-6 overflow-y-auto">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-4xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10 my-8">
        {/* Header de Bienvenida */}
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Bienvenido al Sistema</h2>
          <p className="text-lg text-slate-500 font-medium">Control profesional de infraestructura tecnológica</p>
        </div>

        {/* Alerta de Equipos Críticos */}
        {!loading && stats.criticalEquipments > 0 && (
          <div
            onClick={() => navigate('/inventario')}
            className="bg-rose-50 border-2 border-rose-200 rounded-[2.5rem] p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-rose-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <AlertTriangle size={32} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-rose-900">
                    {stats.criticalEquipments} Equipo{stats.criticalEquipments !== 1 ? 's' : ''} Crítico{stats.criticalEquipments !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-rose-600 font-bold">Requieren atención inmediata - Click para ver detalles</p>
                </div>
              </div>
              <ChevronRight size={32} className="text-rose-400 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        )}

        {/* Grid de Características y Accesos Rápidos */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Tarjeta 1: Inventario */}
          <div
            onClick={() => navigate('/inventario')}
            className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Monitor size={32} />
              </div>
              <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Inventario de Equipos</h4>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Control completo del estado de salud de hardware y componentes
            </p>
            {!loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <Server size={14} />
                <span>{stats.totalEquipments} equipos registrados</span>
              </div>
            )}
          </div>

          {/* Tarjeta 2: Bitácora */}
          <div
            onClick={() => navigate('/bitacora')}
            className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <ChevronRight size={24} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Bitácora Diaria</h4>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Registro de actividades, incidentes y solicitudes de soporte
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <Clock size={14} />
              <span>Control en tiempo real</span>
            </div>
          </div>

          {/* Tarjeta 3: Evidencias */}
          <div
            onClick={() => navigate('/reportes')}
            className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:border-purple-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <ChevronRight size={24} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Reportes y Evidencias</h4>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Documentación fotográfica de mantenimientos y reparaciones
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <Camera size={14} />
              <span>Con registro visual</span>
            </div>
          </div>

          {/* Tarjeta 4: Credenciales */}
          <div
            onClick={() => navigate('/servicios')}
            className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:border-amber-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <ChevronRight size={24} className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Gestión de Credenciales</h4>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Control seguro de contraseñas y accesos corporativos
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <ShieldCheck size={14} />
              <span>Almacenamiento seguro</span>
            </div>
          </div>

          {/* Tarjeta 5: Manuales */}
          <div
            onClick={() => navigate('/manuales')}
            className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen size={32} />
              </div>
              <ChevronRight size={24} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Manuales Técnicos</h4>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Base de conocimiento y documentación de procedimientos
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <BookOpen size={14} />
              <span>Biblioteca digital</span>
            </div>
          </div>

          {/* Tarjeta 6: Dashboard Métricas */}
          <div
            onClick={() => navigate('/dashboard')}
            className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-lg hover:shadow-2xl hover:border-cyan-300 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-cyan-50 text-cyan-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Activity size={32} />
              </div>
              <ChevronRight size={24} className="text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Dashboard de Métricas</h4>
            <p className="text-sm text-slate-500 font-medium mb-4">
              Visualización de estadísticas y actividad del sistema
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <Activity size={14} />
              <span>Análisis en tiempo real</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} MANTENIMIENTO PREVENTIVO TI • VERSIÓN 1.2.0
          </p>
        </div>
      </div>
    </div>
  );
};
