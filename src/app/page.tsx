'use client';

import Header from './componentes/Header';
import Glow from './componentes/Glow';
import Image from 'next/image';
import SideLeftbar from './componentes/SideLeftbar';
import PickerColor from './componentes/PickerColor';
import SideRightbar from './componentes/SideRightbar';
import { useEffect, useState } from 'react';

export default function Home() {

  const [color, setColor] = useState('#FFFFFF')
  const [colors, setColors] = useState(Array(8).fill("#191c1f"));
  const [committedColor, setCommittedColor] = useState('#FFFFFF')

  useEffect(() => {
    setColors(prev => [committedColor, ...prev.filter(c => c !== committedColor)].slice(0, 8));
  }, [committedColor]);

  const mudarCor = (novaCor: string) => {
    setColor(novaCor);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className='relative flex flex-col flex-grow'>
        <Glow />
        <section className='relative flex h-screen justify-center items-center'>
          <div className='flex z-10 flex-col text-center items-center mt-10'>
            <Image src="/logoSemNome.svg" alt="Logo do Projeto Lumen" width={140} height={130} />
            <h1 className="text-6xl mb-3 font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-violet-600 bg-clip-text text-transparent inline-block">
              Lumen
            </h1>
            <p>
              O novo jeito de explorar cores — preciso, elegante e feito para fluxos modernos.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#demo"
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-7 py-3 font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              >
                🎨 Experimente Agora
              </a>
              <a
                href="#features"
                className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3 font-medium text-zinc-200 backdrop-blur-md transition hover:bg-white/10"
              >
                Saiba Mais
              </a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400/80" />
              <span>Roda 100% no navegador · Zero dependências pesadas · Copia HEX/RGB com 1 clique</span>
            </div>
          </div>
        </section>
<<<<<<< HEAD
        <section id="PickerColor" className='bg-[#090A0B]/10 backdrop-blur-xs flex gap-4'>
=======
        <section className='bg-[#090A0B]/10 backdrop-blur-xs flex gap-4'>
>>>>>>> 6e5cdabad9d1d6b49abf0ebe207101a21e42c1fd
          <SideLeftbar onColorSelect={mudarCor} colors={colors} />
          <PickerColor cor={color} setarCor={setColor} setValor={setCommittedColor} />
          <SideRightbar />
        </section>
      </main>
    </div>
  );
}
