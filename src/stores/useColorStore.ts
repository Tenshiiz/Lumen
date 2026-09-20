import { create } from 'zustand'
import { useMemo } from 'react'
import { colord, hexParaHsv, type HslColor, type HsvColor } from '@/lib/color'

const RECENTES_MAX = 12

const limitar = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(v)))
const normalizarMatiz = (h: number) => ((Math.round(h) % 360) + 360) % 360

interface ColorState {
  /**
   * Fonte única da verdade: HSV (matiz 0–360, saturação e brilho 0–100).
   * O HEX é sempre derivado, nunca armazenado. Como a roda e os faders escrevem
   * aqui direto, matiz e saturação sobrevivem a brilho 0 ou saturação 0, o que
   * um caminho via HEX destruiria (#000000 volta como matiz 0, saturação 0).
   *
   * Os valores podem ser decimais (vindos de um HEX, ver hexParaHsv): quem
   * exibe arredonda, quem calcula usa o valor cheio.
   */
  hsv: HsvColor

  // Cores que o usuário confirmou, da mais recente para a mais antiga
  recentColors: string[]

  setHue: (h: number) => void
  setSaturation: (s: number) => void
  setBrightness: (v: number) => void
  setHueSaturation: (h: number, s: number) => void
  /** Só para entrada de texto e cores prontas: passa por HEX de propósito. */
  setFromHex: (hex: string) => void
  /** Grava a cor atual no histórico. Chamar ao fim de uma ação, não a cada passo dela. */
  commitColor: () => void
}

export const useColorStore = create<ColorState>((set, get) => ({
  // ≈ #F0763A: o herói abre com uma cor saturada, não com branco
  hsv: { h: 20, s: 76, v: 94 },
  recentColors: [],

  setHue: (h) => set((estado) => ({ hsv: { ...estado.hsv, h: normalizarMatiz(h) } })),

  setSaturation: (s) => set((estado) => ({ hsv: { ...estado.hsv, s: limitar(s, 0, 100) } })),

  setBrightness: (v) => set((estado) => ({ hsv: { ...estado.hsv, v: limitar(v, 0, 100) } })),

  setHueSaturation: (h, s) =>
    set((estado) => ({ hsv: { ...estado.hsv, h: normalizarMatiz(h), s: limitar(s, 0, 100) } })),

  setFromHex: (hex) => {
    const hsv = hexParaHsv(hex)
    if (hsv) set({ hsv })
  },

  commitColor: () => {
    const { hsv, recentColors } = get()
    const hex = colord(hsv).toHex().toUpperCase()
    if (recentColors[0] === hex) return
    set({ recentColors: [hex, ...recentColors.filter((c) => c !== hex)].slice(0, RECENTES_MAX) })
  },
}))

/** HEX derivado do HSV (maiúsculo, com #). */
export const useHex = () => useColorStore((estado) => colord(estado.hsv).toHex().toUpperCase())

/** HSL derivado do HSV; o objeto só muda quando o HSV muda. */
export function useHsl(): HslColor {
  const hsv = useColorStore((estado) => estado.hsv)
  return useMemo(() => colord(hsv).toHsl(), [hsv])
}
