import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  BarChart3,
  Menu,
  User,
  Cpu,
  BookOpen,
  Library,
  Key,
  Database,
  Construction,
  HardDrive,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active: boolean;
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 translate-x-1'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={20} />
    <span className="font-bold text-sm">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inventario', icon: Monitor, label: 'Inventario' },
    { to: '/bitacora', icon: BookOpen, label: 'Bitácora TI' },
    { to: '/manuales', icon: Library, label: 'Manuales TI' },
    { to: '/servicios', icon: Key, label: 'Servicios y Claves' },
    { to: '/reportes', icon: BarChart3, label: 'Reportes Gerencia' },
    { to: '/respaldo', icon: Database, label: 'Respaldo' },
    { to: '/construccion', icon: Construction, label: 'En Construcción' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 text-blue-600 font-black text-2xl mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Cpu size={24} />
            </div>
            <span className="tracking-tighter">IT MANAGER</span>
          </div>

          {/* Navegación */}
          <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Menú Principal</p>
            {menuItems.map((item) => (
              <SidebarLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className="mt-auto pt-8">
            {/* Usuario */}
            <div className="bg-slate-50 rounded-[2rem] p-5 mb-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-blue-600 font-black text-base border-2 border-blue-50 shadow-sm">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">Soporte TI</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <HardDrive size={9} className="text-emerald-500" />
                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">
                      Datos Locales
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">v1.2.0 • build 2025</p>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 print:hidden shrink-0">
          <button
            className="p-2 lg:hidden text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <CalendarIcon />
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 leading-none">Soporte TI</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
