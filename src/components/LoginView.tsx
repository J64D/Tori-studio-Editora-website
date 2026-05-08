import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Github, Chrome } from 'lucide-react';
import { useAuth } from '../auth';


interface LoginViewProps {
  onSignupClick: () => void;
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSignupClick, onSuccess }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      onSuccess();
    } catch (err: any) {

      setError('E-mail ou senha incorretos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-surface-container-low p-10 rounded-3xl border border-white/5 shadow-2xl"
      >
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-primary italic uppercase tracking-tighter"
          >
            Tori Studio
          </motion.h2>
          <p className="mt-2 text-on-surface-variant font-medium">Bem-vindo de volta!</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 text-error text-sm rounded-xl text-center font-bold">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
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
          </div>

          <div className="flex items-center justify-end">
            <button type="button" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
              Esqueceu a senha?
            </button>
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
                <LogIn size={20} />
                ENTRAR
              </>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-surface-container-low text-on-surface-variant font-medium">Ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold">
            <Chrome size={20} />
            Google
          </button>
          <button className="flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold">
            <Github size={20} />
            GitHub
          </button>
        </div>

        <p className="text-center text-on-surface-variant font-medium">
          Não tem uma conta?{' '}
          <button 
            onClick={onSignupClick}
            className="font-black text-primary hover:text-primary/80 transition-colors"
          >
            CADASTRE-SE
          </button>
        </p>
      </motion.div>
    </div>
  );
};
