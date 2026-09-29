import { beforeEach, describe, expect, it } from 'vitest'
import { cmykTolerante, colord, gerarAcorde, hslTolerante, rgbTolerante } from '../../src/lib/color/index'
import { useColorStore } from '../../src/stores/useColorStore'
import { esperarHexValido, resetarStore } from './_helpers'

const store = () => useColorStore.getState()

describe('Limitação de Saturação e Brilho (Clamping 0..100)', () => {
  beforeEach(resetarStore)

  it('useColorStore: saturação limitada a [0, 100]', () => {
    store().setSaturation(-15)
    expect(store().hsv.s, 'Saturação negativa deve ser limitada a 0').toBe(0)

    store().setSaturation(135)
    expect(store().hsv.s, 'Saturação > 100 deve ser limitada a 100').toBe(100)

    store().setSaturation(0)
    expect(store().hsv.s).toBe(0)

    store().setSaturation(100)
    expect(store().hsv.s).toBe(100)

    store().setSaturation(45)
    expect(store().hsv.s).toBe(45)
  })

  it('useColorStore: brilho limitado a [0, 100]', () => {
    store().setBrightness(-50)
    expect(store().hsv.v, 'Brilho negativo deve ser limitado a 0').toBe(0)

    store().setBrightness(200)
    expect(store().hsv.v, 'Brilho > 100 deve ser limitado a 100').toBe(100)

    store().setBrightness(0)
    expect(store().hsv.v).toBe(0)

    store().setBrightness(100)
    expect(store().hsv.v).toBe(100)

    store().setBrightness(72)
    expect(store().hsv.v).toBe(72)
  })

  it('campos.ts (rgbTolerante): limita canais RGB a [0, 255]', () => {
    // -20 -> 0, 300 -> 255, 150 -> 150
    expect(rgbTolerante('rgb(-20, 300, 150)')).toBe(colord({ r: 0, g: 255, b: 150 }).toHex().toUpperCase())
  })

  it('campos.ts (hslTolerante): limita S e L a [0, 100]', () => {
    // S -> 100, L -> 0 resulta em preto
    expect(hslTolerante('hsl(120, 150%, -30%)')).toBe('#000000')
    // S -> 0, L -> 100 resulta em branco
    expect(hslTolerante('hsl(120, -20%, 150%)')).toBe('#FFFFFF')
  })

  it('campos.ts (cmykTolerante): limita C, M, Y, K a [0, 100]', () => {
    const hex = cmykTolerante('cmyk(-10, 150, 200, -50)')
    esperarHexValido(hex ?? '', 'CMYK fora da faixa')
    // C: 0, M: 100, Y: 100, K: 0 => vermelho puro
    expect(hex).toBe('#FF0000')
  })

  it('harmonies.ts (gerarAcorde - monocromática): luminosidade travada entre 6 e 94', () => {
    // Base com L=95: passos positivos não devem passar de 94.
    for (const hex of gerarAcorde({ h: 200, s: 80, l: 95 }, 'mono')) {
      const { l } = colord(hex).toHsl()
      expect(l, `Luminosidade acima de 94 (obtido ${l})`).toBeLessThanOrEqual(94)
      expect(l, `Luminosidade abaixo de 6 (obtido ${l})`).toBeGreaterThanOrEqual(6)
    }

    // Base com L=3: passos negativos não devem ficar abaixo de 6.
    for (const hex of gerarAcorde({ h: 200, s: 80, l: 3 }, 'mono')) {
      const { l } = colord(hex).toHsl()
      expect(l, `Luminosidade abaixo de 6 (obtido ${l})`).toBeGreaterThanOrEqual(6)
      expect(l, `Luminosidade acima de 94 (obtido ${l})`).toBeLessThanOrEqual(94)
    }
  })
})
