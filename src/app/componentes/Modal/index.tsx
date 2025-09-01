'use client';

import React from 'react';
import { FiX, FiCheck, FiAlertTriangle, FiInfo } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  children?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, message, type, children }: ModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="text-green-500" size={48} />;
      case 'error':
        return <FiAlertTriangle className="text-red-500" size={48} />;
      case 'info':
        return <FiInfo className="text-blue-500" size={48} />;
      default:
        return <FiInfo className="text-blue-500" size={48} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'info':
        return 'border-blue-500';
      default:
        return 'border-blue-500';
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-[#191c1f] border-2 ${getBorderColor()} rounded-xl p-6 max-w-md w-full mx-4 relative shadow-2xl transform transition-all duration-500 ease-out ${isOpen ? 'scale-100 opacity-100 translate-y-0 animate-bounce-in' : 'scale-90 opacity-0 translate-y-4'}`}>
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-gray-400 hover:text-white transition-all duration-300 ease-out transform ${isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-45'}`}
          style={{ animationDelay: '0.8s' }}
        >
          <FiX size={24} />
        </button>

        {/* Ícone */}
        <div className="flex justify-center mb-4">
          <div className={`transform transition-all duration-700 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            {getIcon()}
          </div>
        </div>

        {/* Título */}
        <h2 className={`text-xl font-bold text-white text-center mb-3 transform transition-all duration-500 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {title}
        </h2>

        {/* Mensagem */}
        <p className={`text-gray-300 text-center mb-6 leading-relaxed transform transition-all duration-500 ease-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          {message}
        </p>

        {/* Conteúdo adicional (botões, etc.) */}
        {children && (
          <div className="flex justify-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}