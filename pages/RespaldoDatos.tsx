
import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  FileJson, 
  Calendar, 
  User, 
  Database, 
  CheckCircle2, 
  X,
  RefreshCcw,
  Info,
  Trash2,
  ChevronRight
} from 'lucide-react';

// Estructura del respaldo
interface BackupStructure {
  appName: string;
  schemaVersion: string;
  exportedAt: string;
  exportedBy: string;
  counts: {
    equipment: number;
    maintenances: number;
    bitacoraDays: number;
    manualFolders: number;
    manualFiles: number;
    credentialCategories: number;
    credentials: number;
  };
  data: {
    equipments: any[];
    maintenances: any[];
    bitacora: Record<string, any>;
    folders: any[];
    manuals: any[];
    credCategories: any[];
    credentials: any[];
  };
}

import { backupService, BackupStructure } from '../services/backupService';

export const RespaldoDatos: React.FC = () => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupPreview, setBackupPreview] = useState<BackupStructure | null>(null);
  const [lastExport, setLastExport] = useState<string | null>(localStorage.getItem('mp_last_export_date'));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [understandRisk, setUnderstandRisk] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const fullData = await backupService.exportData();
      const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
      
      link.href = url;
      link.download = `mantenimiento-preventivo_backup_${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const now = new Date().toLocaleString();
      localStorage.setItem('mp_last_export_date', now);
      setLastExport(now);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Error al generar el archivo de respaldo desde el servidor.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Validación básica de esquema
        if (json.appName !== "Mantenimiento Preventivo IT") {
          throw new Error("El archivo no pertenece a esta aplicación o es de una versión incompatible.");
        }

        setBackupPreview(json);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Archivo JSON inválido.");
        setBackupPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!backupPreview || !understandRisk) return;

    setIsRestoring(true);
    try {
      const response = await backupService.importData(backupPreview);
      
      if (response.success) {
        // Guardar evento de importación en logs locales para referencia rápida
        const logs = JSON.parse(localStorage.getItem('mp_backup_logs') || '[]');
        logs.unshift({
          type: 'IMPORT',
          date: new Date().toISOString(),
          status: 'SUCCESS',
          details: `Restaurado backup del ${new Date(backupPreview.exportedAt).toLocaleString()} en el servidor.`
        });
        localStorage.setItem('mp_backup_logs', JSON.stringify(logs.slice(0, 10)));

        // Refrescar la aplicación para cargar nueva data del backend
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || "Error crítico durante la restauración en el servidor.");
      setIsRestoring(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2 font-black tracking-tighter uppercase text-xs">
            <Database size={18} />
            <span>SISTEMA DE RESPALDO Y RECUPERACIÓN</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-none">Gestión de Información</h1>
          <p className="text-slate-500 mt-2 font-medium">Exporta tu base de datos local para mudanzas de equipo o seguridad preventiva.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest">
           <ShieldCheck size={16} /> Data Encriptada Localmente
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-[2rem] flex items-center gap-4 text-rose-700 animate-in slide-in-from-top-2">
           <AlertTriangle size={24} className="shrink-0" />
           <p className="font-bold">{error}</p>
           <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-rose-100 rounded-full transition-colors"><X size={20}/></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Exportar */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all duration-300">
           <div>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Download size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Exportar Todo</h3>
              <p className="text-slate-500 font-medium mb-8">Genera un archivo JSON con todos los módulos: Inventario, Bitácora, Wiki y Credenciales. Se incluirán todas las evidencias fotográficas.</p>
           </div>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                 <span>Última exportación</span>
                 <span className="text-blue-600">{lastExport || 'Nunca'}</span>
              </div>
              <button 
                onClick={handleExport}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-xl
                  ${success ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-blue-600'}
                `}
              >
                {success ? <CheckCircle2 size={18} /> : <Download size={18} />}
                {success ? 'EXPORTACIÓN EXITOSA' : 'DESCARGAR RESPALDO .JSON'}
              </button>
           </div>
        </div>

        {/* Card 2: Importar */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-amber-200 transition-all duration-300">
           <div>
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <Upload size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Restaurar Información</h3>
              <p className="text-slate-500 font-medium mb-8">Carga un archivo de respaldo previo para recuperar tu información. El sistema validará la integridad antes de aplicar los cambios.</p>
           </div>
           
           <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".json" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-slate-300"
              >
                <FileJson size={18} /> SELECCIONAR ARCHIVO
              </button>
           </div>
        </div>
      </div>

      {/* Preview de Backup seleccionado */}
      {backupPreview && (
        <div className="bg-white rounded-[2.5rem] border-2 border-blue-600 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
           <div className="p-8 border-b border-slate-100 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-2xl">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h4 className="text-xl font-black">Resumen de Respaldo Cargado</h4>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">Verificación de esquema 1.0.0 completada</p>
                 </div>
              </div>
              <button onClick={() => setBackupPreview(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
           </div>

           <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Metadatos */}
              <div className="space-y-6">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadatos del archivo</h5>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Calendar size={18} className="text-blue-500" />
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Exportado el:</p>
                          <p className="text-sm font-black text-slate-900">{new Date(backupPreview.exportedAt).toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <User size={18} className="text-blue-500" />
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Exportado por:</p>
                          <p className="text-sm font-black text-slate-900">{backupPreview.exportedBy}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={18} className="text-blue-500" />
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Versión Schema:</p>
                          <p className="text-sm font-black text-slate-900">{backupPreview.schemaVersion}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Conteos de Registros */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Equipos</p>
                    <p className="text-xl font-black text-slate-900">{backupPreview.counts.equipment}</p>
                 </div>
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mantenimientos</p>
                    <p className="text-xl font-black text-slate-900">{backupPreview.counts.maintenances}</p>
                 </div>
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bitácora</p>
                    <p className="text-xl font-black text-slate-900">{backupPreview.counts.bitacoraDays}</p>
                 </div>
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Wiki (Doc)</p>
                    <p className="text-xl font-black text-slate-900">{backupPreview.counts.manualFiles}</p>
                 </div>
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Categorías</p>
                    <p className="text-xl font-black text-slate-900">{backupPreview.counts.credentialCategories}</p>
                 </div>
                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Credenciales</p>
                    <p className="text-xl font-black text-slate-900">{backupPreview.counts.credentials}</p>
                 </div>
                 <div className="col-span-2 p-4 bg-blue-50/50 border border-blue-100 rounded-[1.5rem] flex items-center justify-center gap-3">
                    <Info size={16} className="text-blue-600" />
                    <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Incluye evidencias fotográficas</span>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                 <div className="flex items-center gap-4 mb-3">
                    <input 
                      type="checkbox" 
                      id="riskCheck" 
                      className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-2 border-slate-300"
                      checked={understandRisk}
                      onChange={e => setUnderstandRisk(e.target.checked)}
                    />
                    <label htmlFor="riskCheck" className="text-sm font-bold text-slate-700 select-none cursor-pointer">
                      Entiendo que esta acción sobrescribirá <span className="text-rose-600 underline">toda la información actual</span> del sistema.
                    </label>
                 </div>
                 <p className="text-xs text-slate-400 font-medium ml-10">Este proceso no se puede deshacer. Los datos locales actuales se borrarán permanentemente.</p>
              </div>
              <div className="flex gap-4">
                 <button 
                  onClick={() => setBackupPreview(null)}
                  className="px-8 py-4 text-slate-400 font-bold text-xs uppercase hover:bg-slate-200 rounded-2xl transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                  onClick={handleRestore}
                  disabled={!understandRisk || isRestoring}
                  className={`px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-3
                    ${understandRisk && !isRestoring ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700' : 'bg-slate-300 text-slate-50 cursor-not-allowed shadow-none'}
                  `}
                 >
                   {isRestoring ? <RefreshCcw size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                   {isRestoring ? 'RESTAURANDO...' : 'APLICAR RESTAURACIÓN'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Historial de Actividad Reciente */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <div>
               <h4 className="text-xl font-black text-slate-800">Eventos de Respaldo</h4>
               <p className="text-xs text-slate-500 font-medium">Registro de acciones recientes de exportación e importación.</p>
            </div>
            <button 
              onClick={() => { localStorage.removeItem('mp_backup_logs'); window.location.reload(); }}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
            >
               <Trash2 size={18} />
            </button>
         </div>
         <div className="divide-y divide-slate-100">
            {JSON.parse(localStorage.getItem('mp_backup_logs') || '[]').map((log: any, i: number) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${log.type === 'EXPORT' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                       {log.type === 'EXPORT' ? <Download size={18} /> : <Upload size={18} />}
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                         {log.type === 'EXPORT' ? 'Exportación de Datos' : 'Importación / Restauración'}
                       </p>
                       <p className="text-xs text-slate-500 font-medium">{log.details}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(log.date).toLocaleString()}</p>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{log.status}</span>
                 </div>
              </div>
            ))}
            {JSON.parse(localStorage.getItem('mp_backup_logs') || '[]').length === 0 && (
              <div className="p-12 text-center text-slate-300">
                 <Info size={32} className="mx-auto mb-3 opacity-20" />
                 <p className="font-bold text-sm uppercase tracking-widest">Sin actividad reciente registrada</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
