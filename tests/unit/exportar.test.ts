import { describe, expect, it } from 'vitest'
import { gerarCss, gerarJson, gerarTailwind, gerarTypeScript, slugDe, slugsUnicos } from '../../src/lib/color/exportar'

describe('Exportação e Slugs (exportar.ts)', () => {
  it('slugDe lida com acentuação, caracteres especiais e nomes vazios', () => {
    expect(slugDe('Café Azul')).toBe('cafe-azul')
    expect(slugDe('São Paulo & Rio')).toBe('sao-paulo-rio')
    expect(slugDe('  Espaços   múltiplos  ')).toBe('espacos-multiplos')
    expect(slugDe('Paleta #01 / Verão 2026!')).toBe('paleta-01-verao-2026')
    expect(slugDe('---'), 'sem caracteres válidos').toBe('paleta')
    expect(slugDe(''), 'string vazia').toBe('paleta')
  })

  it('slugsUnicos desambigua colisões com sufixos sequenciais', () => {
    const paletas = [{ name: 'Primária' }, { name: 'Primária' }, { name: 'Primária' }, { name: 'Secundária' }]
    expect(slugsUnicos(paletas)).toEqual(['primaria', 'primaria-2', 'primaria-3', 'secundaria'])
  })

  it('gerarCss, gerarTailwind, gerarJson e gerarTypeScript produzem texto válido', () => {
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
    expect(css).toContain('--cor-ativa: #F0763A;')
    expect(css).toContain('--paleta-tema-solar-1: #F0763A;')

    const tailwind = gerarTailwind(entrada)
    expect(tailwind, 'Tailwind v4 deve usar @theme').toContain('@theme {')
    expect(tailwind).toContain('--color-cor-ativa: #F0763A;')

    const json = JSON.parse(gerarJson(entrada))
    expect((json['cor-ativa'] as { $value: string }).$value).toBe('#F0763A')

    const ts = gerarTypeScript(entrada)
    expect(ts).toContain('export const lumen = {')
    expect(ts).toContain('as const')
  })

  it('exportadores funcionam quando corAtiva é null', () => {
    const entrada = {
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

    const css = gerarCss(entrada)
    expect(css).not.toContain('--cor-ativa:')
    expect(css).toContain('--paleta-minimal-1: #000000;')

    expect(JSON.parse(gerarJson(entrada))).not.toHaveProperty('cor-ativa')
  })
})
