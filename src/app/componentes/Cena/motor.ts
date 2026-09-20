/**
 * Motor da cena: uma cidade à noite vista através de uma janela com chuva,
 * desenhada em canvas a partir dos tokens do :root.
 *
 * `criarCena` é uma fábrica: todo o estado (luzes, balões, chuva, rAF,
 * dimensões...) vive no closure de cada instância. Nada em escopo de módulo e
 * nenhum listener é registrado no import, então dois mounts do React
 * StrictMode geram duas instâncias independentes e o `destruir()` da primeira
 * desfaz tudo o que ela criou.
 */
import type { Qualidade } from './qualidade'

const M = 32 // margem extra em cada borda: a janela do navegador pode variar sem deixar vazios
const SEMENTE = 20260919
const QUADROS_MEDIDOS = 90
const LIMITE_P95_MS = 22

interface Nivel {
  dprMax: number
  riscos: number
  gotas: number
  movimento: boolean
}

const NIVEIS: Record<Exclude<Qualidade, 'off'>, Nivel> = {
  alta: { dprMax: 1.25, riscos: 60, gotas: 7, movimento: true },
  media: { dprMax: 1, riscos: 40, gotas: 5, movimento: true },
  baixa: { dprMax: 1, riscos: 35, gotas: 5, movimento: true },
}

export interface OpcoesCena {
  cena: HTMLCanvasElement
  vidro: HTMLCanvasElement
  /** Ausente no nível `baixa`: sem canvas de movimento não há rAF. */
  movimento: HTMLCanvasElement | null
  qualidade: Qualidade
  /** Chamado quando cena e vidro terminaram o primeiro desenho. */
  aoPronto?: () => void
  /** Chamado uma vez se o p95 do tempo de quadro passar de 22 ms nos primeiros 90 quadros. */
  aoDegradar?: () => void
}

export interface Cena {
  destruir: () => void
  /** Redesenha a cena no nível pedido, sem vazar memória. */
  definirQualidade: (q: Qualidade) => void
  /** Suspende o rAF (ex.: durante o arraste da roda). */
  pausar: () => void
  retomar: () => void
}

/* ── utilitários puros ── */

function rgbDe(s: string): [number, number, number] {
  s = String(s).trim()
  if (s.charAt(0) === '#') {
    let h = s.slice(1)
    if (h.length === 3) h = h.replace(/./g, '$&$&')
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]
  }
  const m = s.match(/[\d.]+/g)
  if (!m || m.length < 3) return [0, 0, 0]
  return [+m[0], +m[1], +m[2]]
}

function rgba(s: string, a: number): string {
  const c = rgbDe(s)
  return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + a + ')'
}

function semente(a: number): () => number {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function passo(a: number, b: number, x: number): number {
  x = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

/* ruído de valor, para as nuvens */
function hash(x: number, y: number, s: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453
  return n - Math.floor(n)
}
function vnoise(x: number, y: number, s: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
function fbm(x: number, y: number, s: number): number {
  let t = 0, amp = 0.5, f = 1
  for (let i = 0; i < 5; i++) {
    t += amp * vnoise(x * f, y * f, s + i)
    f *= 2
    amp *= 0.5
  }
  return t
}

function halo(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, cor: string, a: number) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  g.addColorStop(0, rgba(cor, a))
  g.addColorStop(1, rgba(cor, 0))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, rx, 0, 6.2832)
  ctx.fill()
  ctx.restore()
}

function p95(v: number[]): number {
  const o = v.slice().sort((a, b) => a - b)
  return o[Math.max(0, Math.ceil(o.length * 0.95) - 1)]
}

/* ── tipos internos ── */

interface Luz { x: number; y: number; c: string }
interface Balao { x: number; y: number; ph: number }
interface Pisca { x: number; y: number; w: number; h: number; c: string; ph: number }
interface Risco { x: number; y: number; len: number; v: number; a: number; w: number }
interface GotaMov { x: number; y: number; y0: number; r: number; v: number; fr: number; ph: number; fase: number }
interface OpcCamada {
  base: number; hMin: number; hMax: number; lMin: number; lMax: number
  cor: string; topo: string; rim: number; jp: number; jw: number; jh: number
  gx: number; gy: number; brilho: number; gapB: number; ate: number
  ant: boolean; cand: number; pisca: boolean; vidraca: boolean; rua: boolean
}

const NOMES_TOKENS = [
  'ceu-1', 'ceu-2', 'ceu-3', 'ceu-4', 'ceu-5', 'ceu-6', 'nuvem-fria', 'nuvem-morna', 'neblina',
  'predio-longe', 'predio-longe-topo', 'predio-meio', 'predio-meio-topo', 'predio-perto', 'predio-perto-topo',
  'rim-rgb', 'aviso', 'lampada', 'chuva', 'brilho-vidro', 'escuro-rgb', 'luz-quente', 'luz-ambar',
  'luz-fria', 'luz-rosa', 'luz-verde',
]
const PESOS: ReadonlyArray<readonly ['q' | 'a' | 'f' | 'r' | 'v', number]> = [
  ['q', 0.52], ['a', 0.2], ['f', 0.17], ['r', 0.06], ['v', 0.05],
]

export function criarCena(opts: OpcoesCena): Cena {
  const { cena: cCena, vidro: cVidro } = opts
  const cMov = opts.movimento
  const todos = [cCena, cVidro, cMov].filter((c): c is HTMLCanvasElement => c !== null)

  const reduz = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  /* estado da instância */
  let qualidade = opts.qualidade
  let nivel: Nivel | null = qualidade === 'off' ? null : NIVEIS[qualidade]
  const P: Record<string, string> = {}
  let L = { q: '', a: '', f: '', r: '', v: '' }
  let W = 0, Hh = 0, dpr = 1
  let luzes: Luz[] = []
  let baloes: Balao[] = []
  let piscas: Pisca[] = []
  let chuva: Risco[] = []
  let gotasMov: GotaMov[] = []
  let raf = 0
  let ultimo = 0
  let tmr: ReturnType<typeof setTimeout> | null = null
  let destruida = false
  let pausado = false
  let amostras: number[] = []
  let medindo = false
  let degradou = false

  function lerTokens() {
    const cs = getComputedStyle(document.documentElement)
    NOMES_TOKENS.forEach((n) => { P[n] = cs.getPropertyValue('--' + n).trim() })
    L = { q: P['luz-quente'], a: P['luz-ambar'], f: P['luz-fria'], r: P['luz-rosa'], v: P['luz-verde'] }
  }

  function corLuz(rng: () => number): string {
    const x = rng()
    let acc = 0
    for (let i = 0; i < PESOS.length; i++) {
      acc += PESOS[i][1]
      if (x <= acc) return L[PESOS[i][0]]
    }
    return L.q
  }

  function nuvens(
    ctx: CanvasRenderingContext2D, w: number, hReg: number, seed: number, limiar: number, escala: number,
    forca: number, tomFrio: string, tomMorno: string, dePartida: number,
  ) {
    const esc = 5, cw = Math.ceil(w / esc), ch = Math.ceil(hReg / esc)
    const off = document.createElement('canvas')
    off.width = cw
    off.height = ch
    const o = off.getContext('2d')
    if (!o) return
    const img = o.createImageData(cw, ch), d = img.data
    const fria = rgbDe(tomFrio), morna = rgbDe(tomMorno)
    for (let y = 0; y < ch; y++) {
      const ty = y / ch
      for (let x = 0; x < cw; x++) {
        const n = fbm(x * 0.016 * escala + 3, y * 0.055 * escala + 7, seed)
        const cov = passo(limiar, limiar + 0.34, n)
        const faixa = Math.sin(Math.min(1, ty * 1.04) * Math.PI * 0.92)
        let a = cov * (0.12 + 0.78 * faixa) * forca
        if (ty < dePartida) a *= passo(0, dePartida, ty)
        const t = Math.pow(ty, 1.5), i = (y * cw + x) * 4
        d[i] = fria[0] + (morna[0] - fria[0]) * t
        d[i + 1] = fria[1] + (morna[1] - fria[1]) * t
        d[i + 2] = fria[2] + (morna[2] - fria[2]) * t
        d[i + 3] = a * 255
      }
    }
    o.putImageData(img, 0, 0)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(off, 0, 0, w, hReg)
    off.width = 0
    off.height = 0
  }

  function camada(ctx: CanvasRenderingContext2D, o: OpcCamada, rng: () => number) {
    let x = -o.lMax * rng()
    while (x < W + 10) {
      const bw = o.lMin + rng() * (o.lMax - o.lMin)
      let bh = o.hMin + rng() * (o.hMax - o.hMin)
      if (rng() < 0.1) bh *= 1.45
      const top = o.base - bh
      const g = ctx.createLinearGradient(0, top, 0, o.base + bh * 0.5)
      g.addColorStop(0, o.topo)
      g.addColorStop(1, o.cor)
      ctx.fillStyle = g
      ctx.fillRect(x, top, bw, Hh - top)
      ctx.fillStyle = rgba(P['rim-rgb'], o.rim)
      ctx.fillRect(x, top, bw, 1)
      ctx.fillStyle = rgba(P['rim-rgb'], o.rim * 0.5)
      ctx.fillRect(x + bw - 1, top, 1, Hh - top)
      if (rng() < 0.32) {
        const sw = bw * (0.42 + 0.3 * rng()), sh = 6 + bh * 0.08
        ctx.fillStyle = o.topo
        ctx.fillRect(x + (bw - sw) / 2, top - sh, sw, sh + 1)
        ctx.fillStyle = rgba(P['rim-rgb'], o.rim)
        ctx.fillRect(x + (bw - sw) / 2, top - sh, sw, 1)
      }
      if (o.ant && rng() < 0.3) {
        const ax = x + bw * (0.2 + 0.6 * rng()), ah = 10 + rng() * Hh * 0.05
        ctx.fillStyle = o.topo
        ctx.fillRect(ax, top - ah, 1.3, ah)
        if (rng() < 0.75) baloes.push({ x: ax + 0.6, y: top - ah, ph: rng() * 6.28 })
      }
      const y0 = top + 6
      const cols = Math.max(1, Math.floor((bw - 6) / (o.jw + o.gx)))
      const rows = Math.floor((o.ate - y0) / (o.jh + o.gy))
      const offx = (bw - (cols * (o.jw + o.gx) - o.gx)) / 2
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wx = x + offx + c * (o.jw + o.gx), wy = y0 + r * (o.jh + o.gy)
          if (rng() > o.jp) {
            if (o.vidraca && rng() < 0.5) {
              ctx.fillStyle = rgba(P['rim-rgb'], 0.06)
              ctx.fillRect(wx, wy, o.jw, o.jh)
            }
            continue
          }
          const cor = corLuz(rng), a = 0.3 + 0.7 * rng()
          if (o.brilho && rng() < 0.35) {
            ctx.shadowColor = rgba(cor, 0.85)
            ctx.shadowBlur = o.brilho
          } else {
            ctx.shadowBlur = 0
          }
          ctx.fillStyle = rgba(cor, a)
          ctx.fillRect(wx, wy, o.jw, o.jh)
          if (o.cand && a > 0.72 && rng() < o.cand) luzes.push({ x: wx + o.jw / 2, y: wy + o.jh / 2, c: cor })
          if (o.pisca && rng() < 0.005) piscas.push({ x: wx, y: wy, w: o.jw, h: o.jh, c: cor, ph: rng() * 20 })
        }
      }
      ctx.shadowBlur = 0
      const gap = rng() * o.gapB
      if (o.rua && gap > 16) rua(ctx, x + bw, gap, o, rng)
      x += bw + gap
    }
  }

  function rua(ctx: CanvasRenderingContext2D, gx: number, g: number, o: OpcCamada, rng: () => number) {
    const topR = o.base - Hh * 0.04
    const lg = ctx.createLinearGradient(0, topR, 0, Hh)
    lg.addColorStop(0, rgba(L.a, 0))
    lg.addColorStop(0.5, rgba(L.a, 0.16))
    lg.addColorStop(1, rgba(L.q, 0.36))
    ctx.fillStyle = lg
    ctx.fillRect(gx, topR, g, Hh - topR)
    const n = 9
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), y = topR + (Hh - topR) * Math.pow(t, 1.6), r = 0.8 + 3.2 * t
      for (const f of [0.25, 0.75]) {
        ctx.shadowColor = rgba(L.q, 0.95)
        ctx.shadowBlur = 6 + 9 * t
        ctx.fillStyle = rgba(L.q, 0.92)
        ctx.beginPath()
        ctx.arc(gx + g * f, y, r, 0, 6.2832)
        ctx.fill()
        if (rng() < 0.4) luzes.push({ x: gx + g * f, y, c: L.q })
      }
    }
    ctx.shadowBlur = 0
  }

  function torre(ctx: CanvasRenderingContext2D, cx: number, base: number, alt: number) {
    const wb = alt * 0.052, wt = alt * 0.011, yd = base - alt * 0.64
    const g = ctx.createLinearGradient(cx - wb, 0, cx + wb, 0)
    g.addColorStop(0, P['predio-meio'])
    g.addColorStop(0.5, P['predio-meio-topo'])
    g.addColorStop(1, P['predio-meio'])
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(cx - wb, Hh)
    ctx.lineTo(cx - wb * 0.7, base)
    ctx.lineTo(cx - wt, yd)
    ctx.lineTo(cx + wt, yd)
    ctx.lineTo(cx + wb * 0.7, base)
    ctx.lineTo(cx + wb, Hh)
    ctx.closePath()
    ctx.fill()
    ctx.fillRect(cx - wb * 0.9, yd - alt * 0.03, wb * 1.8, alt * 0.032)
    ctx.fillRect(cx - wt * 0.9, base - alt, wt * 1.8, alt * 0.36)
    halo(ctx, cx, yd - alt * 0.014, alt * 0.2, alt * 0.13, L.q, 0.34)
    ctx.shadowColor = rgba(L.q, 0.95)
    ctx.shadowBlur = 16
    ctx.fillStyle = rgba(L.q, 0.96)
    ctx.fillRect(cx - wb * 0.9, yd - alt * 0.012, wb * 1.8, 2.6)
    ctx.fillRect(cx - wb * 0.72, yd - alt * 0.027, wb * 1.44, 1.7)
    ctx.shadowBlur = 0
    ctx.fillStyle = rgba(L.f, 0.35)
    ctx.fillRect(cx - 0.5, yd, 1, base - yd)
    baloes.push({ x: cx, y: base - alt, ph: 1.3 })
  }

  function desenharCena(rng: () => number) {
    const ctx = cCena.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, Hh)
    const Hz = Hh * 0.54
    const g = ctx.createLinearGradient(0, 0, 0, Hh * 0.8)
    g.addColorStop(0, P['ceu-1'])
    g.addColorStop(0.3, P['ceu-2'])
    g.addColorStop(0.52, P['ceu-3'])
    g.addColorStop(0.68, P['ceu-4'])
    g.addColorStop(0.84, P['ceu-5'])
    g.addColorStop(1, P['ceu-6'])
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, Hh)

    for (let s = 0; s < 90; s++) {
      ctx.fillStyle = rgba(P['brilho-vidro'], 0.18 + rng() * 0.5)
      ctx.fillRect(rng() * W, rng() * Hz * 0.62, rng() < 0.15 ? 1.6 : 1, rng() < 0.15 ? 1.6 : 1)
    }
    nuvens(ctx, W, Hz * 1.08, 11, 0.44, 1, 0.8, P['nuvem-fria'], P['nuvem-morna'], 0.06)
    nuvens(ctx, W, Hz * 1.08, 29, 0.55, 1.7, 0.55, P['nuvem-fria'], P['ceu-6'], 0.32)

    halo(ctx, W * 0.5, Hz, W * 0.62, Hh * 0.2, L.a, 0.5)
    halo(ctx, W * 0.24, Hz + Hh * 0.02, W * 0.36, Hh * 0.14, L.r, 0.22)
    halo(ctx, W * 0.8, Hz + Hh * 0.02, W * 0.34, Hh * 0.13, L.f, 0.14)

    camada(ctx, {
      base: Hz + Hh * 0.03, hMin: Hh * 0.05, hMax: Hh * 0.15, lMin: 18, lMax: 46, cor: P['predio-longe'],
      topo: P['predio-longe-topo'], rim: 0.1, jp: 0.22, jw: 2.4, jh: 3.4, gx: 2.6, gy: 3.6, brilho: 0,
      gapB: 6, ate: Hz + Hh * 0.03, ant: false, cand: 0, pisca: false, vidraca: false, rua: false,
    }, rng)

    const neb = ctx.createLinearGradient(0, Hz - Hh * 0.14, 0, Hz + Hh * 0.12)
    neb.addColorStop(0, rgba(P.neblina, 0))
    neb.addColorStop(0.6, rgba(P.neblina, 0.34))
    neb.addColorStop(1, rgba(P.neblina, 0))
    ctx.fillStyle = neb
    ctx.fillRect(0, Hz - Hh * 0.14, W, Hh * 0.26)

    torre(ctx, W * 0.455, Hz + Hh * 0.13, Hh * 0.4)

    camada(ctx, {
      base: Hz + Hh * 0.13, hMin: Hh * 0.06, hMax: Hh * 0.26, lMin: 26, lMax: 66, cor: P['predio-meio'],
      topo: P['predio-meio-topo'], rim: 0.16, jp: 0.34, jw: 3.4, jh: 5, gx: 3.2, gy: 5, brilho: 5,
      gapB: 8, ate: Hz + Hh * 0.15, ant: true, cand: 0.05, pisca: true, vidraca: true, rua: false,
    }, rng)

    const neb2 = ctx.createLinearGradient(0, Hz, 0, Hz + Hh * 0.3)
    neb2.addColorStop(0, rgba(P.neblina, 0))
    neb2.addColorStop(0.5, rgba(P.neblina, 0.18))
    neb2.addColorStop(1, rgba(P.neblina, 0))
    ctx.fillStyle = neb2
    ctx.fillRect(0, Hz, W, Hh * 0.3)

    camada(ctx, {
      base: Hz + Hh * 0.3, hMin: Hh * 0.1, hMax: Hh * 0.36, lMin: 42, lMax: 124, cor: P['predio-perto'],
      topo: P['predio-perto-topo'], rim: 0.22, jp: 0.28, jw: 5, jh: 8, gx: 5, gy: 7, brilho: 8,
      gapB: 64, ate: Hh, ant: true, cand: 0.05, pisca: true, vidraca: true, rua: true,
    }, rng)

    const f = ctx.createLinearGradient(0, Hh * 0.6, 0, Hh)
    f.addColorStop(0, rgba(L.q, 0))
    f.addColorStop(1, rgba(L.a, 0.14))
    ctx.fillStyle = f
    ctx.fillRect(0, Hh * 0.6, W, Hh * 0.4)
  }

  function lente(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    const rx = r, ry = r * 1.12, k = 0.5, sw = rx * 2 * k, sh = ry * 2 * k
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832)
    ctx.clip()
    ctx.translate(x, y)
    ctx.scale(-1, -1)
    ctx.drawImage(cCena, (x - sw / 2) * dpr, (y - sh / 2) * dpr, sw * dpr, sh * dpr, -rx, -ry, rx * 2, ry * 2)
    ctx.restore()
    const sombra = P['escuro-rgb']
    const g = ctx.createRadialGradient(x, y, rx * 0.3, x, y, rx * 1.04)
    g.addColorStop(0, rgba(sombra, 0))
    g.addColorStop(0.72, rgba(sombra, 0.2))
    g.addColorStop(1, rgba(sombra, 0.6))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832)
    ctx.fill()
    const c = ctx.createRadialGradient(x + rx * 0.1, y + ry * 0.62, 0, x + rx * 0.1, y + ry * 0.62, rx * 0.9)
    c.addColorStop(0, rgba(P['brilho-vidro'], 0.34))
    c.addColorStop(1, rgba(P['brilho-vidro'], 0))
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832)
    ctx.clip()
    ctx.fillStyle = c
    ctx.fillRect(x - rx, y - ry, rx * 2, ry * 2)
    ctx.restore()
    ctx.fillStyle = rgba(P['brilho-vidro'], 0.82)
    ctx.beginPath()
    ctx.ellipse(x - rx * 0.36, y - ry * 0.42, rx * 0.22, ry * 0.14, -0.6, 0, 6.2832)
    ctx.fill()
    ctx.strokeStyle = rgba(P['brilho-vidro'], 0.22)
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832)
    ctx.stroke()
  }

  function gotaPequena(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.fillStyle = rgba(P['brilho-vidro'], 0.15)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 6.2832)
    ctx.fill()
    ctx.fillStyle = rgba(P['brilho-vidro'], 0.7)
    ctx.beginPath()
    ctx.arc(x - r * 0.3, y - r * 0.34, r * 0.3, 0, 6.2832)
    ctx.fill()
    ctx.strokeStyle = rgba(P['escuro-rgb'], 0.32)
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 6.2832)
    ctx.stroke()
  }

  function desenharVidro(rng: () => number) {
    const ctx = cVidro.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, Hh)
    ctx.globalCompositeOperation = 'screen'
    const n = Math.min(luzes.length, 78)
    let i: number
    for (i = 0; i < n; i++) {
      const l = luzes[(rng() * luzes.length) | 0], r = 8 + Math.pow(rng(), 2.2) * 30
      const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, r)
      g.addColorStop(0, rgba(l.c, 0.1))
      g.addColorStop(0.7, rgba(l.c, 0.07))
      g.addColorStop(0.92, rgba(l.c, 0.13))
      g.addColorStop(1, rgba(l.c, 0))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(l.x, l.y, r, 0, 6.2832)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'

    for (i = 0; i < 900; i++) {
      const mx = rng() * W, my = Hh * (1 - Math.pow(rng(), 1.4)), mr = 0.4 + rng() * 0.9
      ctx.fillStyle = rgba(P['brilho-vidro'], 0.1 + rng() * 0.16)
      ctx.beginPath()
      ctx.arc(mx, my, mr, 0, 6.2832)
      ctx.fill()
    }

    const gotas: Array<{ x: number; y: number; r: number }> = []
    for (let t = 0; t < 3200 && gotas.length < 300; t++) {
      const x = rng() * W, y = Hh * (1 - Math.pow(rng(), 1.55))
      const dx = Math.abs(x / W - 0.5) * 2, p = 0.32 + 0.68 * Math.max(dx, y / Hh)
      if (rng() > p) continue
      const rr = 1.5 + Math.pow(rng(), 3.2) * 10.5
      let ok = true
      for (let k = 0; k < gotas.length; k++) {
        const q = gotas[k], ddx = q.x - x, ddy = q.y - y
        if (Math.sqrt(ddx * ddx + ddy * ddy) < (q.r + rr) * 0.85) { ok = false; break }
      }
      if (ok) gotas.push({ x, y, r: rr })
    }
    gotas.sort((a, b) => a.r - b.r)
    ctx.lineCap = 'round'
    gotas.filter((q) => q.r > 6.5).slice(0, 16).forEach((q) => {
      const len = 40 + rng() * 190, gr = ctx.createLinearGradient(0, q.y - len, 0, q.y)
      gr.addColorStop(0, rgba(P.chuva, 0))
      gr.addColorStop(1, rgba(P.chuva, 0.2))
      ctx.strokeStyle = gr
      ctx.lineWidth = q.r * 0.5
      ctx.beginPath()
      ctx.moveTo(q.x, q.y - len)
      ctx.lineTo(q.x, q.y)
      ctx.stroke()
    })
    gotas.forEach((q) => { if (q.r < 3) gotaPequena(ctx, q.x, q.y, q.r); else lente(ctx, q.x, q.y, q.r) })
  }

  function novaGotaMov(inicial: boolean): GotaMov {
    const y = inicial ? Math.random() * Hh : -20 - Math.random() * 220
    return {
      x: Math.random() * W, y, y0: y, r: 3.6 + Math.random() * 4.6, v: 60 + Math.random() * 90,
      fr: 0.5 + Math.random() * 0.9, ph: Math.random() * 6.28, fase: Math.random() * 10,
    }
  }

  function iniciarMovimento() {
    chuva = []
    gotasMov = []
    if (!nivel || !nivel.movimento) return
    for (let i = 0; i < nivel.riscos; i++) {
      chuva.push({
        x: Math.random() * W, y: Math.random() * Hh, len: 12 + Math.random() * 44,
        v: 620 + Math.random() * 900, a: 0.06 + Math.random() * 0.22, w: 0.6 + Math.random() * 1.1,
      })
    }
    for (let i = 0; i < nivel.gotas; i++) gotasMov.push(novaGotaMov(true))
  }

  function quadro(dt: number, t: number) {
    if (!cMov) return
    const c = cMov.getContext('2d')
    if (!c) return
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, W, Hh)
    c.lineCap = 'round'
    const base = rgbDe(P.chuva), pre = 'rgba(' + base[0] + ',' + base[1] + ',' + base[2] + ','
    let i: number
    for (i = 0; i < chuva.length; i++) {
      const r = chuva[i]
      r.y += r.v * dt
      r.x += r.v * dt * 0.14
      if (r.y - r.len > Hh || r.x > W + 30) {
        r.y = -r.len * Math.random()
        r.x = Math.random() * W - Hh * 0.14
      }
      c.strokeStyle = pre + r.a + ')'
      c.lineWidth = r.w
      c.beginPath()
      c.moveTo(r.x - r.len * 0.14, r.y - r.len)
      c.lineTo(r.x, r.y)
      c.stroke()
    }
    for (i = 0; i < gotasMov.length; i++) {
      const g = gotasMov[i]
      g.fase += dt
      const v = g.v * (0.05 + Math.pow(Math.max(0, Math.sin(g.fase * g.fr + g.ph)), 1.5))
      g.y += v * dt
      const ini = Math.max(g.y0, g.y - 260)
      const gr = c.createLinearGradient(0, ini, 0, g.y)
      gr.addColorStop(0, rgba(P.chuva, 0))
      gr.addColorStop(1, rgba(P.chuva, 0.2))
      c.strokeStyle = gr
      c.lineWidth = g.r * 0.55
      c.beginPath()
      c.moveTo(g.x, ini)
      c.lineTo(g.x, g.y)
      c.stroke()
      lente(c, g.x, g.y, g.r)
      if (g.y > Hh + 30) gotasMov[i] = novaGotaMov(false)
    }
    c.globalCompositeOperation = 'lighter'
    for (i = 0; i < baloes.length; i++) {
      const b = baloes[i], a = Math.pow(Math.max(0, Math.sin(t * 1.5 + b.ph)), 10)
      if (a < 0.03) continue
      const bg = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, 9)
      bg.addColorStop(0, rgba(P.aviso, a))
      bg.addColorStop(1, rgba(P.aviso, 0))
      c.fillStyle = bg
      c.beginPath()
      c.arc(b.x, b.y, 9, 0, 6.2832)
      c.fill()
    }
    for (i = 0; i < piscas.length; i++) {
      const p = piscas[i], al = 0.35 + 0.35 * Math.sin(t * 0.7 + p.ph) * Math.sin(t * 1.9 + p.ph * 2)
      if (al < 0.05) continue
      c.fillStyle = rgba(p.c, al * 0.5)
      c.fillRect(p.x, p.y, p.w, p.h)
    }
    c.globalCompositeOperation = 'source-over'
  }

  /* ── laço e medição de desempenho ── */

  function laco(ts: number) {
    if (destruida) return
    raf = requestAnimationFrame(laco)
    const bruto = ts - ultimo
    ultimo = ts
    if (medindo && bruto > 0) {
      amostras.push(bruto)
      if (amostras.length >= QUADROS_MEDIDOS) {
        medindo = false
        if (!degradou && p95(amostras) > LIMITE_P95_MS) {
          degradou = true
          opts.aoDegradar?.()
        }
        amostras = []
      }
    }
    quadro(Math.min(0.05, bruto / 1000), ts / 1000)
  }

  function deveRodar(): boolean {
    return !destruida && !reduz && !!nivel && nivel.movimento && !!cMov && !pausado && !document.hidden
  }

  function agendar() {
    cancelAnimationFrame(raf)
    raf = 0
    if (!deveRodar()) return
    amostras = [] // uma pausa invalida a medição em curso: recomeça do zero
    ultimo = performance.now()
    raf = requestAnimationFrame(laco)
  }

  /* ── montagem ── */

  function liberarCanvases() {
    todos.forEach((c) => { c.width = 0; c.height = 0 })
  }

  function montar() {
    cancelAnimationFrame(raf)
    raf = 0
    if (!nivel) {
      liberarCanvases()
      return
    }
    const vw = window.innerWidth, vh = window.innerHeight
    const sw = (window.screen && window.screen.width) || vw, sh = (window.screen && window.screen.height) || vh
    // a cena cobre a tela inteira, então a janela do navegador pode variar sem deixar vazios
    W = Math.max(vw, Math.min(sw, 2560)) + 2 * M
    Hh = Math.max(vh, Math.min(sh, 1440)) + 2 * M
    dpr = Math.min(window.devicePixelRatio || 1, nivel.dprMax, 3200 / W)
    const vivos = nivel.movimento ? todos : todos.filter((c) => c !== cMov)
    if (!nivel.movimento && cMov) {
      cMov.width = 0
      cMov.height = 0
    }
    vivos.forEach((c) => {
      c.width = Math.round(W * dpr)
      c.height = Math.round(Hh * dpr)
      c.style.width = W + 'px'
      c.style.height = Hh + 'px'
    })
    lerTokens()
    luzes = []
    baloes = []
    piscas = []
    const rng = semente(SEMENTE)
    desenharCena(rng)
    desenharVidro(rng)
    iniciarMovimento()
    if (nivel.movimento) {
      if (reduz) quadro(0, 0)
      else {
        medindo = !degradou
        agendar()
      }
    }
    opts.aoPronto?.()
  }

  function aoRedimensionar() {
    if (tmr !== null) clearTimeout(tmr)
    tmr = setTimeout(() => {
      tmr = null
      if (destruida || !nivel) return
      if (window.innerWidth > W - 2 * M || window.innerHeight > Hh - 2 * M) montar()
    }, 220)
  }

  function aoMudarVisibilidade() {
    if (reduz) return
    agendar()
  }

  window.addEventListener('resize', aoRedimensionar)
  document.addEventListener('visibilitychange', aoMudarVisibilidade)
  montar()

  return {
    destruir() {
      if (destruida) return
      destruida = true
      cancelAnimationFrame(raf)
      raf = 0
      if (tmr !== null) clearTimeout(tmr)
      tmr = null
      window.removeEventListener('resize', aoRedimensionar)
      document.removeEventListener('visibilitychange', aoMudarVisibilidade)
      luzes = []
      baloes = []
      piscas = []
      chuva = []
      gotasMov = []
      amostras = []
      // o Chrome só libera o backing store de um canvas destacado quando o GC roda
      liberarCanvases()
    },
    definirQualidade(q: Qualidade) {
      if (destruida || q === qualidade) return
      qualidade = q
      nivel = q === 'off' ? null : NIVEIS[q]
      montar()
    },
    pausar() {
      pausado = true
      cancelAnimationFrame(raf)
      raf = 0
    },
    retomar() {
      if (!pausado) return
      pausado = false
      if (!reduz) agendar()
    },
  }
}
