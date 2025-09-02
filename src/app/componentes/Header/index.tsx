'use client'

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const listaNav = [
    { item: "Seletor De Cor", href: "#PickerColor" },
    { item: "Paletas", href: "#Palettes" },
    { item: "Gradiente", href: "#Gradient" },
    { item: "Acessibilidade", href: "#Accessibility" },
    { item: "Ferramentas", href: "#Tools" },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    console.log("Tema alterado para:", isDarkMode ? "Claro" : "Escuro");
  };

  useEffect(() => {
    if (isMobileNavOpen) {
      // Bloqueia o scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restaura o scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup: sempre restaura o scroll quando o componente desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

      {/* OVERLAY COM FUNDO SÓLIDO - Sem backdrop-blur */}
      <div
        onClick={() => setIsMobileNavOpen(false)}
        className={`
          mt-20 z-10 fixed inset-0 min-h-screen
          bg-black/75
          ${isMobileNavOpen
            ? 'transition-opacity duration-300 opacity-100 pointer-events-auto'
            : 'transition-opacity duration-300 opacity-0 pointer-events-none'
          }
        `}
      >
      </div>

      <nav className={`
        text-sky-50 z-50 
        bg-gradient-to-br from-[#1a1f25] via-[#1e242a] to-[#191e23]
        border border-gray-700/50 backdrop-blur-sm shadow-2xl
        w-screen -translate-x-[13px] -translate-y-2 top-full py-10 px-6 rounded-2xl absolute
        md:static md:h-auto md:translate-x-0 md:w-auto md:translate-y-0 md:py-0 
        md:bg-gradient-to-r md:from-transparent md:via-gray-800/10 md:to-transparent
        md:border-gray-600/30 md:shadow-lg md:backdrop-blur-none md:px-4 md:rounded-xl
        ${isMobileNavOpen
          ? 'transition-all duration-500 ease-out opacity-100 scale-100 pointer-events-auto'
          : 'transition-all duration-400 ease-in opacity-0 scale-95 pointer-events-none md:opacity-100 md:scale-100 md:pointer-events-auto'
        }
      `}>
        <ul className='text-center flex-col flex md:flex-row justify-center items-center gap-6 md:gap-8'>
          {listaNav.map((item, index) => (
            <li key={index} className="group w-full md:w-auto">
              <a
                onClick={() => setIsMobileNavOpen(false)}
                href={item.href}
                className="
                  block px-6 py-4 rounded-xl font-medium text-base
                  bg-gradient-to-r from-transparent via-gray-800/20 to-transparent
                  border border-transparent
                  hover:from-blue-600/10 hover:via-blue-500/20 hover:to-blue-600/10
                  hover:border-blue-500/30 hover:text-blue-300
                  hover:shadow-lg hover:shadow-blue-500/10
                  hover:scale-105
                  active:scale-100
                  transition-all duration-300 ease-out
                  md:bg-transparent md:border-transparent
                  md:hover:bg-white/5 md:hover:border-white/10
                  md:py-2 md:px-4
                  relative overflow-hidden
                "
              >
                {/* Efeito de brilho sutil */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               bg-gradient-to-r from-transparent via-white/5 to-transparent"></span>

                {/* Texto */}
                <span className="relative z-10">{item.item}</span>

                {/* Indicador de foco mobile */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full
                               opacity-0 group-hover:opacity-100 transition-all duration-300
                               md:hidden"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Decoração extra para mobile */}
        <div className="mt-8 pt-6 border-t border-gray-700/30 md:hidden">
          <div className="flex justify-center items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Menu de Navegação</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </nav>

      <div className="flex items-center md:gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="md:hidden cursor-pointer flex justify-center p-3 items-center rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors"
        >
          <HiMenu size={24} className="text-sky-50" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="hidden cursor-pointer md:flex justify-center p-3 items-center rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <FaUserCircle size={24} className="text-sky-50" />
          </button>

          <div className={`
            absolute right-0 mt-2 w-30 text-center bg-[#191c1f] border border-gray-700 rounded-lg shadow-lg z-50 
            transition-all duration-500 ease-in-out 
            ${isDropdownOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
            }
          `}>
            <div className="py-1">
              <a
                href="login"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Entrar
              </a>
              <a
                href="register"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Registrar
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className=' relative cursor-pointer flex justify-center p-5.5 items-center rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors'
        >
          <div className={` absolute transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <BsMoon size={20} className="text-indigo-100" />
          </div>
          <div className={` absolute transition-opacity duration-300 ${isDarkMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <BsSun size={20} className="text-yellow-400" />
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;