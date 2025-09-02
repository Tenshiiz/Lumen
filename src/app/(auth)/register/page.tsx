'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiLoader } from 'react-icons/fi';
import supabase from "@/lib/supabase"
import Modal from '../../componentes/Modal';


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar se senhas são iguais
    if (formData.password !== formData.confirmPassword) {
      setModal({
        isOpen: true,
        title: 'Erro',
        message: 'As senhas não coincidem. Verifique e tente novamente.',
        type: 'error'
      });
      setIsLoading(false);
      return;
    }

    // Chamar Supabase para registrar
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name  // Salva o nome nos metadados
        },
        emailRedirectTo: undefined  // Desabilita redirecionamento de e-mail
      }
    });

    if (error) {
      // Verificar se é erro de e-mail já existente
      if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
        setModal({
          isOpen: true,
          title: 'E-mail já cadastrado',
          message: `O e-mail ${formData.email} já está cadastrado no sistema.`,
          type: 'error'
        });
      } else {
        setModal({
          isOpen: true,
          title: 'Erro ao criar conta',
          message: error.message,
          type: 'error'
        });
      }
    } else {
      setModal({
        isOpen: true,
        title: 'Conta criada',
        message: 'Sua conta foi criada com sucesso! Você já pode fazer login.',
        type: 'success'
      });

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="transform -translate-y-6 sm:-translate-y-10 bg-[#191c1f] border border-gray-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Criar conta</h1>
        <p className="text-gray-400 text-sm sm:text-base">Junte-se ao Lumen e explore cores incríveis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm sm:text-base"
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm sm:text-base"
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
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#090A0B] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors text-sm sm:text-base"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-start sm:items-center">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 text-sky-600 bg-[#090A0B] border-gray-700 rounded focus:ring-sky-500 focus:ring-2 mt-0.5 sm:mt-0"
          />
          <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-400 leading-relaxed">
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
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer transform active:scale-98 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {isLoading && <FiLoader className="animate-spin" size={16} />}
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-gray-400 text-sm sm:text-base">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
          >
            Fazer login
          </Link>
        </p>
      </div>

      {/* Modal de Feedback */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      >
        {modal.type === 'error' && modal.title === 'E-mail já cadastrado' && (
          <div className="flex gap-3 mt-4">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Fazer Login
            </Link>
            <Link
              href="/forgot-password"
              className="text-blue-400 flex items-center hover:text-blue-300 text-sm underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}