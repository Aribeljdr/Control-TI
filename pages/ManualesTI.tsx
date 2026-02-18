
import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  MoreVertical, 
  Image as ImageIcon,
  Trash2,
  Edit,
  Save,
  X,
  Download,
  ArrowLeft,
  Maximize2,
  Star,
  Tag as TagIcon,
  Clock,
  Library as LibraryIcon
} from 'lucide-react';
import { ManualFolder, ManualFile, ManualPhoto } from '../types';

interface ManualesTIProps {
  folders: ManualFolder[];
  manuals: ManualFile[];
  onSaveFolders: (f: ManualFolder[]) => void;
  onSaveManuals: (m: ManualFile[]) => void;
}

export const ManualesTI: React.FC<ManualesTIProps> = ({ folders, manuals, onSaveFolders, onSaveManuals }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedManualId, setSelectedManualId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Form State para Manual
  const [manualForm, setManualForm] = useState<Partial<ManualFile>>({});

  const filteredFolders = useMemo(() => {
    if (!searchTerm) return folders;
    return folders.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manuals.some(m => m.folderId === f.id && (
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }, [folders, manuals, searchTerm]);

  const currentFolder = folders.find(f => f.id === selectedFolderId);
  const currentManual = manuals.find(m => m.id === selectedManualId);
  const folderManuals = manuals.filter(m => m.folderId === selectedFolderId);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: ManualFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const handleDeleteFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Eliminar esta carpeta y todos sus manuales?')) {
      onSaveFolders(folders.filter(f => f.id !== id));
      onSaveManuals(manuals.filter(m => m.folderId !== id));
      if (selectedFolderId === id) setSelectedFolderId(null);
    }
  };

  const handleCreateManual = () => {
    if (!selectedFolderId) return;
    const newManual: ManualFile = {
      id: Math.random().toString(36).substr(2, 9),
      folderId: selectedFolderId,
      title: 'Nuevo Manual',
      content: '',
      tags: [],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveManuals([...manuals, newManual]);
    setSelectedManualId(newManual.id);
    setIsEditing(true);
    setManualForm(newManual);
  };

  const handleSaveManual = () => {
    if (!manualForm.id) return;
    const updated = manuals.map(m => m.id === manualForm.id ? { ...m, ...manualForm, updatedAt: new Date().toISOString() } as ManualFile : m);
    onSaveManuals(updated);
    setIsEditing(false);
  };

  const handleDeleteManual = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (window.confirm('¿Está seguro de eliminar este manual definitivamente?')) {
      const updatedManuals = manuals.filter(m => m.id !== id);
      onSaveManuals(updatedManuals);
      
      // Si el manual borrado es el que estamos viendo, cerrar la vista
      if (selectedManualId === id) {
        setSelectedManualId(null);
        setIsEditing(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return alert('Máximo 3MB');

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      const newPhoto: ManualPhoto = {
        id: Math.random().toString(36).substr(2, 9),
        base64,
        createdAt: new Date().toISOString()
      };
      setManualForm(prev => ({
        ...prev,
        images: [...(prev.images || []), newPhoto]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const coverImage = currentManual?.images.find(img => img.id === currentManual.coverImageId)?.base64 || 
                     (currentManual?.images[0]?.base64);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header Sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manuales TI</h1>
          <p className="text-slate-500 font-medium">Base de conocimientos y guía de traspaso técnico</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
              type="text" 
              placeholder="Buscar en la wiki..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
             />
           </div>
           <button 
            onClick={() => setIsFolderModalOpen(true)}
            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            title="Nueva Carpeta"
           >
             <Folder size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar de Navegación (Carpetas) */}
        <div className="w-72 bg-white border border-slate-200 rounded-3xl p-4 flex flex-col gap-2 overflow-y-auto print:hidden shadow-sm">
           <h3 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Directorios</h3>
           {filteredFolders.map(folder => (
             <button 
              key={folder.id}
              onClick={() => { setSelectedFolderId(folder.id); setSelectedManualId(null); setIsEditing(false); }}
              className={`group flex items-center justify-between p-3 rounded-2xl transition-all ${selectedFolderId === folder.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               <div className="flex items-center gap-3">
                 <Folder size={18} className={selectedFolderId === folder.id ? 'text-blue-100' : 'text-blue-500'} />
                 <span className="font-bold text-sm truncate w-40 text-left">{folder.name}</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className={`text-[10px] font-black ${selectedFolderId === folder.id ? 'text-blue-200' : 'text-slate-300'}`}>
                   {manuals.filter(m => m.folderId === folder.id).length}
                 </span>
                 <Trash2 
                  size={14} 
                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${selectedFolderId === folder.id ? 'text-blue-200 hover:text-white' : 'text-slate-300 hover:text-rose-500'}`} 
                  onClick={(e) => handleDeleteFolder(folder.id, e)}
                 />
               </div>
             </button>
           ))}
           {filteredFolders.length === 0 && (
             <div className="py-10 text-center opacity-40">
               <Folder size={32} className="mx-auto mb-2" />
               <p className="text-xs">Sin carpetas</p>
             </div>
           )}
        </div>

        {/* Área Principal */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm relative">
          
          {!selectedFolderId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                 <LibraryIcon size={40} />
               </div>
               <h3 className="text-xl font-black text-slate-800">Selecciona una categoría</h3>
               <p className="text-slate-500 max-w-xs mt-2">Navega por las carpetas de la izquierda para ver los manuales disponibles o crea una nueva categoría.</p>
            </div>
          ) : !selectedManualId ? (
            /* Vista de Lista de Manuales en Carpeta */
            <div className="flex-1 flex flex-col overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Carpeta:</span>
                    <h2 className="text-xl font-black text-slate-900">{currentFolder?.name}</h2>
                  </div>
                  <button 
                    onClick={handleCreateManual}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    <Plus size={16} /> NUEVO MANUAL
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {folderManuals.map(manual => {
                    const mCover = manual.images.find(i => i.id === manual.coverImageId)?.base64 || manual.images[0]?.base64;
                    return (
                      <div 
                        key={manual.id}
                        onClick={() => setSelectedManualId(manual.id)}
                        className="group bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full"
                      >
                         <div className="aspect-video rounded-[2rem] bg-slate-100 mb-4 overflow-hidden relative">
                           {mCover ? (
                             <img src={mCover} className="w-full h-full object-cover" alt="" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <FileText size={40} />
                             </div>
                           )}
                           <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                type="button"
                                onClick={(e) => handleDeleteManual(manual.id, e)} 
                                className="p-2.5 bg-white/90 text-rose-500 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 active:scale-90"
                              >
                                <Trash2 size={16} />
                              </button>
                           </div>
                         </div>
                         <h4 className="font-black text-slate-900 line-clamp-2 mb-2 leading-tight">{manual.title}</h4>
                         <div className="mt-auto flex items-center justify-between">
                            <div className="flex gap-1">
                               {manual.tags.slice(0, 2).map(tag => (
                                 <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-widest">{tag}</span>
                               ))}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(manual.updatedAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                    );
                  })}
                  {folderManuals.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400">
                       <FileText size={48} className="mx-auto mb-4 opacity-10" />
                       <p className="font-bold">No hay manuales en esta carpeta todavía.</p>
                    </div>
                  )}
               </div>
            </div>
          ) : (
            /* Vista de Visualización / Edición de Manual */
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
               {/* Toolbar del Manual */}
               <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white print:hidden">
                  <button 
                    onClick={() => { setSelectedManualId(null); setIsEditing(false); }}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors flex items-center gap-2 font-bold text-xs"
                  >
                    <ArrowLeft size={18} /> <span className="hidden sm:inline">VOLVER</span>
                  </button>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500 font-bold text-xs hover:bg-slate-100 rounded-xl transition-colors">CANCELAR</button>
                        <button onClick={handleSaveManual} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-emerald-100">
                          <Save size={16} /> GUARDAR CAMBIOS
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => handleDeleteManual(currentManual!.id, e)} 
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" 
                          title="Eliminar Manual"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button onClick={handlePrint} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors" title="Exportar PDF">
                          <Download size={20} />
                        </button>
                        <button onClick={() => { setIsEditing(true); setManualForm(currentManual!); }} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                          <Edit size={16} /> EDITAR
                        </button>
                      </>
                    )}
                  </div>
               </div>

               {/* Contenido del Manual */}
               <div className="flex-1 overflow-y-auto p-8 md:p-12 print:p-0">
                  {/* Vista Impresión (Oculta normalmente) */}
                  <div className="hidden print:block mb-10 border-b-4 border-slate-900 pb-6">
                     <div className="flex justify-between items-center mb-6">
                        <div className="text-blue-600 font-black text-2xl">IT KNOWLEDGE BASE</div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</div>
                     </div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carpeta: {currentFolder?.name}</div>
                     <h1 className="text-4xl font-black text-slate-900 leading-none">{currentManual?.title}</h1>
                  </div>

                  {isEditing ? (
                    <div className="space-y-8 max-w-4xl mx-auto">
                       <input 
                        className="w-full text-4xl font-black text-slate-900 border-none outline-none placeholder:text-slate-200"
                        placeholder="Título del Manual..."
                        value={manualForm.title || ''}
                        onChange={e => setManualForm({...manualForm, title: e.target.value})}
                       />
                       
                       <div className="flex flex-wrap gap-2 items-center">
                          <TagIcon size={16} className="text-slate-400" />
                          {manualForm.tags?.map((tag, idx) => (
                            <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase">
                              {tag} <X size={12} className="cursor-pointer" onClick={() => setManualForm({...manualForm, tags: manualForm.tags?.filter((_, i) => i !== idx)})} />
                            </span>
                          ))}
                          <input 
                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase text-blue-600 placeholder:text-blue-300 w-32"
                            placeholder="AÑADIR TAG + ENTER"
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                const val = e.currentTarget.value.trim();
                                if (val) {
                                  setManualForm({...manualForm, tags: [...(manualForm.tags || []), val]});
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Contenido del Manual</label>
                          <textarea 
                            className="w-full h-96 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:border-blue-600 outline-none text-slate-700 font-medium leading-relaxed"
                            placeholder="Escribe el paso a paso, causa y solución..."
                            value={manualForm.content || ''}
                            onChange={e => setManualForm({...manualForm, content: e.target.value})}
                          />
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Galería de Evidencias ({manualForm.images?.length || 0})</label>
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all">
                               <Plus size={16} /> SUBIR IMAGEN
                               <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                             {manualForm.images?.map((img, idx) => (
                               <div key={img.id} className="group aspect-square relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                  <img src={img.base64} className="w-full h-full object-cover" alt="" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                                     <button onClick={() => setManualForm({...manualForm, coverImageId: img.id})} className={`p-1.5 rounded-lg ${manualForm.coverImageId === img.id ? 'bg-amber-500 text-white' : 'bg-white text-amber-500'}`} title="Usar como portada">
                                        <Star size={14} />
                                     </button>
                                     <button onClick={() => setManualForm({...manualForm, images: manualForm.images?.filter(i => i.id !== img.id)})} className="p-1.5 bg-white text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                                        <Trash2 size={14} />
                                     </button>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  ) : (
                    /* Visualización */
                    <div className="max-w-4xl mx-auto space-y-10">
                       {coverImage && (
                         <div className="aspect-[21/9] rounded-[3rem] overflow-hidden bg-slate-100 shadow-xl print:hidden">
                           <img src={coverImage} className="w-full h-full object-cover" alt="" />
                         </div>
                       )}
                       
                       <div className="space-y-4">
                         <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight print:hidden">{currentManual?.title}</h2>
                         <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full font-black text-[10px] uppercase tracking-widest">
                               <Clock size={14} /> {new Date(currentManual!.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                               {currentManual?.tags.map(tag => (
                                 <span key={tag} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full font-black text-[10px] uppercase tracking-widest">{tag}</span>
                               ))}
                            </div>
                         </div>
                       </div>

                       <div className="prose prose-slate max-w-none">
                          <div className="whitespace-pre-wrap text-lg text-slate-700 leading-relaxed font-medium">
                            {currentManual?.content || <span className="text-slate-300 italic">Este manual no tiene contenido aún...</span>}
                          </div>
                       </div>

                       {currentManual?.images && currentManual.images.length > 0 && (
                         <div className="space-y-6 pt-10 border-t border-slate-100 print:pt-4">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Evidencias e Imágenes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {currentManual.images.map(img => (
                                 <div key={img.id} className="group rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-xl transition-all print:shadow-none print:rounded-3xl">
                                    <div className="relative aspect-video">
                                      <img src={img.base64} className="w-full h-full object-cover" alt="" />
                                      <button 
                                        onClick={() => setZoomImage(img.base64)}
                                        className="absolute bottom-4 right-4 p-3 bg-white/90 text-slate-600 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 print:hidden"
                                      >
                                        <Maximize2 size={20} />
                                      </button>
                                    </div>
                                    {img.caption && (
                                      <div className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wide bg-white">
                                        {img.caption}
                                      </div>
                                    )}
                                 </div>
                               ))}
                            </div>
                         </div>
                       )}

                       <div className="hidden print:block pt-10 border-t border-slate-100 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                          Mantenimiento Preventivo IT - Knowledge Base &bull; Página 1 de 1
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nueva Carpeta */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xs rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center space-y-4">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto">
                    <Folder size={32} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Nueva Categoría</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Organización de Manuales</p>
                 </div>
                 <input 
                  autoFocus
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 outline-none text-center font-bold"
                  placeholder="Ej: Redes / Software"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                 />
                 <div className="flex gap-2 pt-2">
                    <button onClick={() => setIsFolderModalOpen(false)} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase hover:bg-slate-50 rounded-2xl transition-colors">Cerrar</button>
                    <button onClick={handleCreateFolder} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-100">Crear</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Zoom Imagen */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
           <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={40} />
           </button>
           <img src={zoomImage} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-90 duration-300" alt="Zoom" />
        </div>
      )}
    </div>
  );
};
