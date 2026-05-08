import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Send, MessageSquare, Upload, CheckCircle, ArrowRight } from 'lucide-react';

interface WriterOnboardingViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const WriterOnboardingView: React.FC<WriterOnboardingViewProps> = ({ onBack, onSuccess }) => {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container-low p-12 rounded-3xl border border-white/5 text-center max-w-lg shadow-2xl"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-black mb-4 uppercase italic">Proposta Enviada!</h2>
          <p className="text-on-surface-variant mb-8 font-medium">
            Nossa equipe editorial analisará sua obra. Em breve você receberá um e-mail com os próximos passos.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-20">
          <div className="flex-grow">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none"
            >
              Transforme seu <span className="text-primary">Traço</span> em <span className="text-white">Legado</span>
            </motion.h1>
            <p className="text-on-surface-variant text-xl max-w-2xl font-medium leading-relaxed">
              O Tori Studio é o lar dos criadores mais audaciosos. Publique sua HQ, Mangá ou Webtoon e alcance milhares de leitores.
            </p>
          </div>
          <div className="shrink-0 w-full lg:w-96 aspect-square bg-primary/10 rounded-[40px] border border-primary/20 flex items-center justify-center relative group">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all" />
             <Pencil size={120} className="text-primary relative z-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
           <FeatureCard 
             icon={<MessageSquare className="text-blue-400" />}
             title="Comunidade Ativa"
             desc="Entre no nosso Discord exclusivo para autores e troque experiências."
           />
           <FeatureCard 
             icon={<Upload className="text-green-400" />}
             title="Ferramentas Pro"
             desc="Dashboard completo para upload de capítulos e métricas de audiência."
           />
           <FeatureCard 
             icon={<Send className="text-purple-400" />}
             title="Aprovação Rápida"
             desc="Nossa curadoria responde em até 7 dias úteis sobre sua obra."
           />
        </div>

        <div className="bg-surface-container-low p-10 lg:p-16 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Pencil size={200} />
          </div>
          
          <h2 className="text-3xl font-black mb-10 uppercase italic relative z-10">Envie sua Proposta</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
             <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Nome da Obra</label>
                  <input required type="text" className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none" placeholder="Ex: Neon Ascendant" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Categoria</label>
                  <select className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none">
                     <option>HQ / Comic</option>
                     <option>Mangá</option>
                     <option>Webtoon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Descrição Curta</label>
                  <textarea rows={4} className="w-full bg-surface-container border border-white/5 rounded-2xl p-4 focus:ring-2 ring-primary outline-none" placeholder="Conte-nos um pouco sobre a história..."></textarea>
                </div>
             </div>
             
             <div className="flex flex-col justify-between h-full">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Upload da Obra (PDF)</label>
                  <div 
                    className={`group relative h-48 border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center gap-4 bg-white/5 cursor-pointer overflow-hidden ${fileName ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-primary/50'}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) setFileName(file.name);
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Upload size={40} className={`${fileName ? 'text-primary' : 'text-on-surface-variant'} group-hover:text-primary transition-transform group-hover:scale-110`} />
                    <div className="text-center px-4">
                       <p className="text-sm font-bold text-white uppercase tracking-widest mb-1 truncate max-w-xs">
                         {fileName || 'Arraste seu PDF aqui'}
                       </p>
                       <p className="text-[10px] text-on-surface-variant font-medium">
                         {fileName ? 'Arquivo selecionado com sucesso' : 'Ou clique para selecionar arquivos'}
                       </p>
                    </div>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFileName(file.name);
                      }} 
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-4 font-medium italic opacity-60">* Envie o roteiro ou as primeiras 5 páginas da sua obra.</p>
                </div>


                <div className="mt-8 space-y-4">

                  <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                    SOLICITAR APROVAÇÃO
                    <ArrowRight size={20} />
                  </button>
                  <a href="https://discord.gg/tori-studio" target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-[#5865F2] text-white font-black rounded-2xl uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3">
                    <MessageSquare size={20} />
                    NOSSO DISCORD
                  </a>
                </div>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 bg-surface-container border border-white/5 rounded-3xl hover:border-primary/20 transition-all group">
     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <h3 className="text-lg font-bold mb-2">{title}</h3>
     <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
  </div>
);
