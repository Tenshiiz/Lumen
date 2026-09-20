import { colord } from './setup'

// Espelham --tinta e --tinta-inversa de globals.css. Precisam existir aqui só
// para calcular contraste em JS; a interface continua lendo os tokens de CSS.
const TINTA = '#EDEFFB'
const TINTA_INVERSA = '#0F1230'

/**
 * Qual tinta lê melhor sobre um fundo: decide pela razão de contraste real,
 * e não por um limiar de luminosidade (que erra em amarelos e azuis saturados).
 */
export function tintaSobre(fundo: string): 'clara' | 'escura' {
  const cor = colord(fundo)
  return cor.contrast(TINTA) >= cor.contrast(TINTA_INVERSA) ? 'clara' : 'escura'
}
