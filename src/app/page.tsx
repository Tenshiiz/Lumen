import Cena from './componentes/Cena'
import CamadaCor from './componentes/CamadaCor'
import BarraAtiva from './componentes/BarraAtiva'
import Topo from './componentes/Topo'
import Seletor from './componentes/Seletor'
import SecaoColecao from './componentes/SecaoColecao'
import SecaoAnalise from './componentes/SecaoAnalise'
import SecaoExportar from './componentes/SecaoExportar'

export default function Home() {
  return (
    <>
      <Cena />

      <CamadaCor>
        <BarraAtiva />

        <section id="inicio" className="flex flex-col min-h-[100svh]">
          <Topo />

          <h1 className="sr-only">Lumen — ferramenta de cores</h1>

          <Seletor />
        </section>

        <SecaoColecao />
        <SecaoAnalise />
        <SecaoExportar />

        <footer className="relative py-[30px] pb-[44px] before:content-[''] before:absolute before:top-0 before:left-[8%] before:right-[8%] before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(var(--tinta-rgb),0.16),transparent)]">
          <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,64px)] flex items-center justify-between gap-x-[28px] gap-y-[18px] flex-wrap">
            <p className="text-[14px] text-[var(--tinta-fraca)]">Lumen · Ferramenta de cores</p>
          </div>
        </footer>
      </CamadaCor>
    </>
  )
}
