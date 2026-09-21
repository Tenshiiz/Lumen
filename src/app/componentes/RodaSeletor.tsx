'use client'

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { useColorStore } from '@/stores/useColorStore'
import { useCommitAdiado } from '@/hooks/useCommitAdiado'

/**
 * Roda cromática para seleção de matiz (ângulo polar) e saturação (distância radial).
 * Os valores de HSV são atualizados diretamente na store global sem perda de precisão.
 */
function RodaSeletor() {
  // Matiz normalizado em graus inteiros para exibição e controle por teclado
  const h = Math.round(useColorStore((estado) => estado.hsv.h)) % 360
  const sat = useColorStore((estado) => estado.hsv.s)
  const setHue = useColorStore((estado) => estado.setHue)
  const setHueSaturation = useColorStore((estado) => estado.setHueSaturation)
  const commitColor = useColorStore((estado) => estado.commitColor)

  const roda = useRef<HTMLDivElement>(null)
  const arrastando = useRef(false)
  const caixaRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number | null>(null)
  const coordsRef = useRef<{ clientX: number; clientY: number } | null>(null)

  // Agenda a confirmação no histórico após ajustes via teclado
  const { agendar } = useCommitAdiado(commitColor)

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  function calcularHueSat(clientX: number, clientY: number, caixa: DOMRect) {
    const raio = caixa.width / 2
    const x = clientX - caixa.left - raio
    const y = clientY - caixa.top - raio
    // Ângulo em graus no sentido horário
    const matiz = (Math.atan2(y, x) * 180) / Math.PI
    // Saturação normalizada até o raio máximo do disco (0 a 100%)
    const saturacao = Math.min(1, Math.hypot(x, y) / raio) * 100
    return { matiz, saturacao }
  }

  function aoPressionar(ev: PointerEvent<HTMLDivElement>) {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return
    ev.preventDefault()
    arrastando.current = true
    ev.currentTarget.setPointerCapture(ev.pointerId)
    ev.currentTarget.focus()

    if (roda.current) {
      const caixa = roda.current.getBoundingClientRect()
      caixaRef.current = caixa
      const { matiz, saturacao } = calcularHueSat(ev.clientX, ev.clientY, caixa)
      setHueSaturation(matiz, saturacao)
    }
  }

  function aoMover(ev: PointerEvent<HTMLDivElement>) {
    if (!arrastando.current) return
    coordsRef.current = { clientX: ev.clientX, clientY: ev.clientY }

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        if (!coordsRef.current) return
        const caixa = caixaRef.current ?? roda.current?.getBoundingClientRect() ?? null
        if (caixa) {
          const { matiz, saturacao } = calcularHueSat(coordsRef.current.clientX, coordsRef.current.clientY, caixa)
          setHueSaturation(matiz, saturacao)
        }
      })
    }
  }

  function aoSoltar() {
    if (!arrastando.current) return
    arrastando.current = false

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (coordsRef.current) {
      const caixa = caixaRef.current ?? roda.current?.getBoundingClientRect() ?? null
      if (caixa) {
        const { matiz, saturacao } = calcularHueSat(coordsRef.current.clientX, coordsRef.current.clientY, caixa)
        setHueSaturation(matiz, saturacao)
      }
      coordsRef.current = null
    }

    caixaRef.current = null
    commitColor()
  }

  function aoTeclar(ev: KeyboardEvent<HTMLDivElement>) {
    const passo = ev.shiftKey ? 10 : 1
    let novo: number
    switch (ev.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        novo = h + passo
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        novo = h - passo
        break
      case 'PageUp':
        novo = h + 30
        break
      case 'PageDown':
        novo = h - 30
        break
      case 'Home':
        novo = 0
        break
      case 'End':
        novo = 359
        break
      default:
        return
    }
    ev.preventDefault()
    setHue(novo)
    agendar()
  }

  // Coordenadas polares para posicionamento percentual do ponteiro no disco
  const rad = (h * Math.PI) / 180
  const distancia = (sat / 100) * 50

  return (
    <div
      ref={roda}
      className="disco-cor"
      data-roda
      role="slider"
      tabIndex={0}
      aria-label="Matiz"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={h}
      aria-valuetext={`${h} graus`}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onKeyDown={aoTeclar}
    >
      <span
        className="absolute w-[18px] h-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--tinta)] shadow-[0_0_0_2px_rgba(var(--escuro-rgb),0.85),0_3px_8px_rgba(var(--escuro-rgb),0.5)] pointer-events-none"
        aria-hidden="true"
        style={{
          left: `${50 + Math.cos(rad) * distancia}%`,
          top: `${50 + Math.sin(rad) * distancia}%`,
        }}
      />
    </div>
  )
}

export default RodaSeletor
