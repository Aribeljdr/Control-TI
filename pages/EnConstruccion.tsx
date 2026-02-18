import React from 'react';
import { Construction, Wrench, Hammer, AlertCircle } from 'lucide-react';

export const EnConstruccion: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] p-8">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">

        {/* Iconos animados */}
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>

          <div className="relative flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 animate-bounce" style={{ animationDelay: '0ms' }}>
              <Wrench size={32} />
            </div>
            <div className="p-6 bg-amber-600 rounded-[2rem] text-white shadow-2xl shadow-amber-200">
              <Construction size={48} />
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 animate-bounce" style={{ animationDelay: '200ms' }}>
              <Hammer size={32} />
            </div>
          </div>
        </div>

        {/* Título */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Página en Construcción
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Estamos trabajando en esta sección para mejorar tu experiencia
          </p>
        </div>

        {/* Información */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-lg space-y-6">
          <div className="flex items-start gap-4 text-left">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 mb-2">Próximamente Disponible</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Esta funcionalidad estará disponible en futuras actualizaciones del sistema.
                Mientras tanto, puedes utilizar las demás secciones del panel de control.
              </p>
            </div>
          </div>
        </div>

        {/* Decoración */}
        <div className="pt-4">
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
