import type { HslColor, RgbColor } from './setup'
import type { Palette } from '@/types/palette'

/**
 * Geradores de código para exportar cores. Funções puras: recebem dados,
 * devolvem texto. Nomes de paleta nunca entram no código como identificador:
 * o identificador vem do slug (só a-z, 0-9 e hífen) e o nome, quando aparece,
 * passa por JSON.stringify.
 */

export interface EntradaExportacao {
  /** null quando o escopo não inclui a cor ativa */
  corAtiva: { hex: string; rgb: Pick<RgbColor, 'r' | 'g' | 'b'>; hsl: Pick<HslColor, 'h' | 's' | 'l'> } | null
  paletas: Palette[]
}

/** "Café Azul" → "cafe-azul"; sem caracteres aproveitáveis → "paleta". */
export function slugDe(nome: string): string {
  const slug = nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'paleta'
}

/** Um slug por paleta, na ordem recebida; repetidos ganham -2, -3… sem colidir com slugs naturais. */
export function slugsUnicos(paletas: Pick<Palette, 'name'>[]): string[] {
  const usados = new Set<string>()
  return paletas.map((p) => {
    const base = slugDe(p.name)
    let candidato = base
    for (let n = 2; usados.has(candidato); n++) candidato = `${base}-${n}`
    usados.add(candidato)
    return candidato
  })
}

const rgbTexto = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`
const hslTexto = ({ h, s, l }: { h: number; s: number; l: number }) =>
  `${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%`

/** Cores de uma paleta em ordem, já com o slug e o índice (base 1) do token. */
function tokensDePaletas({ paletas }: EntradaExportacao) {
  const slugs = slugsUnicos(paletas)
  return paletas.map((paleta, i) => ({ paleta, slug: slugs[i], cores: paleta.colors.map((c) => c.hex.toUpperCase()) }))
}

export function gerarCss(entrada: EntradaExportacao): string {
  const linhas: string[] = []
  const { corAtiva } = entrada
  if (corAtiva) {
    linhas.push(`  --cor-ativa: ${corAtiva.hex};`)
    linhas.push(`  --cor-ativa-rgb: ${rgbTexto(corAtiva.rgb)};`)
    linhas.push(`  --cor-ativa-hsl: ${hslTexto(corAtiva.hsl)};`)
  }
  for (const { slug, cores } of tokensDePaletas(entrada)) {
    if (linhas.length > 0 && cores.length > 0) linhas.push('')
    cores.forEach((hex, i) => linhas.push(`  --paleta-${slug}-${i + 1}: ${hex};`))
  }
  return `:root {\n${linhas.join('\n')}${linhas.length ? '\n' : ''}}\n`
}

export function gerarTailwind(entrada: EntradaExportacao): string {
  const linhas: string[] = []
  if (entrada.corAtiva) linhas.push(`  --color-cor-ativa: ${entrada.corAtiva.hex};`)
  for (const { slug, cores } of tokensDePaletas(entrada)) {
    if (linhas.length > 0 && cores.length > 0) linhas.push('')
    cores.forEach((hex, i) => linhas.push(`  --color-${slug}-${i + 1}: ${hex};`))
  }
  return `@theme {\n${linhas.join('\n')}${linhas.length ? '\n' : ''}}\n`
}

/** Design tokens no formato W3C (DTCG): grupos com `$type` herdado e `$value` por token. */
export function gerarJson(entrada: EntradaExportacao): string {
  const raiz: Record<string, unknown> = {}
  if (entrada.corAtiva) raiz['cor-ativa'] = { $type: 'color', $value: entrada.corAtiva.hex }
  const paletas: Record<string, unknown> = {}
  for (const { paleta, slug, cores } of tokensDePaletas(entrada)) {
    const grupo: Record<string, unknown> = { $type: 'color', $description: paleta.name }
    cores.forEach((hex, i) => {
      grupo[String(i + 1)] = { $value: hex }
    })
    paletas[slug] = grupo
  }
  raiz.paletas = paletas
  return `${JSON.stringify(raiz, null, 2)}\n`
}

export function gerarTypeScript(entrada: EntradaExportacao): string {
  const { corAtiva } = entrada
  const q = (v: string) => JSON.stringify(v)
  const linhas: string[] = ['export const lumen = {']
  if (corAtiva) {
    linhas.push('  corAtiva: {')
    linhas.push(`    hex: ${q(corAtiva.hex)},`)
    linhas.push(`    rgb: ${q(`rgb(${rgbTexto(corAtiva.rgb)})`)},`)
    linhas.push(`    hsl: ${q(`hsl(${hslTexto(corAtiva.hsl)})`)},`)
    linhas.push('  },')
  }
  linhas.push('  paletas: {')
  for (const { paleta, slug, cores } of tokensDePaletas(entrada)) {
    linhas.push(`    ${q(slug)}: {`)
    linhas.push(`      nome: ${q(paleta.name)},`)
    linhas.push(`      cores: [${cores.map(q).join(', ')}],`)
    linhas.push('    },')
  }
  linhas.push('  },')
  linhas.push('} as const')
  return `${linhas.join('\n')}\n`
}
