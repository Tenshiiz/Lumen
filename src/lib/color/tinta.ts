import { colord } from './setup'

// Constantes correspondentes aos tokens --tinta e --tinta-inversa para cálculo de contraste
const TINTA = '#EDEFFB'
const TINTA_INVERSA = '#0F1230'

/**
 * Determina se a variante clara ou escura de texto oferece maior razão de contraste sobre o fundo.
 */
export function tintaSobre(fundo: string): 'clara' | 'escura' {
  const cor = colord(fundo)
  return cor.contrast(TINTA) >= cor.contrast(TINTA_INVERSA) ? 'clara' : 'escura'
}
