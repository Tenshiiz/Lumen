/**
 * ============================================================================
 * LUMEN — SUÍTE DE TESTES UNITÁRIOS AUTÔNOMA
 * ============================================================================
 * Cobertura completa de:
 *  1. Normalização de Matiz (0° a 360°, negativos, > 360°)
 *  2. Limitação de Saturação e Brilho (0 a 100)
 *  3. Conversões Bidirecionais sem NaN (HEX, HSV, HSL, RGB, CMYK)
 *  4. Cálculo de Contraste e Acessibilidade (Tinta clara/escura)
 *  5. Simulação de Daltonismo (Protanopia, Deuteranopia, Tritanopia, Acromatopsia)
 *  6. Harmonias Cromáticas (Análoga, Complementar, Dividida, Tríade, Monocromática)
 *  7. Estado e Ações da Store (useColorStore)
 *  8. Utilitários de Exportação e Slugs
 * ============================================================================
 */

import {
  colord,
  hexParaHsv,
  hexTolerante,
  rgbTolerante,
  hslTolerante,
  cmykTolerante,
  interpretarCampo,
  formatarCampo,
  numeros,
  tintaSobre,
  simular,
  VISOES,
  gerarAcorde,
  ACORDES,
  type TipoVisao,
  type TipoAcorde,
} from '../src/lib/color/index'

import { slugDe, slugsUnicos, gerarCss, gerarTailwind, gerarJson, gerarTypeScript } from '../src/lib/color/exportar'
import { useColorStore } from '../src/stores/useColorStore'

// ---------------------------------------------------------------------------
// Mini Framework de Testes Autônomo com Relatório Visual
// ---------------------------------------------------------------------------

interface TestResult {
  suite: string
  name: string
  passed: boolean
  error?: string
  durationMs: number
}

const results: TestResult[] = []
let currentSuite = ''

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function suite(name: string, fn: () => void) {
  currentSuite = name
  fn()
}

function test(name: string, fn: () => void) {
  const start = performance.now()
  try {
    fn()
    const durationMs = performance.now() - start
    results.push({ suite: currentSuite, name, passed: true, durationMs })
  } catch (err: unknown) {
    const durationMs = performance.now() - start
    const msg = err instanceof Error ? err.message : String(err)
    results.push({ suite: currentSuite, name, passed: false, error: msg, durationMs })
  }
}

// Asserções auxiliares
function assert(condition: boolean, msg = 'Asserção falhou') {
  if (!condition) throw new Error(msg)
}

function assertEqual<T>(actual: T, expected: T, msg?: string) {
  if (actual !== expected) {
    throw new Error(`${msg ?? 'Falha de igualdade'}: esperado [${expected}], obtido [${actual}]`)
  }
}

function assertClose(actual: number, expected: number, tolerance = 0.01, msg?: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${msg ?? 'Falha de proximidade'}: esperado ~[${expected}] (±${tolerance}), obtido [${actual}]`)
  }
}

function assertNotNaN(val: number, msg = 'Valor não deve ser NaN') {
  if (Number.isNaN(val)) throw new Error(`${msg}: obtido NaN`)
  if (!Number.isFinite(val)) throw new Error(`${msg}: obtido infinito`)
}

function assertValidHex(hex: string, msg = 'Deve ser um HEX válido de 7 caracteres') {
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    throw new Error(`${msg}: "${hex}" não é um HEX válido (#RRGGBB)`)
  }
}

// ---------------------------------------------------------------------------
// SUÍTE 1: NORMALIZAÇÃO DE MATIZ (0° A 360°, NEGATIVOS E > 360°)
// ---------------------------------------------------------------------------

suite('1. Normalização de Matiz (Hue)', () => {
  test('useColorStore: matiz dentro do intervalo padrão (0..360)', () => {
    useColorStore.getState().setHue(0)
    assertEqual(useColorStore.getState().hsv.h, 0, 'Matiz 0° deve permanecer 0')

    useColorStore.getState().setHue(180)
    assertEqual(useColorStore.getState().hsv.h, 180, 'Matiz 180° deve permanecer 180')

    useColorStore.getState().setHue(360)
    assertEqual(useColorStore.getState().hsv.h, 0, 'Matiz 360° deve normalizar para 0')
  })

  test('useColorStore: matizes maiores que 360° devem usar módulo 360', () => {
    useColorStore.getState().setHue(370)
    assertEqual(useColorStore.getState().hsv.h, 10, '370° deve normalizar para 10°')

    useColorStore.getState().setHue(720)
    assertEqual(useColorStore.getState().hsv.h, 0, '720° (2 voltas) deve normalizar para 0°')

    useColorStore.getState().setHue(750)
    assertEqual(useColorStore.getState().hsv.h, 30, '750° deve normalizar para 30°')

    useColorStore.getState().setHue(1080)
    assertEqual(useColorStore.getState().hsv.h, 0, '1080° deve normalizar para 0°')
  })

  test('useColorStore: matizes negativos devem mapear corretamente para [0, 360)', () => {
    useColorStore.getState().setHue(-30)
    assertEqual(useColorStore.getState().hsv.h, 330, '-30° deve normalizar para 330°')

    useColorStore.getState().setHue(-180)
    assertEqual(useColorStore.getState().hsv.h, 180, '-180° deve normalizar para 180°')

    useColorStore.getState().setHue(-360)
    assertEqual(useColorStore.getState().hsv.h, 0, '-360° deve normalizar para 0°')

    useColorStore.getState().setHue(-370)
    assertEqual(useColorStore.getState().hsv.h, 350, '-370° deve normalizar para 350°')

    useColorStore.getState().setHue(-750)
    assertEqual(useColorStore.getState().hsv.h, 330, '-750° (-2 voltas - 30°) deve normalizar para 330°')
  })

  test('useColorStore: setHueSaturation preserva a normalização com números fora da faixa', () => {
    useColorStore.getState().setHueSaturation(-90, 60)
    assertEqual(useColorStore.getState().hsv.h, 270, 'Hue -90 deve ser 270')
    assertEqual(useColorStore.getState().hsv.s, 60, 'Saturação 60 deve permanecer 60')

    useColorStore.getState().setHueSaturation(450, 40)
    assertEqual(useColorStore.getState().hsv.h, 90, 'Hue 450 deve ser 90')
    assertEqual(useColorStore.getState().hsv.s, 40, 'Saturação 40 deve permanecer 40')
  })

  test('campos.ts (hslTolerante): aceita matizes negativos e > 360 com rotação correta', () => {
    const corNormal = hslTolerante('hsl(10, 100%, 50%)')
    const corMaior = hslTolerante('hsl(370, 100%, 50%)')
    const corVolta2 = hslTolerante('hsl(730, 100%, 50%)')
    assertEqual(corMaior, corNormal, 'hsl(370) deve produzir a mesma cor que hsl(10)')
    assertEqual(corVolta2, corNormal, 'hsl(730) deve produzir a mesma cor que hsl(10)')

    const corNegativa = hslTolerante('hsl(-350, 100%, 50%)')
    assertEqual(corNegativa, corNormal, 'hsl(-350) deve produzir a mesma cor que hsl(10)')

    const cor300 = hslTolerante('hsl(300, 100%, 50%)')
    const corNeg60 = hslTolerante('hsl(-60, 100%, 50%)')
    assertEqual(corNeg60, cor300, 'hsl(-60) deve produzir hsl(300)')
  })

  test('harmonies.ts (gerarAcorde): rotação angular nunca gera ângulos fora de [0, 360)', () => {
    // Cor base perto de 0° (ex: 15°): passos negativos como -30° não devem produzir matiz negativo
    const acordeAnaloga = gerarAcorde({ h: 15, s: 100, l: 50 }, 'analoga')
    assertEqual(acordeAnaloga.length, 5, 'Harmonia análoga deve ter 5 passos')
    acordeAnaloga.forEach((hex) => assertValidHex(hex, 'Cada cor gerada no acorde deve ser um HEX válido'))

    // Base perto de 350°: passos positivos como +30° não devem ultrapassar 360°
    const acordeTriade = gerarAcorde({ h: 350, s: 90, l: 50 }, 'triade')
    assertEqual(acordeTriade.length, 3, 'Harmonia tríade deve ter 3 passos')
    acordeTriade.forEach((hex) => assertValidHex(hex, 'Cada cor da tríade deve ser um HEX válido'))
  })
})

// ---------------------------------------------------------------------------
// SUÍTE 2: LIMITAÇÃO DE SATURAÇÃO E BRILHO (0 A 100)
// ---------------------------------------------------------------------------

suite('2. Limitação de Saturação e Brilho (Clamping 0..100)', () => {
  test('useColorStore: saturação limitada a [0, 100]', () => {
    useColorStore.getState().setSaturation(-15)
    assertEqual(useColorStore.getState().hsv.s, 0, 'Saturação negativa deve ser limitada a 0')

    useColorStore.getState().setSaturation(135)
    assertEqual(useColorStore.getState().hsv.s, 100, 'Saturação > 100 deve ser limitada a 100')

    useColorStore.getState().setSaturation(0)
    assertEqual(useColorStore.getState().hsv.s, 0, 'Saturação 0 deve permanecer 0')

    useColorStore.getState().setSaturation(100)
    assertEqual(useColorStore.getState().hsv.s, 100, 'Saturação 100 deve permanecer 100')

    useColorStore.getState().setSaturation(45)
    assertEqual(useColorStore.getState().hsv.s, 45, 'Saturação intermediária 45 deve ser mantida')
  })

  test('useColorStore: brilho limitado a [0, 100]', () => {
    useColorStore.getState().setBrightness(-50)
    assertEqual(useColorStore.getState().hsv.v, 0, 'Brilho negativo deve ser limitado a 0')

    useColorStore.getState().setBrightness(200)
    assertEqual(useColorStore.getState().hsv.v, 100, 'Brilho > 100 deve ser limitado a 100')

    useColorStore.getState().setBrightness(0)
    assertEqual(useColorStore.getState().hsv.v, 0, 'Brilho 0 deve permanecer 0')

    useColorStore.getState().setBrightness(100)
    assertEqual(useColorStore.getState().hsv.v, 100, 'Brilho 100 deve permanecer 100')

    useColorStore.getState().setBrightness(72)
    assertEqual(useColorStore.getState().hsv.v, 72, 'Brilho intermediário 72 deve ser mantido')
  })

  test('campos.ts (rgbTolerante): limita canais RGB a [0, 255]', () => {
    const hex = rgbTolerante('rgb(-20, 300, 150)')
    // -20 -> 0, 300 -> 255, 150 -> 150 => rgb(0, 255, 150)
    assertEqual(hex, colord({ r: 0, g: 255, b: 150 }).toHex().toUpperCase())
  })

  test('campos.ts (hslTolerante): limita S e L a [0, 100]', () => {
    const hex = hslTolerante('hsl(120, 150%, -30%)')
    // S -> 100, L -> 0 => luminosidade 0 resulta em preto #000000
    assertEqual(hex, '#000000')

    const hexMaxL = hslTolerante('hsl(120, -20%, 150%)')
    // S -> 0, L -> 100 => luminosidade 100 resulta em branco #FFFFFF
    assertEqual(hexMaxL, '#FFFFFF')
  })

  test('campos.ts (cmykTolerante): limita C, M, Y, K a [0, 100]', () => {
    const hex = cmykTolerante('cmyk(-10, 150, 200, -50)')
    assertValidHex(hex ?? '', 'CMYK fora da faixa deve ser limitado e produzir HEX válido')
    // C: 0, M: 100, Y: 100, K: 0 => Vermelho puro #FF0000
    assertEqual(hex, '#FF0000')
  })

  test('harmonies.ts (gerarAcorde - monocromática): luminosidade travada entre 6 e 94', () => {
    // Se a cor base tiver L=95, passos positivos (+14, +28) não devem passar de 94
    const acordeClaro = gerarAcorde({ h: 200, s: 80, l: 95 }, 'mono')
    acordeClaro.forEach((hex) => {
      const hsl = colord(hex).toHsl()
      assert(hsl.l <= 94, `Luminosidade não deve passar de 94 (obtido ${hsl.l})`)
      assert(hsl.l >= 6, `Luminosidade não deve ser menor que 6 (obtido ${hsl.l})`)
    })

    // Se a cor base tiver L=3, passos negativos (-28, -14) não devem ser menores que 6
    const acordeEscuro = gerarAcorde({ h: 200, s: 80, l: 3 }, 'mono')
    acordeEscuro.forEach((hex) => {
      const hsl = colord(hex).toHsl()
      assert(hsl.l >= 6, `Luminosidade não deve ser menor que 6 (obtido ${hsl.l})`)
      assert(hsl.l <= 94, `Luminosidade não deve passar de 94 (obtido ${hsl.l})`)
    })
  })
})

// ---------------------------------------------------------------------------
// SUÍTE 3: CONVERSÕES BIDIRECIONAIS SEM NaN
// ---------------------------------------------------------------------------

suite('3. Conversões Bidirecionais e Imunidade a NaN', () => {
  test('hexParaHsv: cores primárias e secundárias puras', () => {
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
      assert(hsv !== null, `hexParaHsv(${c.hex}) não deve ser nulo`)
      assertNotNaN(hsv!.h, `Hue de ${c.hex}`)
      assertNotNaN(hsv!.s, `Sat de ${c.hex}`)
      assertNotNaN(hsv!.v, `Val de ${c.hex}`)
      assertClose(hsv!.h, c.h, 0.5, `Hue de ${c.hex}`)
      assertClose(hsv!.s, c.s, 0.5, `Saturação de ${c.hex}`)
      assertClose(hsv!.v, c.v, 0.5, `Valor de ${c.hex}`)
    }
  })

  test('hexParaHsv: casos limítrofes (preto, branco, cinza) sem divisão por zero nem NaN', () => {
    // Preto: max = 0, delta = 0 -> fórmula não deve gerar NaN
    const preto = hexParaHsv('#000000')
    assert(preto !== null, 'Preto não deve ser nulo')
    assertNotNaN(preto!.h, 'Hue de preto')
    assertNotNaN(preto!.s, 'Sat de preto')
    assertNotNaN(preto!.v, 'Val de preto')
    assertEqual(preto!.h, 0)
    assertEqual(preto!.s, 0)
    assertEqual(preto!.v, 0)

    // Branco: max = 1, delta = 0
    const branco = hexParaHsv('#FFFFFF')
    assert(branco !== null, 'Branco não deve ser nulo')
    assertNotNaN(branco!.h, 'Hue de branco')
    assertNotNaN(branco!.s, 'Sat de branco')
    assertNotNaN(branco!.v, 'Val de branco')
    assertEqual(branco!.h, 0)
    assertEqual(branco!.s, 0)
    assertClose(branco!.v, 100, 0.1)

    // Cinza: delta = 0
    const cinza = hexParaHsv('#808080')
    assert(cinza !== null, 'Cinza não deve ser nulo')
    assertNotNaN(cinza!.h, 'Hue de cinza')
    assertNotNaN(cinza!.s, 'Sat de cinza')
    assertNotNaN(cinza!.v, 'Val de cinza')
    assertEqual(cinza!.h, 0)
    assertEqual(cinza!.s, 0)
  })

  test('hexParaHsv: round-trip perfeito (HEX → HSV → HEX) com alta precisão decimal', () => {
    // Amostra de cores incluindo os casos críticos documentados (#B13793)
    const amostraHex = [
      '#B13793',
      '#F0763A',
      '#3B82F6',
      '#10B981',
      '#6366F1',
      '#EC4899',
      '#EAB308',
      '#14B8A6',
      '#8B5CF6',
      '#F97316',
      '#0F172A',
      '#F8FAFC',
      '#7C3AED',
      '#EF4444',
      '#22C55E',
      '#A855F7',
      '#06B6D4',
      '#84CC16',
    ]

    for (const hex of amostraHex) {
      const hsv = hexParaHsv(hex)
      assert(hsv !== null, `hexParaHsv de ${hex} não deve falhar`)
      assertNotNaN(hsv!.h)
      assertNotNaN(hsv!.s)
      assertNotNaN(hsv!.v)

      const roundTrip = colord(hsv!).toHex().toUpperCase()
      assertEqual(roundTrip, hex, `Round-trip de ${hex} deve ser exato bit a bit`)
    }
  })

  test('hexParaHsv: 50 cores randômicas verificando roundtrip e ausência de NaN', () => {
    for (let i = 0; i < 50; i++) {
      const r = Math.floor(Math.random() * 256)
      const g = Math.floor(Math.random() * 256)
      const b = Math.floor(Math.random() * 256)
      const hex = colord({ r, g, b }).toHex().toUpperCase()

      const hsv = hexParaHsv(hex)
      assert(hsv !== null, `hexParaHsv falhou para ${hex}`)
      assertNotNaN(hsv!.h, `Hue NaN para ${hex}`)
      assertNotNaN(hsv!.s, `Sat NaN para ${hex}`)
      assertNotNaN(hsv!.v, `Val NaN para ${hex}`)

      const volta = colord(hsv!).toHex().toUpperCase()
      assertEqual(volta, hex, `Inconsistência de ida e volta para ${hex}`)
    }
  })

  test('numeros: extrai inteiros, decimais e negativos ignorando caracteres de ruído', () => {
    const r1 = numeros('rgb(240, 118, 58)')
    assertEqual(r1.length, 3)
    assertEqual(r1[0], 240)
    assertEqual(r1[1], 118)
    assertEqual(r1[2], 58)

    const r2 = numeros('hsl(20deg, 84%, 58.5%)')
    assertEqual(r2.length, 3)
    assertEqual(r2[0], 20)
    assertEqual(r2[1], 84)
    assertEqual(r2[2], 58.5)

    const r3 = numeros('-10.5, 20, -30')
    assertEqual(r3[0], -10.5)
    assertEqual(r3[1], 20)
    assertEqual(r3[2], -30)

    const r4 = numeros('sem numeros nenhum')
    assertEqual(r4.length, 0)
  })

  test('Entradas inválidas retornam null sem quebrar nem gerar NaN', () => {
    assertEqual(hexParaHsv(''), null, 'Vazio deve ser null')
    assertEqual(hexParaHsv('cor-invalida'), null, 'Texto qualquer deve ser null')
    assertEqual(hexParaHsv('#12345'), null, 'HEX de 5 dígitos deve ser null')
    assertEqual(hexParaHsv('#GGGGGG'), null, 'Letras fora do hex devem ser null')

    assertEqual(hexTolerante(''), null)
    assertEqual(hexTolerante('banana'), null)
    assertEqual(hexTolerante('#12'), null)

    assertEqual(rgbTolerante(''), null)
    assertEqual(rgbTolerante('12, 34'), null) // menos de 3 números

    assertEqual(hslTolerante(''), null)
    assertEqual(hslTolerante('50%'), null) // menos de 3 números

    assertEqual(cmykTolerante(''), null)
    assertEqual(cmykTolerante('10, 20, 30'), null) // menos de 4 números

    assertEqual(interpretarCampo('hex', 'desconhecido'), null)
    assertEqual(interpretarCampo('rgb', 'abc'), null)
  })

  test('formatarCampo: nunca devolve NaN na representação de qualquer formato', () => {
    const coresTeste = ['#F0763A', '#000000', '#FFFFFF', '#123456', '#ABCDEF']
    const formatos: ('hex' | 'rgb' | 'hsl' | 'cmyk')[] = ['hex', 'rgb', 'hsl', 'cmyk']

    for (const hex of coresTeste) {
      for (const formato of formatos) {
        const texto = formatarCampo(hex, formato)
        assert(!texto.includes('NaN'), `formatarCampo(${hex}, "${formato}") continha "NaN": "${texto}"`)
        assert(texto.length > 0, `formatarCampo não deve ser vazio para ${formato}`)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// SUÍTE 4: CÁLCULO DE CONTRASTE E ACESSIBILIDADE
// ---------------------------------------------------------------------------

suite('4. Contraste e Acessibilidade (tintaSobre)', () => {
  test('tintaSobre: fundos claros pedem tinta escura', () => {
    assertEqual(tintaSobre('#FFFFFF'), 'escura', 'Fundo branco exige tinta escura')
    assertEqual(tintaSobre('#F8F9FA'), 'escura', 'Cinza muito claro exige tinta escura')
    assertEqual(tintaSobre('#FEF3C7'), 'escura', 'Amarelo claro pastel exige tinta escura')
    assertEqual(tintaSobre('#FFFF00'), 'escura', 'Amarelo saturado luminoso exige tinta escura')
  })

  test('tintaSobre: fundos escuros pedem tinta clara', () => {
    assertEqual(tintaSobre('#000000'), 'clara', 'Fundo preto exige tinta clara')
    assertEqual(tintaSobre('#0F1230'), 'clara', 'Fundo escuro profundo exige tinta clara')
    assertEqual(tintaSobre('#1E293B'), 'clara', 'Azul escuro ardósia exige tinta clara')
    assertEqual(tintaSobre('#000080'), 'clara', 'Azul marinho escuro exige tinta clara')
    assertEqual(tintaSobre('#7F1D1D'), 'clara', 'Vermelho escuro profundo exige tinta clara')
  })

  test('colord a11y: cálculo de contraste WCAG é consistente e válido', () => {
    const contrasteMax = colord('#000000').contrast('#FFFFFF')
    assertClose(contrasteMax, 21, 0.5, 'Contraste máximo entre preto e branco deve ser ~21:1')

    const contrasteMin = colord('#FFFFFF').contrast('#FFFFFF')
    assertClose(contrasteMin, 1, 0.01, 'Contraste de uma cor com ela mesma deve ser 1:1')

    // Testar que nenhuma operação gera NaN
    const c1 = colord('#F0763A').contrast('#0F1230')
    const c2 = colord('#F0763A').contrast('#EDEFFB')
    assertNotNaN(c1, 'Contraste com tinta escura')
    assertNotNaN(c2, 'Contraste com tinta clara')
  })
})

// ---------------------------------------------------------------------------
// SUÍTE 5: SIMULAÇÃO DE DALTONISMO (CVD)
// ---------------------------------------------------------------------------

suite('5. Simulação de Daltonismo', () => {
  test('simular com tipo null retorna a cor original normalizada', () => {
    assertEqual(simular('#f0763a', null), '#F0763A')
    assertEqual(simular('#00ff00', null), '#00FF00')
  })

  test('simular: preto e branco absolutos permanecem invariantes em todos os tipos', () => {
    const tipos: (TipoVisao | null)[] = ['protanopia', 'deuteranopia', 'tritanopia', 'acromatopsia']

    for (const tipo of tipos) {
      const resPreto = simular('#000000', tipo)
      assertEqual(resPreto, '#000000', `Preto na visão ${tipo} deve ser #000000`)

      const resBranco = simular('#FFFFFF', tipo)
      assertEqual(resBranco, '#FFFFFF', `Branco na visão ${tipo} deve ser #FFFFFF`)
    }
  })

  test('simular acromatopsia: os 3 canais RGB resultantes devem ser idênticos (escala de cinza pura)', () => {
    const amostras = ['#FF0000', '#00FF00', '#0000FF', '#F0763A', '#3B82F6', '#9333EA']

    for (const hex of amostras) {
      const res = simular(hex, 'acromatopsia')
      assertValidHex(res, `Resultado da acromatopsia de ${hex}`)

      const { r, g, b } = colord(res).toRgb()
      assertEqual(r, g, `Canal R deve ser igual a G na acromatopsia de ${hex}`)
      assertEqual(g, b, `Canal G deve ser igual a B na acromatopsia de ${hex}`)
    }
  })

  test('simular: imunidade a NaN e clipping seguro de gamut em 25 cores diversas em todos os tipos', () => {
    const cores = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF',
      '#F0763A', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B',
      '#E11D48', '#D97706', '#059669', '#0284C7', '#4F46E5', '#C026D3',
      '#1E293B', '#F8FAFC', '#78350F', '#064E3B', '#1E3A8A', '#581C87',
      '#881337',
    ]

    const tipos: TipoVisao[] = ['protanopia', 'deuteranopia', 'tritanopia', 'acromatopsia']

    for (const cor of cores) {
      for (const tipo of tipos) {
        const sim = simular(cor, tipo)
        assertValidHex(sim, `Simulação de ${cor} para ${tipo}`)
        const { r, g, b } = colord(sim).toRgb()
        assertNotNaN(r)
        assertNotNaN(g)
        assertNotNaN(b)
        assert(r >= 0 && r <= 255, `R fora de [0, 255]: ${r}`)
        assert(g >= 0 && g <= 255, `G fora de [0, 255]: ${g}`)
        assert(b >= 0 && b <= 255, `B fora de [0, 255]: ${b}`)
      }
    }
  })

  test('VISOES contém 5 definições incluindo a visão típica', () => {
    assertEqual(VISOES.length, 5)
    assertEqual(VISOES[0].tipo, null)
    assertEqual(VISOES[1].tipo, 'protanopia')
    assertEqual(VISOES[2].tipo, 'deuteranopia')
    assertEqual(VISOES[3].tipo, 'tritanopia')
    assertEqual(VISOES[4].tipo, 'acromatopsia')
  })
})

// ---------------------------------------------------------------------------
// SUÍTE 6: HARMONIAS CROMÁTICAS
// ---------------------------------------------------------------------------

suite('6. Harmonias Cromáticas (harmonies.ts)', () => {
  const hslBase = { h: 30, s: 80, l: 50 }

  test('ACORDES contém os 5 tipos definidos', () => {
    assertEqual(ACORDES.length, 5)
    const tipos = ACORDES.map((a) => a.tipo)
    assert(tipos.includes('analoga'), 'Deve conter análoga')
    assert(tipos.includes('complementar'), 'Deve conter complementar')
    assert(tipos.includes('dividida'), 'Deve conter complementar dividida')
    assert(tipos.includes('triade'), 'Deve conter tríade')
    assert(tipos.includes('mono'), 'Deve conter monocromática')
  })

  test('gerarAcorde retorna o número exato de cores para cada tipo', () => {
    assertEqual(gerarAcorde(hslBase, 'analoga').length, 5)
    assertEqual(gerarAcorde(hslBase, 'complementar').length, 2)
    assertEqual(gerarAcorde(hslBase, 'dividida').length, 3)
    assertEqual(gerarAcorde(hslBase, 'triade').length, 3)
    assertEqual(gerarAcorde(hslBase, 'mono').length, 5)
  })

  test('gerarAcorde preserva hexBase exato no passo 0 das harmonias por matiz', () => {
    const hexAtivo = '#F0763A'
    const complementar = gerarAcorde(hslBase, 'complementar', hexAtivo)
    assertEqual(complementar[0], hexAtivo, 'Passo 0 da complementar deve ser o hexBase exato')

    const analoga = gerarAcorde(hslBase, 'analoga', hexAtivo)
    assertEqual(analoga[2], hexAtivo, 'Passo 0 (índice 2) da análoga deve ser o hexBase exato')
  })

  test('gerarAcorde com tipo inválido devolve array vazio sem erro', () => {
    const res = gerarAcorde(hslBase, 'inexistente' as TipoAcorde)
    assertEqual(res.length, 0)
  })
})

// ---------------------------------------------------------------------------
// SUÍTE 7: STORE DE ESTADO DE COR (useColorStore)
// ---------------------------------------------------------------------------

suite('7. Store useColorStore e Histórico de Recentes', () => {
  test('setFromHex atualiza o HSV com sucesso para HEX válido', () => {
    useColorStore.getState().setFromHex('#3B82F6')
    const hexAtual = colord(useColorStore.getState().hsv).toHex().toUpperCase()
    assertEqual(hexAtual, '#3B82F6', 'Store deve refletir #3B82F6 após setFromHex')
  })

  test('setFromHex ignora valores inválidos mantendo o estado anterior', () => {
    useColorStore.getState().setFromHex('#FF0000')
    const hsvAntes = { ...useColorStore.getState().hsv }

    useColorStore.getState().setFromHex('nao-e-hex')
    assertEqual(useColorStore.getState().hsv.h, hsvAntes.h, 'Matiz não deve mudar com HEX inválido')
    assertEqual(useColorStore.getState().hsv.s, hsvAntes.s, 'Saturação não deve mudar com HEX inválido')
    assertEqual(useColorStore.getState().hsv.v, hsvAntes.v, 'Brilho não deve mudar com HEX inválido')
  })

  test('commitColor gerencia histórico de até 12 cores sem duplicação consecutiva', () => {
    // Limpar histórico para o teste
    useColorStore.setState({ recentColors: [] })

    // Adicionar cor 1
    useColorStore.getState().setFromHex('#FF0000')
    useColorStore.getState().commitColor()
    assertEqual(useColorStore.getState().recentColors.length, 1)
    assertEqual(useColorStore.getState().recentColors[0], '#FF0000')

    // Commit consecutivo da MESMA cor não deve duplicar
    useColorStore.getState().commitColor()
    assertEqual(useColorStore.getState().recentColors.length, 1, 'Não deve duplicar cor repetida no topo')

    // Adicionar cor 2
    useColorStore.getState().setFromHex('#00FF00')
    useColorStore.getState().commitColor()
    assertEqual(useColorStore.getState().recentColors.length, 2)
    assertEqual(useColorStore.getState().recentColors[0], '#00FF00')
    assertEqual(useColorStore.getState().recentColors[1], '#FF0000')

    // Re-adicionar #FF0000: deve movê-la para a frente sem duplicar
    useColorStore.getState().setFromHex('#FF0000')
    useColorStore.getState().commitColor()
    assertEqual(useColorStore.getState().recentColors.length, 2)
    assertEqual(useColorStore.getState().recentColors[0], '#FF0000')
    assertEqual(useColorStore.getState().recentColors[1], '#00FF00')

    // Adicionar 15 cores para testar limite máximo de 12
    const paletaTeste = [
      '#111111', '#222222', '#333333', '#444444',
      '#555555', '#666666', '#777777', '#888888',
      '#999999', '#AAAAAA', '#BBBBBB', '#CCCCCC',
      '#DDDDDD', '#EEEEEE', '#FFFFFF',
    ]

    for (const c of paletaTeste) {
      useColorStore.getState().setFromHex(c)
      useColorStore.getState().commitColor()
    }

    assertEqual(useColorStore.getState().recentColors.length, 12, 'Histórico não pode ultrapassar 12 itens')
    assertEqual(useColorStore.getState().recentColors[0], '#FFFFFF', 'Mais recente deve ser a primeira')
  })
})

// ---------------------------------------------------------------------------
// SUÍTE 8: EXPORTAÇÃO E UTILITÁRIOS (exportar.ts)
// ---------------------------------------------------------------------------

suite('8. Exportação e Slugs (exportar.ts)', () => {
  test('slugDe lida com acentuação, caracteres especiais e nomes vazios', () => {
    assertEqual(slugDe('Café Azul'), 'cafe-azul')
    assertEqual(slugDe('São Paulo & Rio'), 'sao-paulo-rio')
    assertEqual(slugDe('  Espaços   múltiplos  '), 'espacos-multiplos')
    assertEqual(slugDe('Paleta #01 / Verão 2026!'), 'paleta-01-verao-2026')
    assertEqual(slugDe('---'), 'paleta', 'Sem caracteres válidos deve devolver "paleta"')
    assertEqual(slugDe(''), 'paleta', 'String vazia deve devolver "paleta"')
  })

  test('slugsUnicos desambigua colisões com sufixos sequenciais', () => {
    const paletas = [
      { name: 'Primária' },
      { name: 'Primária' },
      { name: 'Primária' },
      { name: 'Secundária' },
    ]
    const slugs = slugsUnicos(paletas)
    assertEqual(slugs[0], 'primaria')
    assertEqual(slugs[1], 'primaria-2')
    assertEqual(slugs[2], 'primaria-3')
    assertEqual(slugs[3], 'secundaria')
  })

  test('gerarCss, gerarTailwind, gerarJson e gerarTypeScript produzem texto válido', () => {
    const entrada = {
      corAtiva: {
        hex: '#F0763A',
        rgb: { r: 240, g: 118, b: 58 },
        hsl: { h: 20, s: 84, l: 58 },
      },
      paletas: [
        {
          id: 'p1',
          name: 'Tema Solar',
          colors: [
            { hex: '#F0763A', name: 'Laranja', position: 0 },
            { hex: '#FFB800', name: 'Amarelo', position: 1 },
          ],
          createdAt: '',
          updatedAt: '',
        },
      ],
    }

    const css = gerarCss(entrada)
    assert(css.includes('--cor-ativa: #F0763A;'), 'CSS deve conter --cor-ativa')
    assert(css.includes('--paleta-tema-solar-1: #F0763A;'), 'CSS deve conter token da paleta')

    const tailwind = gerarTailwind(entrada)
    assert(tailwind.includes('@theme {'), 'Tailwind v4 deve usar @theme')
    assert(tailwind.includes('--color-cor-ativa: #F0763A;'), 'Tailwind deve conter cor ativa')

    const jsonStr = gerarJson(entrada)
    const parsed = JSON.parse(jsonStr)
    assertEqual((parsed['cor-ativa'] as { $value: string }).$value, '#F0763A')

    const ts = gerarTypeScript(entrada)
    assert(ts.includes('export const lumen = {'), 'TypeScript deve exportar lumen')
    assert(ts.includes('as const'), 'TypeScript deve usar "as const"')
  })

  test('Exportadores funcionam corretamente mesmo quando corAtiva é null', () => {
    const entradaSemCorAtiva = {
      corAtiva: null,
      paletas: [
        {
          id: 'p1',
          name: 'Minimal',
          colors: [{ hex: '#000000', name: 'Preto', position: 0 }],
          createdAt: '',
          updatedAt: '',
        },
      ],
    }

    const css = gerarCss(entradaSemCorAtiva)
    assert(!css.includes('--cor-ativa:'), 'CSS não deve conter --cor-ativa quando null')
    assert(css.includes('--paleta-minimal-1: #000000;'), 'CSS deve conter token da paleta minimal')

    const json = JSON.parse(gerarJson(entradaSemCorAtiva))
    assert(!('cor-ativa' in json), 'JSON não deve conter cor-ativa quando null')
  })
})

// ---------------------------------------------------------------------------
// RELATÓRIO FINAL E STATUS DE SAÍDA
// ---------------------------------------------------------------------------

function printReport() {
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const suitesCount = new Set(results.map((r) => r.suite)).size

  console.log('\n' + colors.bold + colors.cyan + '════════════════════════════════════════════════════════════════════════' + colors.reset)
  console.log(colors.bold + '   RELATÓRIO DE EXECUÇÃO DOS TESTES UNITÁRIOS — LUMEN' + colors.reset)
  console.log(colors.bold + colors.cyan + '════════════════════════════════════════════════════════════════════════' + colors.reset + '\n')

  let lastSuite = ''
  for (const r of results) {
    if (r.suite !== lastSuite) {
      console.log(`\n${colors.bold}${colors.blue}▸ ${r.suite}${colors.reset}`)
      lastSuite = r.suite
    }

    if (r.passed) {
      console.log(
        `  ${colors.green}✓${colors.reset} ${r.name} ${colors.dim}(${r.durationMs.toFixed(2)}ms)${colors.reset}`
      )
    } else {
      console.log(`  ${colors.red}✗ ${r.name}${colors.reset} ${colors.dim}(${r.durationMs.toFixed(2)}ms)${colors.reset}`)
      console.log(`    ${colors.red}Erro: ${r.error}${colors.reset}`)
    }
  }

  console.log('\n' + colors.bold + colors.cyan + '────────────────────────────────────────────────────────────────────────' + colors.reset)
  console.log(
    `${colors.bold}Suítes:${colors.reset}   ${suitesCount} avaliadas\n` +
    `${colors.bold}Testes:${colors.reset}   ${passed === total ? colors.green : colors.yellow}${passed} passaram${colors.reset}, ` +
    `${failed > 0 ? colors.red + `${failed} falharam` + colors.reset : '0 falharam'}, ` +
    `${total} total\n` +
    `${colors.bold}Status:${colors.reset}   ${failed === 0 ? colors.green + '✓ TODOS OS TESTES PASSARAM COM SUCESSO!' : colors.red + '✗ FALHA NOS TESTES'}${colors.reset}`
  )
  console.log(colors.bold + colors.cyan + '════════════════════════════════════════════════════════════════════════' + colors.reset + '\n')

  if (failed > 0) {
    throw new Error(`${failed} teste(s) falharam.`)
  }
}

printReport()
