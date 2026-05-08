import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, QrCode, X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  planName: string;
  price: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ planName, price, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'credit' | 'pix'>('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simula tempo de processamento
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isProcessing && !isSuccess ? onClose : undefined}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-surface-container-high border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-widest text-primary">Assinar {planName}</h2>
            <p className="text-on-surface-variant text-sm font-medium">Total: <span className="text-white">{price}/mês</span></p>
          </div>
          {!isProcessing && !isSuccess && (
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-on-surface-variant hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white">Pagamento Aprovado!</h3>
                <p className="text-on-surface-variant">Bem-vindo(a) ao plano {planName}. Aproveite seus novos benefícios.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex gap-4 p-1 bg-background rounded-xl">
                  <button 
                    onClick={() => setMethod('credit')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'credit' ? 'bg-surface-container-high text-white shadow' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <CreditCard size={18} /> Cartão de Crédito
                  </button>
                  <button 
                    onClick={() => setMethod('pix')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'pix' ? 'bg-surface-container-high text-white shadow' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <QrCode size={18} /> PIX
                  </button>
                </div>

                {method === 'credit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Número do Cartão</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Validade</label>
                        <input type="text" placeholder="MM/AA" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">CVV</label>
                        <input type="text" placeholder="123" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Nome no Cartão</label>
                      <input type="text" placeholder="JOAO DA SILVA" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                )}

                {method === 'pix' && (
                  <div className="flex flex-col items-center justify-center py-6 bg-background rounded-xl border border-white/5 space-y-4">
                    <div className="w-48 h-48 bg-white p-2 rounded-lg">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=toristudio-pix-${Date.now()}`} alt="QR Code PIX" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium text-center px-6">
                      Escaneie o QR Code com o aplicativo do seu banco para finalizar a assinatura.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isSuccess && (
          <div className="p-6 border-t border-white/5 bg-background/50 shrink-0">
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Processando...
                </>
              ) : (
                `Confirmar ${price}/mês`
              )}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Pagamento 100% Seguro e Criptografado</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
