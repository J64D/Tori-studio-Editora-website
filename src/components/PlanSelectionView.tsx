import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckoutModal } from './CheckoutModal';
import { Check, Star, Zap, Crown, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface PlanSelectionViewProps {
  currentPlan: string;
  onSelectPlan: (plan: UserProfile['plan']) => void;
  onBack: () => void;
}

export const PlanSelectionView: React.FC<PlanSelectionViewProps> = ({ currentPlan, onSelectPlan, onBack }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{name: UserProfile['plan'], price: string} | null>(null);

  const plans = [
    {
      name: 'Free' as const,
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar sua jornada.',
      features: [
        'Acesso a capítulos gratuitos',
        '1 AudioStory por semana',
        'Leitura com anúncios',
        '1 perfil de usuário'
      ],

      icon: <Star className="text-on-surface-variant" size={24} />,
      color: 'bg-surface-container-high',
      buttonText: 'Plano Atual'
    },
    {
      name: 'Leitor em Ascensão' as const,
      price: 'R$ 8',
      period: '/mês',
      description: 'Para quem quer mais imersão e exclusividade.',
      features: [
        'Tudo do plano Free',
        'Sem anúncios',
        'Capítulos antecipados',
        'Áudio de alta fidelidade',
        'Download para ler offline'
      ],
      icon: <Zap className="text-yellow-400" size={24} />,
      color: 'bg-yellow-400/10 border-yellow-400/20',
      buttonText: 'Fazer Upgrade',
      popular: true
    },
    {
      name: 'Premium' as const,
      price: 'R$ 15',
      period: '/mês',
      description: 'A experiência definitiva do Tori Studio.',
      features: [
        'Tudo do Leitor em Ascensão',
        'Acesso total ao catálogo',
        'Bastidores e artes exclusivas',
        'Suporte prioritário',
        'Até 3 perfis'
      ],
      icon: <Crown className="text-primary" size={24} />,
      color: 'bg-primary/10 border-primary/20',
      buttonText: 'Seja Premium'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-bold mb-8"
        >
          <ArrowLeft size={20} />
          VOLTAR
        </button>

        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter mb-4"
          >
            Escolha seu <span className="text-primary">Destino</span>
          </motion.h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Desbloqueie histórias incríveis, áudios imersivos e recursos exclusivos com nossos planos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular ? 'border-yellow-400/50 scale-105 z-10 shadow-2xl shadow-yellow-400/10' : 'border-white/5 shadow-xl'} ${plan.color} backdrop-blur-sm`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  Mais Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-white/5 rounded-2xl">
                  {plan.icon}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black">{plan.price}</span>
                  <span className="text-on-surface-variant text-sm">{plan.period}</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-on-surface-variant text-sm mb-8">{plan.description}</p>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-sm text-on-surface/80">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (plan.name === currentPlan) return;
                  if (plan.price === 'R$ 0') {
                    onSelectPlan(plan.name);
                  } else {
                    setSelectedPlanForCheckout({ name: plan.name, price: plan.price });
                    setIsCheckoutOpen(true);
                  }
                }}
                disabled={plan.name === currentPlan}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  plan.name === currentPlan
                    ? 'bg-white/5 text-on-surface-variant cursor-default border border-white/5'
                    : plan.popular
                    ? 'bg-yellow-400 text-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-yellow-400/20'
                    : 'bg-primary text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 text-center text-on-surface-variant text-sm italic">
          * Você pode alterar ou cancelar seu plano a qualquer momento. Termos e condições se aplicam.
        </p>
      </div>

      <AnimatePresence>
        {isCheckoutOpen && selectedPlanForCheckout && (
          <CheckoutModal 
            planName={selectedPlanForCheckout.name}
            price={selectedPlanForCheckout.price}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={() => {
              setIsCheckoutOpen(false);
              onSelectPlan(selectedPlanForCheckout.name);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
