
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { authStorage } from '../utils/authStorage';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (authStorage.isAuthenticated()) {
        navigate('/');
      } else {
        navigate('/intro');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-8 animate-bounce transition-all">
          <Cpu size={48} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
          Mantenimiento Preventivo
        </h1>
        <div className="flex gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <span>Inventario</span>
          <span className="opacity-30">•</span>
          <span>Bitácora</span>
          <span className="opacity-30">•</span>
          <span>Manuales</span>
        </div>

        <div className="mt-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
