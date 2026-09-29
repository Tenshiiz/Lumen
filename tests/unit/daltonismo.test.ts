import { describe, expect, it } from 'vitest'
import { colord, simular, VISOES, type TipoVisao } from '../../src/lib/color/index'
import { esperarFinito, esperarHexValido } from './_helpers'

const TIPOS: TipoVisao[] = ['protanopia', 'deuteranopia', 'tritanopia', 'acromatopsia']

describe('Simulação de Daltonismo', () => {
  it('simular com tipo null retorna a cor original normalizada', () => {
    expect(simular('#f0763a', null)).toBe('#F0763A')
    expect(simular('#00ff00', null)).toBe('#00FF00')
  })

  it('preto e branco absolutos permanecem invariantes em todos os tipos', () => {
    for (const tipo of TIPOS) {
      expect(simular('#000000', tipo), `Preto na visão ${tipo}`).toBe('#000000')
      expect(simular('#FFFFFF', tipo), `Branco na visão ${tipo}`).toBe('#FFFFFF')
    }
  })

  it('acromatopsia: os 3 canais RGB resultantes são idênticos (cinza puro)', () => {
    for (const hex of ['#FF0000', '#00FF00', '#0000FF', '#F0763A', '#3B82F6', '#9333EA']) {
      const res = simular(hex, 'acromatopsia')
      esperarHexValido(res, `Acromatopsia de ${hex}`)

      const { r, g, b } = colord(res).toRgb()
      expect(r, `R = G na acromatopsia de ${hex}`).toBe(g)
      expect(g, `G = B na acromatopsia de ${hex}`).toBe(b)
    }
  })

  it('imunidade a NaN e clipping seguro de gamut em 25 cores em todos os tipos', () => {
    const cores = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF',
      '#F0763A', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B',
      '#E11D48', '#D97706', '#059669', '#0284C7', '#4F46E5', '#C026D3',
      '#1E293B', '#F8FAFC', '#78350F', '#064E3B', '#1E3A8A', '#581C87',
      '#881337',
    ]

    for (const cor of cores) {
      for (const tipo of TIPOS) {
        const sim = simular(cor, tipo)
        esperarHexValido(sim, `Simulação de ${cor} para ${tipo}`)

        const { r, g, b } = colord(sim).toRgb()
        for (const canal of [r, g, b]) {
          esperarFinito(canal)
          expect(canal).toBeGreaterThanOrEqual(0)
          expect(canal).toBeLessThanOrEqual(255)
        }
      }
    }
  })

  it('VISOES contém 5 definições incluindo a visão típica', () => {
    expect(VISOES.map((v) => v.tipo)).toEqual([null, 'protanopia', 'deuteranopia', 'tritanopia', 'acromatopsia'])
  })
})
