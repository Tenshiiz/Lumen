'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { tintaSobre } from '@/lib/color/tinta'
import { IconeFechar } from './Icones'

interface Props {
  /** HEX maiúsculo, sem repetidos: o HEX é a chave de cada amostra. */
  cores: string[]
  /** Nome da fita para leitores de tela ("Cores recentes"). */
  rotulo: string
  /** Enter, Espaço ou clique numa amostra. Receber foco nunca chama isto. */
  aoAplicar: (hex: string) => void
  /** Se existir, cada amostra ganha um botão de remover (e Delete/Backspace no teclado). */
  aoRemover?: (hex: string, indice: number) => void
  /** HEX da cor ativa: marca a amostra correspondente. */
  atual?: string
}

/**
 * Fita contínua de amostras com uma única parada de Tab (roving tabindex):
 * setas, Home e End movem o foco; Enter, Espaço e clique aplicam. Mover o foco
 * não muda a cor ativa; só a confirmação muda.
 */
export default function FitaDeCores({ cores, rotulo, aoAplicar, aoRemover, atual }: Props) {
  // O foco de repouso é guardado por HEX, não por posição: aplicar uma cor a
  // faz subir para o começo da fita, e o foco precisa acompanhá-la.
  const [focoHex, setFocoHex] = useState<string | null>(null)
  const botoes = useRef(new Map<string, HTMLButtonElement>())
  const refocar = useRef<string | null>(null)

  const alvo = focoHex !== null && cores.includes(focoHex) ? focoHex : (cores[0] ?? null)

  // Se a reordenação soltou o foco (nó movido no DOM), devolve-o à mesma amostra
  useEffect(() => {
    const hex = refocar.current
    if (hex === null) return
    refocar.current = null
    if (document.activeElement === document.body) botoes.current.get(hex)?.focus()
  }, [cores])

  function mover(indice: number) {
    const hex = cores[indice]
    if (hex === undefined) return
    setFocoHex(hex)
    botoes.current.get(hex)?.focus()
  }

  function remover(indice: number) {
    if (!aoRemover) return
    // o foco segue para a vizinha, senão cairia no <body>
    const vizinha = cores[indice + 1] ?? cores[indice - 1]
    if (vizinha !== undefined) {
      setFocoHex(vizinha)
      refocar.current = vizinha
    }
    aoRemover(cores[indice], indice)
  }

  function aoTeclar(ev: KeyboardEvent<HTMLButtonElement>, indice: number) {
    const ultimo = cores.length - 1
    switch (ev.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        ev.preventDefault()
        mover(indice >= ultimo ? 0 : indice + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        ev.preventDefault()
        mover(indice <= 0 ? ultimo : indice - 1)
        break
      case 'Home':
        ev.preventDefault()
        mover(0)
        break
      case 'End':
        ev.preventDefault()
        mover(ultimo)
        break
      case 'Delete':
      case 'Backspace':
        if (aoRemover) {
          ev.preventDefault()
          remover(indice)
        }
        break
    }
  }

  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-px rounded-2xl overflow-hidden bg-[rgba(var(--escuro-rgb),0.6)] shadow-[0_0_0_1px_rgba(var(--tinta-rgb),0.07),0_14px_26px_-16px_rgba(var(--escuro-rgb),0.9)]"
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={rotulo}
    >
      {cores.map((hex, i) => {
        const estilo = { backgroundColor: hex } as CSSProperties
        return (
          <div
            className="relative min-h-[60px] group/celula [--tinta-local:var(--tinta)] data-[tinta=escura]:[--tinta-local:var(--tinta-inversa)] before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-b before:from-[rgba(var(--claro-rgb),0.16)] before:via-transparent before:via-46% before:to-[rgba(var(--escuro-rgb),0.16)]"
            key={hex}
            data-tinta={tintaSobre(hex)}
            style={estilo}
          >
            <button
              type="button"
              className="absolute inset-0 flex items-end justify-center px-[2px] pb-[7px] border-0 bg-transparent cursor-pointer text-(--tinta-local) transition-transform duration-[0.28s] ease-[var(--ease)] active:scale-96 focus-visible:outline-2 focus-visible:outline-(--tinta-local) focus-visible:-outline-offset-5 focus-visible:shadow-none aria-[current=true]:after:content-[''] aria-[current=true]:after:absolute aria-[current=true]:after:top-[9px] aria-[current=true]:after:left-1/2 aria-[current=true]:after:w-[14px] aria-[current=true]:after:h-[3px] aria-[current=true]:after:-ml-[7px] aria-[current=true]:after:rounded-[2px] aria-[current=true]:after:bg-(--tinta-local)"
              ref={(no) => {
                if (no) botoes.current.set(hex, no)
                else botoes.current.delete(hex)
              }}
              tabIndex={hex === alvo ? 0 : -1}
              aria-label={hex}
              aria-current={atual === hex ? 'true' : undefined}
              aria-keyshortcuts={aoRemover ? 'Delete' : undefined}
              onFocus={() => setFocoHex(hex)}
              onKeyDown={(ev) => aoTeclar(ev, i)}
              onClick={() => {
                refocar.current = hex
                aoAplicar(hex)
              }}
            >
              <span
                className="font-mono text-xs leading-tight tracking-[0.02em] opacity-0 translate-y-[3px] transition-[opacity,transform] duration-[0.28s] ease-[var(--ease)] group-hover/celula:opacity-100 group-hover/celula:translate-y-0 group-focus-within/celula:opacity-100 group-focus-within/celula:translate-y-0 [@media(hover:none)]:opacity-90 [@media(hover:none)]:translate-y-0"
                aria-hidden="true"
              >
                {hex}
              </span>
            </button>
            {aoRemover && (
              <button
                type="button"
                className="absolute top-1 right-1 z-[2] grid place-items-center w-6 h-6 border-0 rounded-lg cursor-pointer text-(--tinta-local) bg-transparent opacity-0 transition-[opacity,background-color] duration-[0.28s] ease-[var(--ease)] group-hover/celula:opacity-100 group-focus-within/celula:opacity-100 hover:bg-[rgba(var(--escuro-rgb),0.28)] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-(--tinta-local) focus-visible:-outline-offset-2 focus-visible:shadow-none [@media(hover:none)]:opacity-85"
                tabIndex={-1}
                aria-label={`Remover ${hex}`}
                onClick={() => remover(i)}
              >
                <IconeFechar />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
