
import { EquipmentStatus } from '../types';

export const calculateAge = (year: number) => {
  const currentYear = new Date().getFullYear();
  return currentYear - year;
};

export const getAgeColor = (year: number) => {
  const age = calculateAge(year);
  if (age <= 3) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  if (age <= 6) return 'text-amber-600 bg-amber-50 border-amber-100';
  return 'text-rose-600 bg-rose-50 border-rose-100';
};

export const getStatusBadge = (status: EquipmentStatus) => {
  switch (status) {
    case 'OK': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Riesgo': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Crítico': return 'bg-rose-100 text-rose-700 border-rose-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
