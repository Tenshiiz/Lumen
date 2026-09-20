import { colord } from './setup'
import type { HslColor } from 'colord'

// As harmonias por matiz giram o matiz e mantêm saturação e luminosidade; a
// monocromática só varia a luminosidade.

export type TipoAcorde = 'analoga' | 'complementar' | 'dividida' | 'triade' | 'mono'

export interface DefinicaoAcorde {
  tipo: TipoAcorde
  rotulo: string
  /** graus de matiz (modo 'h') ou pontos de luminosidade (modo 'l') */
  passos: number[]
  modo: 'h' | 'l'
  descricao: string
}

export const ACORDES: DefinicaoAcorde[] = [
  {
    tipo: 'analoga',
    rotulo: 'Análoga',
    passos: [-30, -15, 0, 15, 30],
    modo: 'h',
    descricao:
      'Cores vizinhas na roda. A transição é suave e de baixo contraste, adequada para fundos e áreas de leitura.',
  },
  {
    tipo: 'complementar',
    rotulo: 'Complementar',
    passos: [0, 180],
    modo: 'h',
    descricao:
      'Cores opostas na roda. Oferecem contraste máximo: use uma como base e a outra apenas como destaque.',
  },
  {
    tipo: 'dividida',
    rotulo: 'Complementar dividida',
    passos: [0, 150, 210],
    modo: 'h',
    descricao:
      'A cor base com as duas vizinhas da sua oposta. Mantém o contraste da complementar com menos tensão.',
  },
  {
    tipo: 'triade',
    rotulo: 'Tríade',
    passos: [0, 120, 240],
    modo: 'h',
    descricao:
      'Três cores equidistantes na roda. A combinação é vibrante e pede uma cor dominante clara.',
  },
  {
    tipo: 'mono',
    rotulo: 'Monocromática',
    passos: [-28, -14, 0, 14, 28],
    modo: 'l',
    descricao:
      'Variações de luminosidade de um único matiz. O resultado é coeso e seguro.',
  },
]

const LUMINOSIDADE_MIN = 6
const LUMINOSIDADE_MAX = 94

/**
 * Cores de uma harmonia como HEX maiúsculo. Se `hexBase` for informado, o passo
 * 0 das harmonias por matiz devolve exatamente ele (o HSL arredondado não
 * reproduz o HEX ativo bit a bit).
 */
export function gerarAcorde(hsl: HslColor, tipo: TipoAcorde, hexBase?: string): string[] {
  const def = ACORDES.find((a) => a.tipo === tipo)
  if (!def) return []
  return def.passos.map((passo) => {
    if (def.modo === 'h') {
      if (passo === 0 && hexBase) return hexBase.toUpperCase()
      const h = (((hsl.h + passo) % 360) + 360) % 360
      return colord({ h, s: hsl.s, l: hsl.l }).toHex().toUpperCase()
    }
    const l = Math.min(LUMINOSIDADE_MAX, Math.max(LUMINOSIDADE_MIN, hsl.l + passo))
    return colord({ h: hsl.h, s: hsl.s, l }).toHex().toUpperCase()
  })
}
