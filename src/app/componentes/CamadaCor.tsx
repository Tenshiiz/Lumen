'use client'

import type { CSSProperties, ReactNode } from 'react'
import { colord } from '@/lib/color'
import { useColorStore } from '@/stores/useColorStore'

/**
 * Traduz a cor ativa em variáveis CSS num único elemento. Roda, faders e
 * amostras só leem `var(...)`: quando a cor muda, o React re-renderiza esta
 * camada e mais nada. Vive num elemento do React, não no <html>, para não
 * depender de efeito nem de limpeza.
 *
 *   --cor-atual          HEX da cor
 *   --escurecer          opacidade do véu escuro sobre o disco (1 - brilho)
 *   --trilho-saturacao   calha do fader de saturação (branco → cor, no brilho atual)
 *   --trilho-brilho      calha do fader de brilho (preto → cor plena)
 */
export default function CamadaCor({ children }: { children: ReactNode }) {
  const hsv = useColorStore((estado) => estado.hsv)

  // As pontas das calhas são a própria escala de cor (conteúdo do produto):
  // preto no brilho 0 e branco na saturação 0 são a matemática, não o cromo.
  const hex = (h: number, s: number, v: number) => colord({ h, s, v }).toHex()

  const estilo = {
    '--cor-atual': hex(hsv.h, hsv.s, hsv.v),
    '--escurecer': (1 - hsv.v / 100).toFixed(3),
    '--trilho-saturacao': `linear-gradient(90deg, ${hex(hsv.h, 0, hsv.v)}, ${hex(hsv.h, 100, hsv.v)})`,
    '--trilho-brilho': `linear-gradient(90deg, ${hex(hsv.h, hsv.s, 0)}, ${hex(hsv.h, hsv.s, 100)})`,
  } as CSSProperties

  return (
    <div style={estilo} className="relative z-10">
      {children}
    </div>
  )
}
