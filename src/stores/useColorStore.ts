import { create } from 'zustand'
import { useMemo } from 'react'
import { colord, hexParaHsv, type HslColor, type HsvColor } from '@/lib/color'

const RECENTES_MAX = 12

const limitar = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(v)))
const normalizarMatiz = (h: number) => ((Math.round(h) % 360) + 360) % 360

interface ColorState {
  /**
   * Representação central da cor no formato HSV (matiz 0–360, saturação e brilho 0–100).
   * Armazena valores decimais para evitar perda de precisão em conversões bidirecionais.
   */
  hsv: HsvColor

  /** Histórico de cores confirmadas em ordem cronológica inversa. */
  recentColors: string[]

  setHue: (h: number) => void
  setSaturation: (s: number) => void
  setBrightness: (v: number) => void
  setHueSaturation: (h: number, s: number) => void
  /** Atualiza o estado a partir de uma string hexadecimal. */
  setFromHex: (hex: string) => void
  /** Persiste a cor atual no histórico de recentes. */
  commitColor: () => void
}

export const useColorStore = create<ColorState>((set, get) => ({
  // Cor padrão inicial (#F0763A)
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

/** Hook seletor que retorna a cor ativa em formato hexadecimal maiúsculo. */
export const useHex = () => useColorStore((estado) => colord(estado.hsv).toHex().toUpperCase())

/** Hook seletor que retorna a cor ativa convertida para o formato HSL. */
export function useHsl(): HslColor {
  const hsv = useColorStore((estado) => estado.hsv)
  return useMemo(() => colord(hsv).toHsl(), [hsv])
}
