import { describe, expect, it } from 'vitest'
import {
  cmykTolerante,
  colord,
  formatarCampo,
  hexParaHsv,
  hexTolerante,
  hslTolerante,
  interpretarCampo,
  numeros,
  rgbTolerante,
} from '../../src/lib/color/index'
import { esperarFinito, prng } from './_helpers'

describe('Conversões Bidirecionais e Imunidade a NaN', () => {
  it('hexParaHsv: cores primárias e secundárias puras', () => {
    const cores = [
      { hex: '#FF0000', h: 0, s: 100, v: 100 },
      { hex: '#00FF00', h: 120, s: 100, v: 100 },
      { hex: '#0000FF', h: 240, s: 100, v: 100 },
      { hex: '#FFFF00', h: 60, s: 100, v: 100 },
      { hex: '#00FFFF', h: 180, s: 100, v: 100 },
      { hex: '#FF00FF', h: 300, s: 100, v: 100 },
    ]

    for (const c of cores) {
      const hsv = hexParaHsv(c.hex)
      expect(hsv, `hexParaHsv(${c.hex}) não deve ser nulo`).not.toBeNull()
      esperarFinito(hsv!.h, `Hue de ${c.hex}`)
      esperarFinito(hsv!.s, `Sat de ${c.hex}`)
      esperarFinito(hsv!.v, `Val de ${c.hex}`)
      expect(Math.abs(hsv!.h - c.h), `Hue de ${c.hex}`).toBeLessThanOrEqual(0.5)
      expect(Math.abs(hsv!.s - c.s), `Saturação de ${c.hex}`).toBeLessThanOrEqual(0.5)
      expect(Math.abs(hsv!.v - c.v), `Valor de ${c.hex}`).toBeLessThanOrEqual(0.5)
    }
  })

  it('hexParaHsv: casos limítrofes (preto, branco, cinza) sem divisão por zero nem NaN', () => {
    // Preto: max = 0 e delta = 0
    const preto = hexParaHsv('#000000')
    expect(preto).not.toBeNull()
    expect(preto).toEqual({ h: 0, s: 0, v: 0 })

    // Branco: max = 1 e delta = 0
    const branco = hexParaHsv('#FFFFFF')
    expect(branco).not.toBeNull()
    esperarFinito(branco!.v, 'Val de branco')
    expect(branco!.h).toBe(0)
    expect(branco!.s).toBe(0)
    expect(Math.abs(branco!.v - 100)).toBeLessThanOrEqual(0.1)

    // Cinza: delta = 0
    const cinza = hexParaHsv('#808080')
    expect(cinza).not.toBeNull()
    esperarFinito(cinza!.v, 'Val de cinza')
    expect(cinza!.h).toBe(0)
    expect(cinza!.s).toBe(0)
  })

  it('hexParaHsv: round-trip exato (HEX → HSV → HEX) com alta precisão decimal', () => {
    // Inclui o caso crítico documentado (#B13793)
    const amostra = [
      '#B13793', '#F0763A', '#3B82F6', '#10B981', '#6366F1', '#EC4899',
      '#EAB308', '#14B8A6', '#8B5CF6', '#F97316', '#0F172A', '#F8FAFC',
      '#7C3AED', '#EF4444', '#22C55E', '#A855F7', '#06B6D4', '#84CC16',
    ]

    for (const hex of amostra) {
      const hsv = hexParaHsv(hex)
      expect(hsv, `hexParaHsv de ${hex} não deve falhar`).not.toBeNull()
      esperarFinito(hsv!.h)
      esperarFinito(hsv!.s)
      esperarFinito(hsv!.v)
      expect(colord(hsv!).toHex().toUpperCase(), `Round-trip de ${hex}`).toBe(hex)
    }
  })

  it('hexParaHsv: 50 cores pseudoaleatórias (semente fixa) com round-trip e sem NaN', () => {
    const aleatorio = prng(20260929)
    const canal = () => Math.floor(aleatorio() * 256)

    for (let i = 0; i < 50; i++) {
      const hex = colord({ r: canal(), g: canal(), b: canal() }).toHex().toUpperCase()
      const hsv = hexParaHsv(hex)
      expect(hsv, `hexParaHsv falhou para ${hex}`).not.toBeNull()
      esperarFinito(hsv!.h, `Hue de ${hex}`)
      esperarFinito(hsv!.s, `Sat de ${hex}`)
      esperarFinito(hsv!.v, `Val de ${hex}`)
      expect(colord(hsv!).toHex().toUpperCase(), `Ida e volta de ${hex}`).toBe(hex)
    }
  })

  it('numeros: extrai inteiros, decimais e negativos ignorando ruído', () => {
    expect(numeros('rgb(240, 118, 58)')).toEqual([240, 118, 58])
    expect(numeros('hsl(20deg, 84%, 58.5%)')).toEqual([20, 84, 58.5])
    expect(numeros('-10.5, 20, -30')).toEqual([-10.5, 20, -30])
    expect(numeros('sem numeros nenhum')).toHaveLength(0)
  })

  it('entradas inválidas retornam null sem quebrar nem gerar NaN', () => {
    expect(hexParaHsv('')).toBeNull()
    expect(hexParaHsv('cor-invalida')).toBeNull()
    expect(hexParaHsv('#12345'), 'HEX de 5 dígitos').toBeNull()
    expect(hexParaHsv('#GGGGGG'), 'Letras fora do hex').toBeNull()

    expect(hexTolerante('')).toBeNull()
    expect(hexTolerante('banana')).toBeNull()
    expect(hexTolerante('#12')).toBeNull()

    expect(rgbTolerante('')).toBeNull()
    expect(rgbTolerante('12, 34'), 'menos de 3 números').toBeNull()

    expect(hslTolerante('')).toBeNull()
    expect(hslTolerante('50%'), 'menos de 3 números').toBeNull()

    expect(cmykTolerante('')).toBeNull()
    expect(cmykTolerante('10, 20, 30'), 'menos de 4 números').toBeNull()

    expect(interpretarCampo('hex', 'desconhecido')).toBeNull()
    expect(interpretarCampo('rgb', 'abc')).toBeNull()
  })

  it('formatarCampo: nunca devolve NaN em nenhum formato', () => {
    const cores = ['#F0763A', '#000000', '#FFFFFF', '#123456', '#ABCDEF']
    const formatos = ['hex', 'rgb', 'hsl', 'cmyk'] as const

    for (const hex of cores) {
      for (const formato of formatos) {
        const texto = formatarCampo(hex, formato)
        expect(texto, `formatarCampo(${hex}, "${formato}")`).not.toContain('NaN')
        expect(texto.length).toBeGreaterThan(0)
      }
    }
  })
})
