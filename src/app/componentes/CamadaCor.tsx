'use client'

import type { CSSProperties, ReactNode } from 'react'
import { colord } from '@/lib/color'
import { useColorStore } from '@/stores/useColorStore'

/**
 * Injeta variáveis CSS da cor ativa (--cor-atual, --escurecer, --trilho-saturacao, --trilho-brilho)
 * no escopo dos componentes filhos, centralizando as atualizações visuais.
 */
export default function CamadaCor({ children }: { children: ReactNode }) {
  const hsv = useColorStore((estado) => estado.hsv)

  // Gradientes de saturação e brilho derivados dos valores HSV atuais
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
