'use client';

import { useState } from 'react';
import Link from 'next/link';
import supabase from "@/lib/supabase";
import { useRouter } from 'next/navigation';
import Modal from '../../componentes/Modal'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      
      setModal({
        isOpen: true,
        title: 'Erro no login',
        message: 'Email ou senha incorretos.',
        type: 'error'
      });
      console.log('Erro:', error.message);
    } else {
      
      setModal({
        isOpen: true,
        title: 'Login realizado',
        message: 'Bem-vindo de volta! Redirecionando...',
        type: 'success'
      });
      console.log('Usuário logado:', data);

      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }

    setIsLoading(false);
  };

  return (
    <div className="transform -translate-y-4 sm:-translate-y-9 bg-[#191c1f] border border-gray-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-gray-400 text-sm sm:text-base">Entre na sua conta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm sm:text-base"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm sm:text-base"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-sky-600 bg-[#090A0B] border-gray-700 rounded focus:ring-sky-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-400">Lembrar-me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors text-center sm:text-left"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="transition-all transform active:scale-98 cursor-pointer w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,189,248,0.3)] text-sm sm:text-base"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-gray-400 text-sm sm:text-base">
          Não tem uma conta?{' '}
          <Link
            href="/register"
            className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            Criar conta
          </Link>
        </p>
      </div>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}