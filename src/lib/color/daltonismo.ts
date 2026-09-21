import { colord } from './setup'

export type TipoVisao = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'acromatopsia'

type Matriz = readonly [number, number, number, number, number, number, number, number, number]

/**
 * Matrizes de transformação 3×3 em RGB linear para simulação de dicromacia completa.
 * Baseado no modelo fisiológico de Machado, Oliveira e Fernandes (2009).
 */
const MATRIZES: Record<Exclude<TipoVisao, 'acromatopsia'>, Matriz> = {
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
}

const paraLinear = (v: number) => {
  const c = v / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

const paraSrgb = (linear: number) => {
  const c = Math.min(1, Math.max(0, linear))
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
  return Math.round(v * 255)
}

/**
 * Simula a percepção da cor informada para cada deficiência visual cromática.
 * Retorna o valor original em formato hexadecimal maiúsculo quando tipo é null.
 */
export function simular(hex: string, tipo: TipoVisao | null): string {
  const { r, g, b } = colord(hex).toRgb()
  if (!tipo) return colord({ r, g, b }).toHex().toUpperCase()

  const lin = [paraLinear(r), paraLinear(g), paraLinear(b)]
  let saida: number[]
  if (tipo === 'acromatopsia') {
    const y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
    saida = [y, y, y]
  } else {
    const m = MATRIZES[tipo]
    saida = [0, 1, 2].map((i) => m[i * 3] * lin[0] + m[i * 3 + 1] * lin[1] + m[i * 3 + 2] * lin[2])
  }
  const [sr, sg, sb] = saida.map(paraSrgb)
  return colord({ r: sr, g: sg, b: sb }).toHex().toUpperCase()
}

export interface InfoVisao {
  tipo: TipoVisao | null
  nome: string
  prevalencia: string
}

export const VISOES: InfoVisao[] = [
  { tipo: null, nome: 'Visão típica', prevalencia: 'Referência' },
  { tipo: 'protanopia', nome: 'Protanopia', prevalencia: '≈ 1% dos homens' },
  { tipo: 'deuteranopia', nome: 'Deuteranopia', prevalencia: '≈ 1% dos homens' },
  { tipo: 'tritanopia', nome: 'Tritanopia', prevalencia: '≈ 0,01% da população' },
  { tipo: 'acromatopsia', nome: 'Acromatopsia', prevalencia: '≈ 0,003% da população' },
]
