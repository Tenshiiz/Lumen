import { beforeEach, describe, expect, it } from 'vitest'
import { colord } from '../../src/lib/color/index'
import { useColorStore } from '../../src/stores/useColorStore'
import { resetarStore } from './_helpers'

const store = () => useColorStore.getState()

describe('Store useColorStore e Histórico de Recentes', () => {
  beforeEach(resetarStore)

  it('setFromHex atualiza o HSV com sucesso para HEX válido', () => {
    store().setFromHex('#3B82F6')
    expect(colord(store().hsv).toHex().toUpperCase()).toBe('#3B82F6')
  })

  it('setFromHex ignora valores inválidos mantendo o estado anterior', () => {
    store().setFromHex('#FF0000')
    const antes = { ...store().hsv }

    store().setFromHex('nao-e-hex')
    expect(store().hsv).toEqual(antes)
  })

  it('commitColor gerencia histórico de até 12 cores sem duplicação consecutiva', () => {
    store().setFromHex('#FF0000')
    store().commitColor()
    expect(store().recentColors).toEqual(['#FF0000'])

    // Commit consecutivo da mesma cor não duplica.
    store().commitColor()
    expect(store().recentColors).toEqual(['#FF0000'])

    store().setFromHex('#00FF00')
    store().commitColor()
    expect(store().recentColors).toEqual(['#00FF00', '#FF0000'])

    // Reconfirmar uma cor antiga a move para a frente sem duplicar.
    store().setFromHex('#FF0000')
    store().commitColor()
    expect(store().recentColors).toEqual(['#FF0000', '#00FF00'])

    // 15 cores adicionais para exercitar o limite de 12.
    const paleta = [
      '#111111', '#222222', '#333333', '#444444', '#555555',
      '#666666', '#777777', '#888888', '#999999', '#AAAAAA',
      '#BBBBBB', '#CCCCCC', '#DDDDDD', '#EEEEEE', '#FFFFFF',
    ]
    for (const c of paleta) {
      store().setFromHex(c)
      store().commitColor()
    }

    expect(store().recentColors, 'Histórico não pode ultrapassar 12 itens').toHaveLength(12)
    expect(store().recentColors[0], 'Mais recente deve ser o primeiro').toBe('#FFFFFF')
  })
})
