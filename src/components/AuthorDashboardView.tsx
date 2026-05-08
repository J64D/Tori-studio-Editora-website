import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  MoreVertical,
  PlusCircle,
  FileText,
  Trash2,
  Edit2,
  ChevronRight,
  ArrowLeft,
  LayoutGrid
} from 'lucide-react';
import { Comic, Chapter } from '../types';

interface AuthorDashboardViewProps {
  comics: Comic[];
  onViewChapter: (comic: Comic, chapter: Chapter) => void;
}

export const AuthorDashboardView: React.FC<AuthorDashboardViewProps> = ({ comics, onViewChapter }) => {
  const [activeView, setActiveView] = useState<'overview' | 'upload' | 'edit' | 'chapters'>('overview');
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const authorComics = comics.filter(c => c.author === 'Tori Original');

  const handleAction = (comic: Comic, view: 'edit' | 'chapters') => {
    setSelectedComic(comic);
    setActiveView(view);
    setActiveMenuId(null);
  };

  if (activeView === 'upload') {
    return <UploadWorkView onBack={() => setActiveView('overview')} />;
  }

  if (activeView === 'edit' && selectedComic) {
    return <UploadWorkView isEditing comic={selectedComic} onBack={() => setActiveView('overview')} />;
  }

  if (activeView === 'chapters' && selectedComic) {
    return <ManageChaptersView comic={selectedComic} onBack={() => setActiveView('overview')} onViewChapter={onViewChapter} />;
  }


  return (
    <div className="p-8 lg:p-20 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 uppercase italic tracking-tighter">Painel do Autor</h1>
          <p className="text-on-surface-variant font-medium">Bem-vindo de volta! Gerencie suas criações.</p>
        </div>
        <button 
          onClick={() => setActiveView('upload')}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} />
          Publicar Obra
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
         <StatCard icon={<Eye className="text-blue-400" />} label="Views" value="124.8k" trend="+12%" />
         <StatCard icon={<ThumbsUp className="text-green-400" />} label="Upvotes" value="45.2k" trend="+5%" />
         <StatCard icon={<ThumbsDown className="text-red-400" />} label="Downvotes" value="1.2k" trend="-2%" />
         <StatCard icon={<TrendingUp className="text-purple-400" />} label="Ranking" value="#12" trend="↑ 3" />
      </div>

      <section>
        <h2 className="text-2xl font-black uppercase italic mb-8">Minhas Obras</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {authorComics.map(comic => (
             <motion.div 
               key={comic.id}
               className="bg-surface-container-low p-6 rounded-3xl border border-white/5 flex gap-6 relative group"
             >
                <div className="shrink-0 w-32 h-44 rounded-2xl overflow-hidden shadow-xl">
                   <img src={comic.coverUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-grow flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{comic.title}</h3>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === comic.id ? null : comic.id)}
                          className="p-2 text-on-surface-variant hover:text-white transition-colors"
                        >
                          <MoreVertical size={20} />
                        </button>
                        
                        <AnimatePresence>
                          {activeMenuId === comic.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              className="absolute right-0 top-10 w-48 bg-surface-container-high border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            >
                               <button onClick={() => handleAction(comic, 'edit')} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-sm font-bold">
                                  <Edit2 size={16} className="text-primary" /> Editar Detalhes
                               </button>
                               <button onClick={() => handleAction(comic, 'chapters')} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-sm font-bold border-t border-white/5">
                                  <LayoutGrid size={16} className="text-blue-400" /> Ver Capítulos
                               </button>
                               <button 
                                 onClick={() => {
                                   setSelectedComic(comic);
                                   setActiveView('chapters');
                                   // We need a way to trigger 'isAdding' in ManageChaptersView immediately
                                   // For now, let's just use chapters view and tell them it's there
                                   alert('Vá em "Novo Capítulo" na próxima tela para adicionar conteúdo.');
                                 }} 
                                 className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-sm font-bold border-t border-white/5"
                               >
                                  <Upload size={16} className="text-green-400" /> Adicionar Capítulo
                               </button>
                               <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-sm font-bold border-t border-white/5 text-red-400">
                                  <Trash2 size={16} /> Excluir Obra
                               </button>

                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                   </div>
                   <div className="flex gap-4 mb-4">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-on-surface-variant">{comic.category}</span>
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase">Publicado</span>
                   </div>
                   <div className="mt-auto grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                      <div className="text-center">
                         <p className="text-[10px] text-on-surface-variant font-black uppercase mb-1">Views</p>
                         <p className="font-black text-sm">{comic.ratingCount}</p>
                      </div>
                      <div className="text-center border-x border-white/5">
                         <p className="text-[10px] text-on-surface-variant font-black uppercase mb-1">Rating</p>
                         <p className="font-black text-sm text-yellow-400">{comic.rating}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[10px] text-on-surface-variant font-black uppercase mb-1">Caps</p>
                         <p className="font-black text-sm">{comic.chapters.length}</p>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}

           <button 
             onClick={() => setActiveView('upload')}
             className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all group min-h-[176px]"
           >
              <PlusCircle size={48} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-sm">Criar Nova Obra</span>
           </button>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) => (
  <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5 shadow-xl">
     <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${trend.startsWith('+') || trend.startsWith('↑') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
           {trend}
        </span>
     </div>
     <p className="text-xs text-on-surface-variant font-black uppercase tracking-widest mb-1">{label}</p>
     <p className="text-3xl font-black text-white">{value}</p>
  </div>
);

const ManageChaptersView = ({ comic, onBack, onViewChapter }: { comic: Comic, onBack: () => void, onViewChapter: (c: Comic, ch: Chapter) => void }) => {

  const [chapters, setChapters] = useState<Chapter[]>(comic.chapters);
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return <AddChapterView comicTitle={comic.title} chapterNumber={chapters.length + 1} onBack={() => setIsAdding(false)} />;
  }

  return (
    <div className="p-8 lg:p-20 max-w-5xl mx-auto">
       <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors font-bold mb-12 flex items-center gap-2 uppercase tracking-widest text-sm">
         <ArrowLeft size={20} /> VOLTAR
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 uppercase italic tracking-tighter">Capítulos</h1>
          <p className="text-on-surface-variant font-medium">Gerencie o conteúdo de <span className="text-white">"{comic.title}"</span></p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
        >
          <Plus size={20} />
          Novo Capítulo
        </button>
      </div>

      <div className="space-y-4">
         {chapters.map((ch, i) => (
           <div 
             key={ch.id} 
             onClick={() => onViewChapter(comic, ch)}
             className="bg-surface-container-low p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-primary/40 hover:bg-white/[0.02] cursor-pointer transition-all"
           >
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-on-surface-variant group-hover:text-primary transition-colors">
                    {ch.id < 10 ? `0${ch.id}` : ch.id}
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors">{ch.title}</h3>
                    <p className="text-xs text-on-surface-variant font-bold">{ch.date} • {ch.images.length} páginas</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={(e) => e.stopPropagation()} className="p-3 hover:bg-white/5 rounded-xl text-on-surface-variant hover:text-white transition-colors">
                    <Edit2 size={18} />
                 </button>
                 <button onClick={(e) => e.stopPropagation()} className="p-3 hover:bg-red-500/10 rounded-xl text-on-surface-variant hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                 </button>
                 <div className="w-px h-8 bg-white/5 mx-2" />
                 <ChevronRight size={20} className="text-primary" />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};


const UploadWorkView = ({ onBack, isEditing, comic }: { onBack: () => void, isEditing?: boolean, comic?: Comic }) => {
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [chapterFileName, setChapterFileName] = useState<string | null>(null);

  return (
    <div className="p-8 lg:p-20 max-w-4xl mx-auto">
      <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors font-bold mb-12 flex items-center gap-2 uppercase tracking-widest text-sm">
         <ArrowLeft size={20} /> VOLTAR
      </button>

      <h1 className="text-4xl font-black uppercase italic mb-4">{isEditing ? 'Editar Obra' : 'Publicar Nova Obra'}</h1>
      <p className="text-on-surface-variant mb-12 font-medium">{isEditing ? 'Atualize as informações da sua história.' : 'Preencha os dados abaixo para iniciar sua jornada como autor.'}</p>

      <form className="space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Título da HQ/Mangá</label>
                  <input type="text" defaultValue={comic?.title} className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none text-white font-bold" placeholder="Nome da sua obra" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Categoria</label>
                    <select defaultValue={comic?.category} className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none text-white font-bold">
                       <option>Ação</option>
                       <option>Aventura</option>
                       <option>Fantasia</option>
                       <option>Romance</option>
                       <option>Terror</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Classificação</label>
                    <select defaultValue={comic?.ageRating || 'L'} className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none text-white font-bold">
                       <option value="L">Livre (L)</option>
                       <option value="10">10 Anos</option>
                       <option value="12">12 Anos</option>
                       <option value="14">14 Anos</option>
                       <option value="16">16 Anos</option>
                       <option value="18">18 Anos</option>
                    </select>
                 </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Descrição</label>
                  <textarea rows={6} defaultValue={comic?.description} className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none text-white" placeholder="Sinopse da história..."></textarea>
               </div>
            </div>

            <div className="space-y-8">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Capa da Obra (Vertical)</label>
                  <div className={`relative aspect-[2/3] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group overflow-hidden ${coverFileName ? 'border-primary bg-primary/5' : 'border-white/10 bg-surface-container hover:border-primary/40 hover:text-primary'}`}>
                     {comic?.coverUrl && !coverFileName ? (
                       <img src={comic.coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                     ) : null}
                     <Upload size={40} className={`${coverFileName ? 'text-primary' : 'text-on-surface-variant'} group-hover:scale-110 transition-transform relative z-10`} />
                     <span className="text-xs font-bold uppercase tracking-widest relative z-10 text-center px-4">
                       {coverFileName || (isEditing ? 'Trocar Capa' : 'Upload Capa')}
                     </span>
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={(e) => setCoverFileName(e.target.files?.[0]?.name || null)} />
                  </div>
               </div>
               
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Tags (Separadas por vírgula)</label>
                  <input type="text" defaultValue={comic?.tags.join(', ')} className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none text-white" placeholder="cyberpunk, magia, medieval..." />
               </div>
            </div>
         </div>

         {!isEditing && (
           <div className="pt-10 border-t border-white/5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Conteúdo do Capítulo 01 (PDF ou Imagens)</label>
              <div 
                className={`group relative h-64 border-2 border-dashed rounded-[32px] transition-all flex flex-col items-center justify-center gap-4 bg-white/5 cursor-pointer overflow-hidden ${chapterFileName ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) setChapterFileName(file.name);
                }}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <PlusCircle size={48} className={`${chapterFileName ? 'text-primary' : 'text-on-surface-variant'} group-hover:text-primary transition-transform group-hover:scale-110`} />
                <div className="text-center px-8">
                   <p className="text-sm font-bold text-white uppercase tracking-widest mb-1 truncate max-w-md">
                     {chapterFileName || 'Arraste o PDF ou Imagens do Cap 01'}
                   </p>
                   <p className="text-[10px] text-on-surface-variant font-medium">
                     {chapterFileName ? 'Capítulo carregado' : 'Obrigatório para a primeira publicação'}
                   </p>
                </div>
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setChapterFileName(e.target.files?.[0]?.name || null)} />
              </div>
           </div>
         )}



         <div className="pt-10 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => {
                if (isEditing) {
                  onBack();
                } else {
                  // Simulate moving to add chapter 1
                  alert('Metadados salvos! Agora vamos para o upload das imagens/PDF do Capítulo 01.');
                  onBack(); // In a real app, this would change view state
                }
              }} 
              className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/40 text-xl"
            >
               {isEditing ? 'SALVAR ALTERAÇÕES' : 'CRIAR E PUBLICAR OBRA'}

            </button>
         </div>

      </form>
    </div>
  );
};

const AddChapterView = ({ comicTitle, chapterNumber, onBack }: { comicTitle: string, chapterNumber: number, onBack: () => void }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="p-8 lg:p-20 max-w-4xl mx-auto">
      <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors font-bold mb-12 flex items-center gap-2 uppercase tracking-widest text-sm">
         <ArrowLeft size={20} /> VOLTAR
      </button>

      <h1 className="text-4xl font-black uppercase italic mb-4">Novo Capítulo</h1>
      <p className="text-on-surface-variant mb-12 font-medium">Adicionando Capítulo {chapterNumber} em <span className="text-white">"{comicTitle}"</span></p>

      <form className="space-y-10">
         <div className="space-y-8">
            <div>
               <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Título do Capítulo</label>
               <input type="text" className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none text-white font-bold" placeholder={`Capítulo ${chapterNumber}: Título`} />
            </div>
            
            <div>
               <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Conteúdo do Capítulo (PDF ou Imagens)</label>
               <div 
                 className={`group relative h-80 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center gap-4 bg-white/5 cursor-pointer overflow-hidden ${fileName ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50'}`}
                 onDragOver={(e) => e.preventDefault()}
                 onDrop={(e) => {
                   e.preventDefault();
                   const file = e.dataTransfer.files[0];
                   if (file) setFileName(file.name);
                 }}
               >
                 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Upload size={60} className={`${fileName ? 'text-primary' : 'text-on-surface-variant'} group-hover:text-primary transition-transform group-hover:scale-110`} />
                 <div className="text-center px-8">
                    <p className="text-lg font-bold text-white uppercase tracking-widest mb-2 truncate max-w-lg">
                      {fileName || 'Arraste seus arquivos aqui'}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {fileName ? 'Conteúdo carregado com sucesso' : 'Suporta PDF, JPG ou PNG em alta resolução'}
                    </p>
                 </div>
                 <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
               </div>
               <p className="text-[10px] text-on-surface-variant mt-4 font-medium italic opacity-60">* Você pode enviar várias imagens de uma vez para compor o capítulo.</p>
            </div>
         </div>

         <div className="pt-10 border-t border-white/5">
            <button type="button" onClick={onBack} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/40 text-xl">
               PUBLICAR CAPÍTULO
            </button>
         </div>
      </form>
    </div>
  );
};


