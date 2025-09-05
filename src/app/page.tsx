'use client';

import Header from './componentes/Header';
import Glow from './componentes/Glow';
import Image from 'next/image';
import SideLeftbar from './componentes/SideLeftbar';
import PickerColor from './componentes/PickerColor';
import SideRightbar from './componentes/SideRightbar';
import Modal from './componentes/Modal';
import { useEffect, useState } from 'react';
import supabase from "@/lib/supabase";
import type { User } from "@supabase/supabase-js"

export default function Home() {

  const [color, setColor] = useState('#FFFFFF')
  const [colors, setColors] = useState(Array(8).fill("#191c1f"));
  const [committedColor, setCommittedColor] = useState('#FFFFFF')

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConstructionModalOpen, setIsConstructionModalOpen] = useState(true);

  useEffect(() => {
    async function verificarLogin() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        console.log("✅ LOGADO! Email:", session.user.email);
      } else {
        setUser(null);
        console.log("❌ NÃO LOGADO!");
      }

      setLoading(false);
    }

    verificarLogin();
  }, []);


  useEffect(() => {
    setColors(prev => [committedColor, ...prev.filter(c => c !== committedColor)].slice(0, 8));
  }, [committedColor]);

  const mudarCor = (novaCor: string) => {
    setColor(novaCor);
    setCommittedColor(novaCor);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white text-xl">
          Verificando login... ⏳
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user}/>
      <main className='relative flex flex-col flex-grow overflow-x-hidden'>
        <Glow />
        <section className=' relative flex h-screen sm:min-h-screen justify-center items-center px-4 py-10 sm:py-20'>
          <div className='flex z-10 flex-col text-center items-center max-w-4xl mx-auto'>
            <Image
              src="/logoSemNome.svg"
              alt="Logo do Projeto Lumen"
              width={140}
              height={130}
              className="mb-4"
              style={{ height: 'auto' }}
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-3 font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-violet-600 bg-clip-text text-transparent">
              Lumen
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              O novo jeito de explorar cores — preciso, elegante e feito para fluxos modernos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none">
              <a
                href="#demo"
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-7 py-3 font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400/60 text-center"
              >
                🎨 Experimente Agora
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto rounded-2xl border border-white/15 bg-white/5 px-7 py-3 font-medium text-zinc-200 backdrop-blur-md transition hover:bg-white/10 text-center"
              >
                Saiba Mais
              </a>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 text-xs text-zinc-500 text-center">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400/80" />
              <span className="max-w-xs sm:max-w-none">
                Roda 100% no navegador · Zero dependências pesadas · Copia HEX/RGB com 1 clique
              </span>
            </div>
          </div>
        </section>
        <section id="PickerColor" className='bg-[#090A0B]/10 backdrop-blur-xs flex flex-col lg:flex-row gap-2 sm:gap-4 p-2 sm:p-4'>
          <div className="w-full lg:w-auto lg:flex-shrink-0 order-2 lg:order-1">
            <SideLeftbar onColorSelect={mudarCor} colors={colors} />
          </div>
          <div className="flex-1 flex justify-center order-1 lg:order-2 py-4 lg:py-0">
            <PickerColor cor={color} setarCor={setColor} setValor={setCommittedColor} />
          </div>
          <div className="w-full lg:w-auto lg:flex-shrink-0 order-3">
            <SideRightbar />
          </div>
        </section>
      </main>
      {isConstructionModalOpen && (
        <Modal
          isOpen={isConstructionModalOpen}
          onClose={() => setIsConstructionModalOpen(false)}
          title="Aviso"
          message="Projeto ainda em construção"
          type="info"
        />
      )}
    </div>
  );
}
