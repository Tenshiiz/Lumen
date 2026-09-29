import { describe, expect, it } from 'vitest'
import { ACORDES, gerarAcorde, type TipoAcorde } from '../../src/lib/color/index'

describe('Harmonias Cromáticas (harmonies.ts)', () => {
  const hslBase = { h: 30, s: 80, l: 50 }

  it('ACORDES contém os 5 tipos definidos', () => {
    expect(ACORDES).toHaveLength(5)
    expect(ACORDES.map((a) => a.tipo)).toEqual(
      expect.arrayContaining(['analoga', 'complementar', 'dividida', 'triade', 'mono']),
    )
  })

  it('gerarAcorde retorna o número exato de cores para cada tipo', () => {
    expect(gerarAcorde(hslBase, 'analoga')).toHaveLength(5)
    expect(gerarAcorde(hslBase, 'complementar')).toHaveLength(2)
    expect(gerarAcorde(hslBase, 'dividida')).toHaveLength(3)
    expect(gerarAcorde(hslBase, 'triade')).toHaveLength(3)
    expect(gerarAcorde(hslBase, 'mono')).toHaveLength(5)
  })

  it('gerarAcorde preserva hexBase exato no passo 0 das harmonias por matiz', () => {
    const hexAtivo = '#F0763A'
    expect(gerarAcorde(hslBase, 'complementar', hexAtivo)[0]).toBe(hexAtivo)
    // Na análoga o passo 0 fica no centro (índice 2).
    expect(gerarAcorde(hslBase, 'analoga', hexAtivo)[2]).toBe(hexAtivo)
  })

  it('gerarAcorde com tipo inválido devolve array vazio sem erro', () => {
    expect(gerarAcorde(hslBase, 'inexistente' as TipoAcorde)).toHaveLength(0)
  })
})
