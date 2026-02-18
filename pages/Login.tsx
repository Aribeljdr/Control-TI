
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Eye, EyeOff, Lock, User, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login({ username, password });

      if (response.success) {
        // Cargar datos después del login exitoso
        if (onLoginSuccess) {
          await onLoginSuccess();
        }
        navigate('/');
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err: any) {
      setError(err.message || 'Usuario o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100">
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 transform hover:rotate-6 transition-transform">
              <Cpu size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Panel de Control</h2>
            <p className="text-blue-600 font-black text-[11px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
               <ShieldCheck size={14} /> Acceso Seguro TI
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-5">Identificación de Usuario</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Usuario (Soporteti)"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-50 transition-all font-bold placeholder:text-slate-300"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-5">Contraseña Maestra</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:shadow-lg focus:shadow-blue-50 transition-all font-bold placeholder:text-slate-300"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 animate-in slide-in-from-top-2">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  AUTENTICANDO...
                </>
              ) : (
                <>
                  INGRESAR AL SISTEMA
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} MANTENIMIENTO PREVENTIVO • VERSIÓN 1.2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
