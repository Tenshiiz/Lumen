'use client'

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
      
      <nav className='flex text-sky-50'>
        <ul className='flex justify-center gap-x-4'>
          {listaNav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="hover:text-blue-400 transition-colors duration-200">
                {item.item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="cursor-pointer flex justify-center p-3 items-center rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <FaUserCircle size={20} className="text-sky-50" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-30 text-center bg-[#191c1f] border border-gray-700 rounded-lg shadow-lg z-50">
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
          )}
        </div>

        <button
          onClick={toggleTheme}
          className='p-4 relative cursor-pointer flex justify-center p-3 items-center rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors'
        >
          <div className={`ml-0.5 absolute transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <BsMoon size={18} className="text-indigo-100"/>
          </div>
          <div className={`absolute transition-opacity duration-300 ${isDarkMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <BsSun size={18} className="text-yellow-400"/>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;