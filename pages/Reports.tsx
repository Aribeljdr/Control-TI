import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BarChart, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Server,
  CalendarDays,
  Lock,
  Building2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { equipmentService } from '../services/equipmentService';
import { bitacoraService } from '../services/bitacoraService';
import { credentialService } from '../services/credentialService';
import { Equipment, BitacoraDay, CredentialRecord } from '../types';

type ReportType = 'EXECUTIVE' | 'TECHNICAL';

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('EXECUTIVE');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    equipments: Equipment[];
    bitacora: BitacoraDay[];
    credentials: CredentialRecord[];
  }>({ equipments: [], bitacora: [], credentials: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqRes, bitRes, credRes] = await Promise.all([
          equipmentService.getAll(),
          bitacoraService.getAll(),
          credentialService.getAll()
        ]);
        setData({
          equipments: eqRes.data || [],
          bitacora: bitRes.data || [],
          credentials: credRes.data || []
        });
      } catch (error) {
        console.error("Error cargando datos para reportes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    setTimeout(() => window.print(), 100);
  };

  // --- LÓGICA DE ESTADÍSTICAS ---
  const criticalEquipments = data.equipments.filter(e => e.status === 'Crítico');
  const obsoleteEquipments = data.equipments.filter(e => (new Date().getFullYear() - e.purchaseYear) >= 5);
  const unverifiedCreds = data.credentials.filter(c => !c.isVerified);
  
  // Stats Bitácora (Últimos 30 días simulados o total)
  const totalIncidents = data.bitacora.filter(b => b.status === 'INCIDENT' || b.status === 'RISK').length;
  const okDays = data.bitacora.filter(b => b.status === 'OK').length;

  if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Generando análisis de datos...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* --- CONTROLES (NO SE IMPRIMEN) --- */}
      <div className="print:hidden space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Centro de Reportes</h1>
            <p className="text-slate-500 font-medium mt-2">Selecciona el tipo de informe que deseas generar.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
          >
            <Printer size={18} /> Imprimir / Guardar PDF
          </button>
        </div>

        {/* Selector de Tipo de Reporte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setReportType('EXECUTIVE')}
            className={`p-8 rounded-[2.5rem] border-2 text-left transition-all duration-300 relative overflow-hidden group
              ${reportType === 'EXECUTIVE' ? 'border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-100' : 'border-slate-100 bg-white hover:border-blue-200'}
            `}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${reportType === 'EXECUTIVE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
              <BarChart size={28} />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${reportType === 'EXECUTIVE' ? 'text-blue-900' : 'text-slate-900'}`}>Informe Ejecutivo</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Diseñado para Gerencia. Muestra indicadores clave (KPIs), riesgos de alto nivel y sugerencias de inversión. Sin tecnicismos.
            </p>
          </button>

          <button 
            onClick={() => setReportType('TECHNICAL')}
            className={`p-8 rounded-[2.5rem] border-2 text-left transition-all duration-300 relative overflow-hidden group
              ${reportType === 'TECHNICAL' ? 'border-emerald-600 bg-emerald-50/50 shadow-xl shadow-emerald-100' : 'border-slate-100 bg-white hover:border-emerald-200'}
            `}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${reportType === 'TECHNICAL' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
              <FileText size={28} />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${reportType === 'TECHNICAL' ? 'text-emerald-900' : 'text-slate-900'}`}>Auditoría Técnica</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Diseñado para el área TI. Listados detallados de activos, logs de auditoría de credenciales e historial completo de incidentes.
            </p>
          </button>
        </div>

        <div className="flex items-center gap-4 py-4 px-6 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 text-xs font-bold">
           <AlertTriangle size={16} />
           <p>Vista previa a continuación. Presiona "Imprimir" para generar el PDF limpio.</p>
        </div>
      </div>

      {/* --- VISTA DE IMPRESIÓN (SE MUESTRA ABAJO Y AL IMPRIMIR) --- */}
      <div className="mt-12 bg-white print:mt-0 print:p-0 px-4 md:px-12">
        
        {/* --- REPORTE EJECUTIVO --- */}
        {reportType === 'EXECUTIVE' && (
          <div className="space-y-12 print:space-y-8 animate-in fade-in max-w-5xl mx-auto">
            {/* Encabezado Ejecutivo */}
            <div className="flex justify-between items-end border-b-4 border-blue-600 pb-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Informe Gerencial IT</h1>
                <p className="text-slate-500 font-bold mt-2 text-lg">Estado de Salud Tecnológica y Riesgos</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fecha de Emisión</p>
                <p className="text-xl font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* 1. Resumen de Alto Nivel */}
            <div className="grid grid-cols-3 gap-8">
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Continuidad Operativa</p>
                  <div className="flex justify-center items-center gap-2 text-emerald-600 mb-1">
                     <TrendingUp size={32} />
                     <span className="text-5xl font-black">{(okDays / (data.bitacora.length || 1) * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600">Días sin incidentes reportados</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Riesgo de Hardware</p>
                  <div className="flex justify-center items-center gap-2 text-rose-600 mb-1">
                     <Server size={32} />
                     <span className="text-5xl font-black">{criticalEquipments.length}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600">Equipos requieren cambio urgente</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seguridad Accesos</p>
                  <div className="flex justify-center items-center gap-2 text-amber-500 mb-1">
                     <Lock size={32} />
                     <span className="text-5xl font-black">{unverifiedCreds.length}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-600">Claves sin verificar recientemente</p>
               </div>
            </div>

            {/* 2. Semáforo de Inversión */}
            <div>
               <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                 <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                 Prioridades de Inversión
               </h3>
               <div className="border rounded-3xl overflow-hidden border-slate-200">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                        <tr>
                           <th className="px-6 py-4">Activo / Equipo</th>
                           <th className="px-6 py-4">Usuario</th>
                           <th className="px-6 py-4">Diagnóstico</th>
                           <th className="px-6 py-4">Acción Recomendada</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {[...criticalEquipments, ...obsoleteEquipments].slice(0, 8).map(eq => (
                          <tr key={eq.id}>
                             <td className="px-6 py-4 font-bold text-slate-900">{eq.type} {eq.brand}</td>
                             <td className="px-6 py-4 text-sm text-slate-600">{eq.user} ({eq.area})</td>
                             <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${eq.status === 'Crítico' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                   {eq.status === 'Crítico' ? 'Falla Funcional' : 'Obsolescencia'}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-xs font-bold text-slate-800">{eq.recommendation}</td>
                          </tr>
                        ))}
                        {[...criticalEquipments, ...obsoleteEquipments].length === 0 && (
                          <tr><td colSpan={4} className="p-8 text-center text-slate-400">Sin inversiones urgentes requeridas.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* 3. Comentarios del Responsable */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 print:break-inside-avoid">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Conclusión del Responsable TI</h3>
               <div className="h-32 border-b border-slate-300 border-dashed"></div>
               <p className="text-xs text-slate-400 mt-2">Espacio reservado para observaciones manuales y firma.</p>
            </div>
          </div>
        )}

        {/* --- REPORTE TÉCNICO --- */}
        {reportType === 'TECHNICAL' && (
          <div className="space-y-10 print:space-y-8 animate-in fade-in max-w-6xl mx-auto">
             <div className="flex justify-between items-end border-b-4 border-emerald-600 pb-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Auditoría Técnica Detallada</h1>
                <p className="text-slate-500 font-bold mt-2 text-base">Inventario Completo y Logs de Sistema</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Generado Por</p>
                <p className="text-lg font-bold text-slate-900">Soporte TI</p>
              </div>
            </div>

            {/* Listado Denso de Equipos */}
            <div>
               <h3 className="text-lg font-black text-slate-900 mb-4 bg-emerald-50 inline-block px-4 py-2 rounded-lg text-emerald-800">1. Inventario de Hardware</h3>
               <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                     <thead className="bg-slate-100 font-bold text-slate-600 border-b border-slate-200">
                        <tr>
                           <th className="px-4 py-2">Código</th>
                           <th className="px-4 py-2">Hostname</th>
                           <th className="px-4 py-2">Tipo</th>
                           <th className="px-4 py-2">Usuario</th>
                           <th className="px-4 py-2">Specs (CPU/RAM/Disk)</th>
                           <th className="px-4 py-2">Año</th>
                           <th className="px-4 py-2 text-center">Estado</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {data.equipments.map(eq => (
                          <tr key={eq.id} className="hover:bg-slate-50">
                             <td className="px-4 py-2 font-mono text-slate-500">{eq.code}</td>
                             <td className="px-4 py-2 font-bold">{eq.hostname}</td>
                             <td className="px-4 py-2">{eq.type}</td>
                             <td className="px-4 py-2">{eq.user}</td>
                             <td className="px-4 py-2 text-[10px] text-slate-500">
                                {eq.components ? `${eq.components.cpu.model} / ${eq.components.ram.model} / ${eq.components.disk.model}` : 'N/A'}
                             </td>
                             <td className="px-4 py-2">{eq.purchaseYear}</td>
                             <td className="px-4 py-2 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${eq.status === 'OK' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                  {eq.status}
                                </span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Auditoría de Credenciales */}
            <div className="print:break-before-page">
               <h3 className="text-lg font-black text-slate-900 mb-4 bg-emerald-50 inline-block px-4 py-2 rounded-lg text-emerald-800 mt-8">2. Auditoría de Accesos</h3>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  {data.credentials.filter(c => !c.isVerified).map(cred => (
                    <div key={cred.id} className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg flex justify-between items-center break-inside-avoid">
                       <div>
                          <p className="font-bold text-amber-900 text-xs">{cred.title}</p>
                          <p className="text-[10px] text-amber-700">{cred.username}</p>
                       </div>
                       <div className="text-right">
                          <span className="text-[9px] font-black bg-white border border-amber-200 px-2 py-1 rounded text-amber-600 uppercase">Sin Verificar</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};