
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Camera, ShieldCheck, ChevronRight } from 'lucide-react';

export const Intro: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Bienvenido</h2>
          <p className="text-lg text-slate-500 font-medium">Sistema profesional para el control y reportes de infraestructura tecnológica.</p>
        </div>

        <div className="grid gap-4">
          <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
              <Monitor size={28} />
            </div>
            <div>
              <h4 className="font-black text-slate-900">Inventario en Tiempo Real</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estado de salud de hardware</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Camera size={28} />
            </div>
            <div>
              <h4 className="font-black text-slate-900">Evidencias Fotográficas</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Reportes técnicos con imágenes</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-black text-slate-900">Respaldo y Seguridad</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gestión de claves y auditoría</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/login')}
          className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
        >
          CONTINUAR AL ACCESO <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
