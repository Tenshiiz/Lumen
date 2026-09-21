import { colord } from './setup'

export type FormatoCampo = 'hex' | 'rgb' | 'hsl' | 'cmyk'

/** Exemplos de referência para cada formato de cor suportado. */
export const EXEMPLO_CAMPO: Record<FormatoCampo, string> = {
  hex: '#F0763A',
  rgb: '240, 118, 58',
  hsl: '20, 84%, 58%',
  cmyk: '0, 51, 76, 6',
}

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/**
 * Extrai valores numéricos de uma string, desconsiderando caracteres textuais e separadores.
 */
export function numeros(texto: string): number[] {
  return (texto.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
}

const paraHex = (cor: Parameters<typeof colord>[0]) => colord(cor).toHex().toUpperCase()

/** Normaliza strings de formatos hexadecimais variados para o formato '#RRGGBB' em maiúsculas. */
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

/** Interpreta valores CMYK na escala 0-100 para formato hexadecimal. */
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

/** Formata a cor hexadecimal para exibição textual no formato especificado. */
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
