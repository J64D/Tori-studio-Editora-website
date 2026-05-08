import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth';

interface SignupViewProps {
  onLoginClick: () => void;
  onSuccess: () => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onLoginClick, onSuccess }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(email, password, name);
      onSuccess();
    } catch (err: any) {

      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 bg-surface-container-low p-10 rounded-3xl border border-white/5 shadow-2xl"
      >
        <button 
          onClick={onLoginClick}
          className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} />
          VOLTAR
        </button>

        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-primary italic uppercase tracking-tighter"
          >
            Criar Conta
          </motion.h2>
          <p className="mt-2 text-on-surface-variant font-medium">Junte-se ao Tori Studio hoje!</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl text-center font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-surface-container border border-white/5 rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-surface-container border border-white/5 rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="Seu e-mail"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-surface-container border border-white/5 rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="Sua senha"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-surface-container border border-white/5 rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="Confirme sua senha"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-2xl shadow-lg text-lg font-black text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95 shadow-primary/20"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={20} />
                CRIAR CONTA
              </>
            )}
          </button>
        </form>

        <p className="text-center text-on-surface-variant font-medium">
          Já tem uma conta?{' '}
          <button 
            onClick={onLoginClick}
            className="font-black text-primary hover:text-primary/80 transition-colors"
          >
            ENTRE AGORA
          </button>
        </p>
      </motion.div>
    </div>
  );
};
