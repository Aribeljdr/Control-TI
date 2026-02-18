
import React, { useState, useMemo } from 'react';
import { 
  Key, 
  Plus, 
  Search, 
  FolderPlus, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Tag as TagIcon, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit3,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  Info,
  Building2,
  Mail,
  Wifi,
  Globe,
  Terminal,
  Monitor,
  Box,
  FileText,
  CopyCheck,
  History,
  Activity
} from 'lucide-react';
import { 
  CredentialCategory, 
  CredentialRecord, 
  CredentialType, 
  CredentialStatus, 
  AuditEntry, 
  AuditAction 
} from '../types';

interface Props {
  categories: CredentialCategory[];
  records: CredentialRecord[];
  onSaveCategories: (c: CredentialCategory[]) => void;
  onSaveRecords: (r: CredentialRecord[]) => void;
}

export const ServiciosContrasenas: React.FC<Props> = ({ categories, records, onSaveCategories, onSaveRecords }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordSearchTerm, setRecordSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'detalle' | 'historial'>('detalle');

  // Form States
  const [catForm, setCatForm] = useState<Partial<CredentialCategory>>({ color: 'blue', icon: 'Key' });
  const [recForm, setRecForm] = useState<Partial<CredentialRecord>>({ 
    type: 'EMAIL', status: 'ACTIVO', company: 'Aleph', tags: [], dynamicFields: {}, isVerified: false 
  });

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const currentRecord = records.find(r => r.id === selectedRecordId);
  const categoryRecords = records.filter(r => 
    r.categoryId === selectedCategoryId &&
    (recordSearchTerm === '' || 
     r.title.toLowerCase().includes(recordSearchTerm.toLowerCase()) || 
     r.username.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
     r.tags.some(tag => tag.toLowerCase().includes(recordSearchTerm.toLowerCase())))
  );

  const stats = useMemo(() => ({
    total: records.length,
    outdated: records.filter(r => r.status === 'DESACTUALIZADO').length,
    unverified: records.filter(r => !r.isVerified).length,
    free: records.filter(r => r.status === 'LIBRE').length
  }), [records]);

  // Helpers
  const togglePass = (id: string) => setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado al portapapeles');
  };

  const createAuditEntry = (action: AuditAction, oldRecord: CredentialRecord | null, newRecord: CredentialRecord, note?: string): AuditEntry => {
    const changes: any[] = [];
    if (oldRecord) {
      Object.keys(newRecord).forEach(key => {
        const k = key as keyof CredentialRecord;
        if (JSON.stringify(oldRecord[k]) !== JSON.stringify(newRecord[k])) {
          changes.push({
            field: k,
            before: String(oldRecord[k]),
            after: String(newRecord[k])
          });
        }
      });
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      action,
      actor: 'Soporte TI',
      note,
      changes: changes.length > 0 ? changes : undefined
    };
  };

  // Actions
  const handleSaveCategory = () => {
    const newCat: CredentialCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: catForm.name || 'Sin nombre',
      icon: catForm.icon || 'Key',
      color: catForm.color || 'blue',
      createdAt: new Date().toISOString()
    };
    onSaveCategories([...categories, newCat]);
    setIsCategoryModalOpen(false);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !recForm.id;
    const oldRec = isNew ? null : records.find(r => r.id === recForm.id)!;
    
    const newRec: CredentialRecord = {
      ...recForm as CredentialRecord,
      id: recForm.id || Math.random().toString(36).substr(2, 9),
      categoryId: selectedCategoryId!,
      updatedAt: new Date().toISOString(),
      createdAt: recForm.createdAt || new Date().toISOString(),
      history: isNew ? [] : oldRec!.history
    };

    const action: AuditAction = isNew ? 'CREATE' : (oldRec?.status !== newRec.status ? 'STATUS_CHANGE' : 'UPDATE');
    const audit = createAuditEntry(action, oldRec, newRec);
    newRec.history = [audit, ...newRec.history];

    const updatedRecords = isNew ? [...records, newRec] : records.map(r => r.id === newRec.id ? newRec : r);
    onSaveRecords(updatedRecords);
    setIsRecordModalOpen(false);
    setSelectedRecordId(newRec.id);
  };

  const verifyRecord = (id: string) => {
    const rec = records.find(r => r.id === id)!;
    const updated = {
      ...rec,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Soporte TI',
      history: [createAuditEntry('VERIFY', rec, { ...rec, isVerified: true }, 'Verificación manual realizada'), ...rec.history]
    };
    onSaveRecords(records.map(r => r.id === id ? updated : r));
  };

  const deleteRecord = (id: string) => {
    if (window.confirm('¿Borrar esta credencial permanentemente?')) {
      onSaveRecords(records.filter(r => r.id !== id));
      setSelectedRecordId(null);
    }
  };

  const getTypeIcon = (type: CredentialType) => {
    switch (type) {
      case 'EMAIL': return <Mail size={16} />;
      case 'WIFI': return <Wifi size={16} />;
      case 'CPANEL': return <Terminal size={16} />;
      case 'WORDPRESS': return <Globe size={16} />;
      case 'PORTAINER': return <Box size={16} />;
      case 'PC_ACCOUNT': return <Monitor size={16} />;
      case 'CONTANET': return <FileText size={16} />;
      default: return <Key size={16} />;
    }
  };

  const getStatusColor = (status: CredentialStatus) => {
    switch (status) {
      case 'ACTIVO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ASIGNADO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'LIBRE': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'DESACTUALIZADO': return 'bg-amber-100 text-amber-700 border-amber-300 animate-pulse';
      case 'BAJA': return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Servicios y Contraseñas</h1>
          <p className="text-slate-500 font-medium">Gestión segura de identidades y accesos corporativos</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registros</p>
            <p className="text-xl font-black text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 shadow-sm text-center">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Outdated</p>
            <p className="text-xl font-black text-amber-600">{stats.outdated}</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 shadow-sm text-center">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Sin Verificar</p>
            <p className="text-xl font-black text-rose-600">{stats.unverified}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 shadow-sm text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Libres</p>
            <p className="text-xl font-black text-emerald-600">{stats.free}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Categories Sidebar */}
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col h-full shadow-sm overflow-hidden">
             <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
               />
             </div>
             <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredCategories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { 
                      setSelectedCategoryId(cat.id); 
                      setSelectedRecordId(null); 
                      setRecordSearchTerm(''); // Limpiar búsqueda al cambiar categoría
                    }}
                    className={`w-full group flex items-center justify-between p-3 rounded-2xl transition-all border-2 ${selectedCategoryId === cat.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${selectedCategoryId === cat.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                        <Key size={16} className={selectedCategoryId === cat.id ? 'text-white' : 'text-blue-600'} />
                      </div>
                      <span className="font-bold text-sm text-left truncate w-32">{cat.name}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${selectedCategoryId === cat.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {records.filter(r => r.categoryId === cat.id).length}
                    </span>
                  </button>
                ))}
             </div>
             <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="mt-4 w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
             >
               <FolderPlus size={16} /> Nueva Categoría
             </button>
          </div>
        </div>

        {/* Center: List of Records */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-3xl border border-slate-200 flex flex-col h-full shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                   {currentCategory?.name || 'Selecciona Categoría'}
                 </h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{categoryRecords.length} registros encontrados</p>
               </div>
               {selectedCategoryId && (
                 <button 
                  onClick={() => { setRecForm({ type: 'EMAIL', status: 'ACTIVO', company: 'Aleph', tags: [], dynamicFields: {}, isVerified: false }); setIsRecordModalOpen(true); }}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                 >
                   <Plus size={18} /> NUEVO ACCESO
                 </button>
               )}
            </div>

            {/* Buscador de Registros */}
            {selectedCategoryId && (
              <div className="px-6 py-2 bg-white border-b border-slate-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all"
                    placeholder="Filtrar por título, usuario o tags..."
                    value={recordSearchTerm}
                    onChange={e => setRecordSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {categoryRecords.map(rec => (
                 <button 
                  key={rec.id}
                  onClick={() => setSelectedRecordId(rec.id)}
                  className={`w-full group p-5 border-2 rounded-[2rem] transition-all text-left relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${selectedRecordId === rec.id ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}
                 >
                    <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-2xl ${selectedRecordId === rec.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                         {getTypeIcon(rec.type)}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-black text-slate-900 leading-none">{rec.title}</h4>
                             {rec.isVerified ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-amber-500" />}
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{rec.username}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <div className="text-right hidden sm:block">
                          <p className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusColor(rec.status)}`}>
                            {rec.status}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">UPDATE: {new Date(rec.updatedAt).toLocaleDateString()}</p>
                       </div>
                       <ChevronRight size={20} className={`transition-all ${selectedRecordId === rec.id ? 'text-blue-600 translate-x-1' : 'text-slate-300'}`} />
                    </div>
                 </button>
               ))}

               {!selectedCategoryId && (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-400">
                    <Key size={64} className="mb-4" />
                    <p className="font-black uppercase tracking-widest">Selecciona una categoría para ver claves</p>
                 </div>
               )}
               {selectedCategoryId && categoryRecords.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center py-20 opacity-30 text-slate-400">
                    <Plus size={48} className="mb-4" />
                    <p className="font-black uppercase tracking-widest">No hay registros aún</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right: Record Details Panel */}
        <div className="w-[450px] flex flex-col gap-4 overflow-hidden">
           {currentRecord ? (
             <div className="bg-white rounded-3xl border border-slate-200 flex flex-col h-full shadow-sm overflow-hidden">
                <div className="p-8 pb-4 border-b border-slate-100 bg-slate-50/50">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusColor(currentRecord.status)}`}>
                        {currentRecord.status}
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => { setRecForm(currentRecord); setIsRecordModalOpen(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"><Edit3 size={18}/></button>
                         <button onClick={() => deleteRecord(currentRecord.id)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors"><Trash2 size={18}/></button>
                      </div>
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 leading-tight">{currentRecord.title}</h3>
                   <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase">
                         <Building2 size={12}/> {currentRecord.company}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase">
                         {getTypeIcon(currentRecord.type)} {currentRecord.type}
                      </div>
                   </div>
                </div>

                <div className="flex bg-slate-100/50 p-1 mx-8 mt-6 rounded-2xl">
                   <button 
                    onClick={() => setActiveTab('detalle')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'detalle' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <Info size={14} /> Detalle
                   </button>
                   <button 
                    onClick={() => setActiveTab('historial')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'historial' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <History size={14} /> Auditoría
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-6">
                   {activeTab === 'detalle' ? (
                     <>
                        {/* Verificación Banner */}
                        {!currentRecord.isVerified ? (
                          <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-start gap-4 animate-pulse">
                             <ShieldAlert className="text-amber-600 shrink-0" size={24} />
                             <div>
                                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Requiere Verificación</p>
                                <p className="text-xs font-bold text-amber-800 leading-tight mb-3">Estos datos no han sido validados contra el servicio real recientemente.</p>
                                <button 
                                  onClick={() => verifyRecord(currentRecord.id)}
                                  className="px-4 py-2 bg-amber-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all"
                                >
                                  Marcar como Verificado
                                </button>
                             </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-3xl flex items-center gap-4">
                             <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
                             <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verificado ✅</p>
                                <p className="text-[9px] font-bold text-emerald-800 opacity-60">Última validación por {currentRecord.verifiedBy} el {new Date(currentRecord.verifiedAt!).toLocaleDateString()}</p>
                             </div>
                          </div>
                        )}

                        <div className="space-y-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuario / Email</label>
                              <div className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl group">
                                 <span className="flex-1 font-bold text-slate-900 truncate">{currentRecord.username}</span>
                                 <button onClick={() => copyToClipboard(currentRecord.username)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"><Copy size={16}/></button>
                              </div>
                           </div>

                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                              <div className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl group">
                                 <input 
                                  type={showPassword[currentRecord.id] ? "text" : "password"} 
                                  readOnly 
                                  value={currentRecord.password} 
                                  className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900"
                                 />
                                 <div className="flex items-center gap-1">
                                    <button onClick={() => togglePass(currentRecord.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 transition-all">{showPassword[currentRecord.id] ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                                    <button onClick={() => copyToClipboard(currentRecord.password)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Copy size={16}/></button>
                                 </div>
                              </div>
                           </div>

                           {/* Dinámicos */}
                           <div className="grid grid-cols-2 gap-4">
                              {Object.entries(currentRecord.dynamicFields).map(([key, value]) => (
                                <div key={key} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                   <p className="text-xs font-bold text-slate-800 break-words">{value}</p>
                                </div>
                              ))}
                           </div>

                           {currentRecord.notes && (
                             <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Notas / Observaciones</p>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{currentRecord.notes}</p>
                             </div>
                           )}

                           <div className="flex flex-wrap gap-2">
                              {currentRecord.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">#{tag}</span>
                              ))}
                           </div>
                        </div>
                     </>
                   ) : (
                     <div className="space-y-6">
                        {currentRecord.history.map((entry, idx) => (
                          <div key={entry.id} className="relative pl-8 pb-6 group">
                             {/* Línea Timeline */}
                             {idx !== currentRecord.history.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-100"></div>}
                             
                             {/* Icono Acción */}
                             <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                               entry.action === 'CREATE' ? 'border-emerald-500 text-emerald-500' :
                               entry.action === 'VERIFY' ? 'border-blue-500 text-blue-500' :
                               entry.action === 'STATUS_CHANGE' ? 'border-amber-500 text-amber-500' :
                               'border-slate-300 text-slate-400'
                             }`}>
                                {entry.action === 'CREATE' ? <Plus size={12}/> : 
                                 entry.action === 'VERIFY' ? <Check size={12}/> :
                                 entry.action === 'STATUS_CHANGE' ? <Activity size={12}/> :
                                 <Edit3 size={12}/>}
                             </div>

                             <div>
                                <div className="flex justify-between items-center mb-1">
                                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{entry.action}</p>
                                   <p className="text-[9px] font-bold text-slate-400">{new Date(entry.date).toLocaleString('es-ES', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})}</p>
                                </div>
                                <p className="text-xs font-bold text-slate-600 mb-2">Por {entry.actor}</p>
                                
                                {entry.changes && entry.changes.length > 0 && (
                                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                                     {entry.changes.map((c, ci) => (
                                       <div key={ci} className="text-[10px] leading-tight">
                                          <span className="font-black text-slate-400 uppercase tracking-widest block mb-1">{c.field}:</span>
                                          <div className="flex items-center gap-2 overflow-hidden">
                                             <span className="text-rose-500 line-through truncate max-w-[100px]">{c.before}</span>
                                             <ChevronRight size={10} className="text-slate-300 shrink-0" />
                                             <span className="text-emerald-600 font-bold truncate">{c.after}</span>
                                          </div>
                                       </div>
                                     ))}
                                  </div>
                                )}
                                {entry.note && <p className="text-[10px] italic text-slate-500 mt-2">"{entry.note}"</p>}
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
           ) : (
             <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                   <Monitor size={32} className="opacity-20" />
                </div>
                <h4 className="font-black text-slate-600 uppercase tracking-widest">Vista Previa</h4>
                <p className="text-xs font-medium mt-2 leading-relaxed">Selecciona una credencial del listado central para ver su ficha técnica, historial de auditoría y estados de verificación.</p>
             </div>
           )}
        </div>
      </div>

      {/* Modal Nueva Categoría */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xs rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center space-y-4">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto">
                    <FolderPlus size={32} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Categoría</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Organización de Accesos</p>
                 </div>
                 <input 
                  autoFocus
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none text-center font-bold"
                  placeholder="Nombre: WiFi, Gmail..."
                  value={catForm.name || ''}
                  onChange={e => setCatForm({...catForm, name: e.target.value})}
                 />
                 <div className="flex gap-2 pt-2">
                    <button onClick={() => setIsCategoryModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase hover:bg-slate-50 rounded-2xl transition-colors">Cerrar</button>
                    <button onClick={handleSaveCategory} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-100">Crear</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Modal Registro (Full Form) */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                 <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl">{recForm.id ? 'Editar Acceso' : 'Nuevo Acceso'}</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">En carpeta: {currentCategory?.name}</p>
               </div>
               <button onClick={() => setIsRecordModalOpen(false)} className="p-2 hover:bg-white hover:shadow-md rounded-full text-slate-400 transition-all"><X size={24}/></button>
             </div>
             <form onSubmit={handleSaveRecord} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {/* General Section */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2 md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Título del Servicio</label>
                      <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold" placeholder="Ej: Webmail Bioelectron" 
                        value={recForm.title || ''} onChange={e => setRecForm({...recForm, title: e.target.value})}/>
                   </div>
                   <div className="md:col-span-1 space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tipo de Acceso</label>
                      <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold"
                        value={recForm.type} onChange={e => setRecForm({...recForm, type: e.target.value as any, dynamicFields: {}})}>
                        <option value="EMAIL">EMAIL</option>
                        <option value="WIFI">WIFI</option>
                        <option value="CPANEL">CPANEL</option>
                        <option value="WORDPRESS">WORDPRESS</option>
                        <option value="PORTAINER">PORTAINER</option>
                        <option value="CONTANET">CONTANET</option>
                        <option value="PC_ACCOUNT">CUENTA PC</option>
                        <option value="OTHER">OTRO</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Empresa / Unidad</label>
                      <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold"
                        value={recForm.company} onChange={e => setRecForm({...recForm, company: e.target.value as any})}>
                        <option value="Aleph">Aleph</option>
                        <option value="Bioelectron">Bioelectron</option>
                        <option value="Otro">Otro / Externo</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Estado</label>
                      <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold"
                        value={recForm.status} onChange={e => setRecForm({...recForm, status: e.target.value as any})}>
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="ASIGNADO">ASIGNADO</option>
                        <option value="LIBRE">LIBRE</option>
                        <option value="DESACTUALIZADO">DESACTUALIZADO</option>
                        <option value="BAJA">BAJA / ELIMINAR</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Usuario / Cuenta</label>
                      <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold" placeholder="user@domain.com" 
                        value={recForm.username || ''} onChange={e => setRecForm({...recForm, username: e.target.value})}/>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Contraseña</label>
                      <input required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none font-bold" placeholder="*******" 
                        value={recForm.password || ''} onChange={e => setRecForm({...recForm, password: e.target.value})}/>
                   </div>
                </div>

                {/* Dynamic Fields Section */}
                <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Plus size={14} className="text-blue-600" /> Datos específicos para {recForm.type}
                   </h4>
                   
                   {recForm.type === 'EMAIL' && (
                     <div className="grid grid-cols-2 gap-4">
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="Dominio (@aleph.com)" 
                          value={recForm.dynamicFields?.domain || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, domain: e.target.value}})}/>
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="Proveedor (Outlook/Gmail)" 
                          value={recForm.dynamicFields?.provider || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, provider: e.target.value}})}/>
                     </div>
                   )}

                   {recForm.type === 'WIFI' && (
                     <div className="grid grid-cols-2 gap-4">
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="SSID (Nombre Red)" 
                          value={recForm.dynamicFields?.ssid || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, ssid: e.target.value}})}/>
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="Ubicación (Sede/Piso)" 
                          value={recForm.dynamicFields?.location || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, location: e.target.value}})}/>
                     </div>
                   )}

                   {recForm.type === 'CONTANET' && (
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="RUC Empresa" 
                             value={recForm.dynamicFields?.ruc || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, ruc: e.target.value}})}/>
                           <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="Dominio Contanet" 
                             value={recForm.dynamicFields?.contanetDomain || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, contanetDomain: e.target.value}})}/>
                        </div>
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="Link de acceso / Portal" 
                          value={recForm.dynamicFields?.portalLink || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, portalLink: e.target.value}})}/>
                     </div>
                   )}

                   {['CPANEL', 'WORDPRESS', 'PORTAINER'].includes(recForm.type || '') && (
                     <div className="space-y-4">
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="URL del Panel / Admin" 
                          value={recForm.dynamicFields?.url || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, url: e.target.value}})}/>
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="Hosting / Servidor" 
                          value={recForm.dynamicFields?.host || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, host: e.target.value}})}/>
                     </div>
                   )}

                   {recForm.type === 'PC_ACCOUNT' && (
                     <div className="grid grid-cols-2 gap-4">
                        <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold" placeholder="Hostname (PC-XXXX)" 
                          value={recForm.dynamicFields?.hostname || ''} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, hostname: e.target.value}})}/>
                        <select className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold"
                          value={recForm.dynamicFields?.accountType || 'Usuario'} onChange={e => setRecForm({...recForm, dynamicFields: {...recForm.dynamicFields, accountType: e.target.value}})}>
                          <option value="Usuario">Usuario Estándar</option>
                          <option value="Admin">Administrador</option>
                          <option value="Local">Cuenta Local</option>
                        </select>
                     </div>
                   )}
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Notas / Instrucciones adicionales</label>
                   <textarea className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none text-sm font-medium" placeholder="Añade detalles relevantes..."
                     value={recForm.notes || ''} onChange={e => setRecForm({...recForm, notes: e.target.value})}/>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                   <button type="button" onClick={() => setIsRecordModalOpen(false)} className="px-8 py-4 text-slate-400 font-bold text-xs uppercase hover:bg-slate-50 rounded-2xl transition-colors">Cancelar</button>
                   <button type="submit" className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">Guardar Credencial</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
