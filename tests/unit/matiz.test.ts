import { beforeEach, describe, expect, it } from 'vitest'
import { gerarAcorde, hslTolerante } from '../../src/lib/color/index'
import { useColorStore } from '../../src/stores/useColorStore'
import { esperarHexValido, resetarStore } from './_helpers'

const store = () => useColorStore.getState()

describe('Normalização de Matiz (Hue)', () => {
  beforeEach(resetarStore)

  it('useColorStore: matiz dentro do intervalo padrão (0..360)', () => {
    store().setHue(0)
    expect(store().hsv.h, 'Matiz 0° deve permanecer 0').toBe(0)

    store().setHue(180)
    expect(store().hsv.h, 'Matiz 180° deve permanecer 180').toBe(180)

    store().setHue(360)
    expect(store().hsv.h, 'Matiz 360° deve normalizar para 0').toBe(0)
  })

  it('useColorStore: matizes maiores que 360° devem usar módulo 360', () => {
    store().setHue(370)
    expect(store().hsv.h).toBe(10)

    store().setHue(720)
    expect(store().hsv.h).toBe(0)

    store().setHue(750)
    expect(store().hsv.h).toBe(30)

    store().setHue(1080)
    expect(store().hsv.h).toBe(0)
  })

  it('useColorStore: matizes negativos devem mapear corretamente para [0, 360)', () => {
    store().setHue(-30)
    expect(store().hsv.h).toBe(330)

    store().setHue(-180)
    expect(store().hsv.h).toBe(180)

    store().setHue(-360)
    expect(store().hsv.h).toBe(0)

    store().setHue(-370)
    expect(store().hsv.h).toBe(350)

    store().setHue(-750)
    expect(store().hsv.h, '-750° (-2 voltas - 30°) deve normalizar para 330°').toBe(330)
  })

  it('useColorStore: setHueSaturation preserva a normalização com números fora da faixa', () => {
    store().setHueSaturation(-90, 60)
    expect(store().hsv.h).toBe(270)
    expect(store().hsv.s).toBe(60)

    store().setHueSaturation(450, 40)
    expect(store().hsv.h).toBe(90)
    expect(store().hsv.s).toBe(40)
  })

  it('campos.ts (hslTolerante): aceita matizes negativos e > 360 com rotação correta', () => {
    const corNormal = hslTolerante('hsl(10, 100%, 50%)')
    expect(hslTolerante('hsl(370, 100%, 50%)'), 'hsl(370) deve equivaler a hsl(10)').toBe(corNormal)
    expect(hslTolerante('hsl(730, 100%, 50%)'), 'hsl(730) deve equivaler a hsl(10)').toBe(corNormal)
    expect(hslTolerante('hsl(-350, 100%, 50%)'), 'hsl(-350) deve equivaler a hsl(10)').toBe(corNormal)

    expect(hslTolerante('hsl(-60, 100%, 50%)'), 'hsl(-60) deve equivaler a hsl(300)').toBe(
      hslTolerante('hsl(300, 100%, 50%)'),
    )
  })

  it('harmonies.ts (gerarAcorde): rotação angular nunca gera ângulos fora de [0, 360)', () => {
    // Base próxima de 0°: passos negativos não devem produzir matiz negativo.
    const analoga = gerarAcorde({ h: 15, s: 100, l: 50 }, 'analoga')
    expect(analoga).toHaveLength(5)
    analoga.forEach((hex) => esperarHexValido(hex, 'Cor do acorde análogo'))

    // Base próxima de 350°: passos positivos não devem ultrapassar 360°.
    const triade = gerarAcorde({ h: 350, s: 90, l: 50 }, 'triade')
    expect(triade).toHaveLength(3)
    triade.forEach((hex) => esperarHexValido(hex, 'Cor da tríade'))
  })
})
