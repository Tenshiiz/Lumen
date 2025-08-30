'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de registro (substitua por sua lógica real)
    setTimeout(() => {
      console.log('Register attempt:', formData);
      setIsLoading(false);
      // Aqui você implementaria a lógica de registro
    }, 1000);
  };

  return (
    <div className="transform -translate-y-10 bg-[#191c1f] border border-gray-800 rounded-xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Criar conta</h1>
        <p className="text-gray-400">Junte-se ao Lumen e explore cores incríveis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nome completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirmar senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 text-sky-600 bg-[#090A0B] border-gray-700 rounded focus:ring-sky-500 focus:ring-2"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
            Concordo com os{' '}
            <Link href="/terms" className="text-sky-400 hover:text-sky-300 transition-colors">
              Termos de Uso
            </Link>
            {' '}e{' '}
            <Link href="/privacy" className="text-sky-400 hover:text-sky-300 transition-colors">
              Política de Privacidade
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,189,248,0.3)]"
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}