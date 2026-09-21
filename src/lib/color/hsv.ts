import { colord, type HsvColor } from './setup'

/**
 * Converte cor hexadecimal para HSV preservando valores decimais em ponto flutuante
 * para garantir conversões bidirecionais sem perda de precisão.
 */
export function hexParaHsv(hex: string): HsvColor | null {
  const cor = colord(hex)
  if (!cor.isValid()) return null

  const { r, g, b } = cor.toRgb()
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  return { h, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100 }
}
