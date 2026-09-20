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
 * Os três canvases da cidade e o motor que os desenha. Vive dentro do `.pano`
 * (que já traz o céu em CSS) e só monta depois do primeiro paint; ver
 * CenaCarregador. Cada mudança de nível destrói a instância anterior e cria
 * outra, para que nenhum backing store fique para trás.
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
        // só nesta sessão: a redução automática não é uma escolha salva
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

  // a chuva para enquanto a roda é arrastada: o gesto precisa de todo o quadro
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
