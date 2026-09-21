'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useToast } from '@/context/ToastContext'
import { criarCena, type Cena } from './motor'
import {
  assinarQualidade,
  definirQualidadeGlobal,
  qualidadeAtual,
  qualidadeServidor,
  type Qualidade,
} from './qualidade'

const MAIS_LEVE: Partial<Record<Qualidade, Qualidade>> = { alta: 'media', media: 'baixa' }

/**
 * Gerencia a renderização dos canvases da cena de fundo e responde a mudanças de qualidade.
 */
export default function CenaCanvas() {
  const qualidade = useSyncExternalStore(assinarQualidade, qualidadeAtual, qualidadeServidor)
  const { showToast } = useToast()
  const avisar = useRef(showToast)
  avisar.current = showToast

  const raiz = useRef<HTMLDivElement>(null)
  const cCena = useRef<HTMLCanvasElement>(null)
  const cVidro = useRef<HTMLCanvasElement>(null)
  const cMov = useRef<HTMLCanvasElement>(null)
  const cena = useRef<Cena | null>(null)

  useEffect(() => {
    if (!cCena.current || !cVidro.current) return
    const pano = raiz.current?.parentElement ?? null
    const instancia = criarCena({
      cena: cCena.current,
      vidro: cVidro.current,
      movimento: cMov.current,
      qualidade,
      aoPronto: () => pano?.setAttribute('data-pronto', 'true'),
      aoDegradar: () => {
        const proximo = MAIS_LEVE[qualidade]
        if (!proximo) return
        // Degradação automática restrita à sessão atual para preservar taxa de quadros
        definirQualidadeGlobal(proximo, { persistir: false })
        avisar.current('Cena reduzida para manter a fluidez.', 'info')
      },
    })
    cena.current = instancia
    return () => {
      instancia.destruir()
      if (cena.current === instancia) cena.current = null
      pano?.removeAttribute('data-pronto')
    }
  }, [qualidade])

  // Pausa animações durante a manipulação da roda para poupar processamento
  useEffect(() => {
    let arrastando = false
    const aoPressionar = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-roda]')) {
        arrastando = true
        cena.current?.pausar()
      }
    }
    const aoSoltar = () => {
      if (!arrastando) return
      arrastando = false
      cena.current?.retomar()
    }
    document.addEventListener('pointerdown', aoPressionar, true)
    document.addEventListener('pointerup', aoSoltar, true)
    document.addEventListener('pointercancel', aoSoltar, true)
    return () => {
      document.removeEventListener('pointerdown', aoPressionar, true)
      document.removeEventListener('pointerup', aoSoltar, true)
      document.removeEventListener('pointercancel', aoSoltar, true)
      if (arrastando) cena.current?.retomar()
    }
  }, [])

  return (
    <div ref={raiz} className="absolute -left-8 -top-8" aria-hidden="true">
      <canvas ref={cCena} className="absolute left-0 top-0 block [filter:blur(2.4px)_saturate(1.14)]" />
      <canvas ref={cVidro} className="absolute left-0 top-0 block" />
      <canvas ref={cMov} className="absolute left-0 top-0 block" />
    </div>
  )
}
