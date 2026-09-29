import { expect } from 'vitest'
import { useColorStore } from '../../src/stores/useColorStore'

/** Estado inicial da store, idêntico ao declarado em useColorStore. */
export const ESTADO_INICIAL = { hsv: { h: 20, s: 76, v: 94 }, recentColors: [] as string[] }

/** Restaura a store ao estado inicial para isolar testes entre si. */
export function resetarStore() {
  useColorStore.setState({ hsv: { ...ESTADO_INICIAL.hsv }, recentColors: [] })
}

/** Exige um número finito (rejeita NaN e ±Infinity). */
export function esperarFinito(valor: number, rotulo = 'valor') {
  expect(Number.isFinite(valor), `${rotulo} deve ser finito (obtido ${valor})`).toBe(true)
}

/** Exige HEX no formato #RRGGBB. */
export function esperarHexValido(hex: string, rotulo = 'HEX') {
  expect(hex, `${rotulo}: "${hex}" não é #RRGGBB`).toMatch(/^#[0-9A-F]{6}$/i)
}

/** Gerador pseudoaleatório determinístico (mulberry32) para testes reproduzíveis. */
export function prng(semente: number) {
  let s = semente >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
