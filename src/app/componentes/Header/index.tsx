'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Tema alterado para:", isDarkMode ? "Claro" : "Escuro");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      fixed flex w-full z-50 
      justify-between items-center py-6 px-3 
      border-b border-l border-r border-gray-800 
      transition-all duration-300
      ${isScrolled 
        ? 'backdrop-blur-md bg-[#090A0B]/20' // Fundo semi-transparente + blur
        : 'bg-[#090A0B]/50' // Fundo sólido sem scroll
      }
    `}>
      <Image
        src="/logo.svg"
        alt="Logo da Aplicação"
        width={150}
        height={150}
      />
      
      <nav className='flex text-sky-50'>
        <ul className='flex justify-center gap-x-4'>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Seletor De Cor
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Paletas
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Gradiente
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Acessibilidade
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors duration-200">
              Ferramentas
            </a>
          </li>
        </ul>
      </nav>

      <button 
        onClick={toggleTheme} 
        className='relative cursor-pointer flex justify-center ml-15 p-5 items-center rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors'
      >
        <div className={`absolute transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <BsMoon size={18} className="text-white"/>
        </div>
        <div className={`absolute transition-opacity duration-300 ${isDarkMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <BsSun size={18} className="text-yellow-400"/>
        </div>
      </button>
    </header>
  );
}

export default Header;