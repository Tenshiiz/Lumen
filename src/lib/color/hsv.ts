import { colord, type HsvColor } from './setup'

/**
 * HEX → HSV **sem arredondar**. `colord().toHsv()` devolve inteiros, e HSV
 * inteiro não representa todas as cores: numa amostra de 200 mil cores, 87,7%
 * voltavam diferentes (#B13793 virava #B03792). Com decimais a ida e volta é
 * exata (0 erros na mesma amostra), então quem cola o HEX da marca recebe o
 * mesmo HEX de volta.
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
