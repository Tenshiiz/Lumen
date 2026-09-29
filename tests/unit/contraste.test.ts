import { describe, expect, it } from 'vitest'
import { colord, tintaSobre } from '../../src/lib/color/index'
import { esperarFinito } from './_helpers'

describe('Contraste e Acessibilidade (tintaSobre)', () => {
  it('fundos claros pedem tinta escura', () => {
    expect(tintaSobre('#FFFFFF')).toBe('escura')
    expect(tintaSobre('#F8F9FA')).toBe('escura')
    expect(tintaSobre('#FEF3C7')).toBe('escura')
    expect(tintaSobre('#FFFF00')).toBe('escura')
  })

  it('fundos escuros pedem tinta clara', () => {
    expect(tintaSobre('#000000')).toBe('clara')
    expect(tintaSobre('#0F1230')).toBe('clara')
    expect(tintaSobre('#1E293B')).toBe('clara')
    expect(tintaSobre('#000080')).toBe('clara')
    expect(tintaSobre('#7F1D1D')).toBe('clara')
  })

  it('colord a11y: cálculo de contraste WCAG é consistente e válido', () => {
    expect(colord('#000000').contrast('#FFFFFF'), 'preto sobre branco ~21:1').toBeCloseTo(21, 0)
    expect(colord('#FFFFFF').contrast('#FFFFFF'), 'cor consigo mesma 1:1').toBeCloseTo(1, 2)

    esperarFinito(colord('#F0763A').contrast('#0F1230'), 'Contraste com tinta escura')
    esperarFinito(colord('#F0763A').contrast('#EDEFFB'), 'Contraste com tinta clara')
  })
})
