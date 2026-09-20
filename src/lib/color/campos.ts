import { colord } from './setup'

export type FormatoCampo = 'hex' | 'rgb' | 'hsl' | 'cmyk'

/** Exemplo válido de cada formato, usado nas mensagens de erro. */
export const EXEMPLO_CAMPO: Record<FormatoCampo, string> = {
  hex: '#F0763A',
  rgb: '240, 118, 58',
  hsl: '20, 84%, 58%',
  cmyk: '0, 51, 76, 6',
}

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Extrai os números de um texto com ruído real (prefixos, parênteses, "%", "°",
 * espaços, colagens de terceiros). Só o ponto é separador decimal: a vírgula
 * separa valores, então "240,118,58" são três números e não 240,118.
 */
export function numeros(texto: string): number[] {
  return (texto.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
}

const paraHex = (cor: Parameters<typeof colord>[0]) => colord(cor).toHex().toUpperCase()

/** "#f0763a", "F0763A", "hex: #fa3", "#FA3" → "#F0763A"; qualquer outra coisa → null. */
export function hexTolerante(texto: string): string | null {
  const limpo = texto.trim().replace(/^hex\s*:?\s*/i, '').replace(/^#/, '')
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(limpo)) return null
  return paraHex(`#${limpo}`)
}

export function rgbTolerante(texto: string): string | null {
  const n = numeros(texto)
  if (n.length < 3) return null
  const [r, g, b] = n.slice(0, 3).map((v) => limitar(Math.round(v), 0, 255))
  return paraHex({ r, g, b })
}

export function hslTolerante(texto: string): string | null {
  const n = numeros(texto)
  if (n.length < 3) return null
  const h = ((Math.round(n[0]) % 360) + 360) % 360
  return paraHex({ h, s: limitar(n[1], 0, 100), l: limitar(n[2], 0, 100) })
}

/** CMYK em 0–100, a mesma escala que o colord usa em toCmyk(). */
export function cmykTolerante(texto: string): string | null {
  const n = numeros(texto)
  if (n.length < 4) return null
  const [c, m, y, k] = n.slice(0, 4).map((v) => limitar(v, 0, 100))
  return paraHex({ c, m, y, k })
}

const INTERPRETES: Record<FormatoCampo, (texto: string) => string | null> = {
  hex: hexTolerante,
  rgb: rgbTolerante,
  hsl: hslTolerante,
  cmyk: cmykTolerante,
}

export function interpretarCampo(formato: FormatoCampo, texto: string): string | null {
  return INTERPRETES[formato](texto)
}

/** Texto exibido em cada campo para uma cor. */
export function formatarCampo(hex: string, formato: FormatoCampo): string {
  const cor = colord(hex)
  switch (formato) {
    case 'rgb': {
      const { r, g, b } = cor.toRgb()
      return `${r}, ${g}, ${b}`
    }
    case 'hsl': {
      const { h, s, l } = cor.toHsl()
      return `${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%`
    }
    case 'cmyk': {
      const { c, m, y, k } = cor.toCmyk()
      return `${c}, ${m}, ${y}, ${k}`
    }
    case 'hex':
    default:
      return cor.toHex().toUpperCase()
  }
}
