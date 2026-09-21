'use client'

import { useId, useRef, useState, type ComponentType, type KeyboardEvent } from 'react'
import PainelHarmonias from './PainelHarmonias'
import PainelContraste from './PainelContraste'
import PainelDaltonismo from './PainelDaltonismo'

interface DefinicaoAba {
  chave: string
  rotulo: string
  componente: ComponentType
}

// Configuração das abas disponíveis na seção de análise
const ABAS: DefinicaoAba[] = [
  { chave: 'harmonias', rotulo: 'Harmonias', componente: PainelHarmonias },
  { chave: 'contraste', rotulo: 'Contraste', componente: PainelContraste },
  { chave: 'daltonismo', rotulo: 'Daltonismo', componente: PainelDaltonismo },
]

export default function SecaoAnalise() {
  const base = useId()
  const [ativa, setAtiva] = useState(0)
  const botoes = useRef<(HTMLButtonElement | null)[]>([])

  const idAba = (chave: string) => `${base}-aba-${chave}`
  const idPainel = (chave: string) => `${base}-painel-${chave}`

  function ir(indice: number) {
    setAtiva(indice)
    botoes.current[indice]?.focus()
  }

  function aoTeclar(ev: KeyboardEvent<HTMLButtonElement>, indice: number) {
    const ultimo = ABAS.length - 1
    let alvo: number
    switch (ev.key) {
      case 'ArrowRight':
        alvo = indice === ultimo ? 0 : indice + 1
        break
      case 'ArrowLeft':
        alvo = indice === 0 ? ultimo : indice - 1
        break
      case 'Home':
        alvo = 0
        break
      case 'End':
        alvo = ultimo
        break
      default:
        return
    }
    ev.preventDefault()
    ir(alvo)
  }

  return (
    <section id="analise" className="py-[clamp(34px,6vh,70px)] pb-[clamp(60px,10vh,110px)]" aria-labelledby={`${base}-titulo`}>
      <div className="w-full max-w-[1280px] mx-auto px-[clamp(20px,5vw,64px)]">
        <header className="mb-6">
          <h2 id={`${base}-titulo`} className="text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.025em] [text-shadow:0_2px_30px_rgba(var(--escuro-rgb),0.6)]">
            Análise da cor
          </h2>
          <p className="mt-2 max-w-[58ch] text-tinta-media [text-shadow:0_1px_20px_rgba(var(--escuro-rgb),0.7)]">
            Harmonias, contraste de leitura e simulação de daltonismo para a cor selecionada.
          </p>
        </header>

        <div className="flex flex-nowrap gap-1.5 -mx-[clamp(20px,5vw,64px)] px-[clamp(20px,5vw,64px)] pt-1.5 pb-3 mb-2.5 overflow-x-auto [scroll-snap-type:x_proximity] [scroll-padding-inline:clamp(20px,5vw,64px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Tipos de análise">
          {ABAS.map((aba, i) => (
            <button
              key={aba.chave}
              ref={(el) => {
                botoes.current[i] = el
              }}
              type="button"
              role="tab"
              id={idAba(aba.chave)}
              className="pilula shrink-0 whitespace-nowrap snap-start"
              aria-selected={ativa === i}
              aria-controls={idPainel(aba.chave)}
              tabIndex={ativa === i ? 0 : -1}
              onClick={() => setAtiva(i)}
              onKeyDown={(ev) => aoTeclar(ev, i)}
            >
              {aba.rotulo}
            </button>
          ))}
        </div>

        {ABAS.map((aba, i) => {
          const Painel = aba.componente
          return (
            <div
              key={aba.chave}
              role="tabpanel"
              id={idPainel(aba.chave)}
              aria-labelledby={idAba(aba.chave)}
              tabIndex={0}
              hidden={ativa !== i}
              className="lamina p-[clamp(22px,3vw,34px)] [&[hidden]]:hidden focus-visible:outline-2 focus-visible:outline-(--luz-quente) focus-visible:outline-offset-4"
            >
              <Painel />
            </div>
          )
        })}
      </div>
    </section>
  )
}
