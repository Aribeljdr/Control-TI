import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
}

export const LoadingScreen: React.FC<Props> = ({ message = 'Cargando datos...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={48} className="text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-semibold">{message}</p>
      </div>
    </div>
  );
};
