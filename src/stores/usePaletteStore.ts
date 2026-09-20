import { create } from 'zustand'
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware'
import { hexTolerante } from '@/lib/color/campos'
import type { Palette, PaletteColor } from '@/types/palette'

const CHAVE = 'lumen-palettes'
const VERSAO = 1
/** Teto por paleta: evita que uma colagem sem fim encha o localStorage. */
const CORES_MAX = 64

interface PaletteState {
  palettes: Palette[]
  activePaletteId: string | null

  createPalette: (name: string) => Palette
  deletePalette: (id: string) => void
  renamePalette: (id: string, name: string) => void
  addColorToPalette: (paletteId: string, hex: string) => void
  removeColorFromPalette: (paletteId: string, position: number) => void
  setActivePalette: (id: string | null) => void
}

type Persistido = Pick<PaletteState, 'palettes' | 'activePaletteId'>

// ─── validação do que vem do disco ───
// O localStorage é entrada não confiável: outra versão do app, edição manual
// ou corrupção. Nada aqui lança exceção; o que não presta é descartado.

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const ehTexto = (v: unknown): v is string => typeof v === 'string'

function sanearCores(bruto: unknown): PaletteColor[] {
  if (!Array.isArray(bruto)) return []
  const vistos = new Set<string>()
  const cores: PaletteColor[] = []
  for (const item of bruto) {
    const texto = ehTexto(item) ? item : ehObjeto(item) && ehTexto(item.hex) ? item.hex : null
    const hex = texto === null ? null : hexTolerante(texto)
    if (!hex || vistos.has(hex) || cores.length >= CORES_MAX) continue
    vistos.add(hex)
    const nome = ehObjeto(item) && ehTexto(item.name) ? item.name : undefined
    cores.push(nome ? { hex, name: nome, position: cores.length } : { hex, position: cores.length })
  }
  return cores
}

function sanearPaletas(bruto: unknown): Palette[] {
  if (!Array.isArray(bruto)) return []
  const ids = new Set<string>()
  const agora = new Date().toISOString()
  const paletas: Palette[] = []
  for (const item of bruto) {
    if (!ehObjeto(item)) continue
    let id = ehTexto(item.id) && item.id.trim() ? item.id : ''
    if (!id || ids.has(id)) id = crypto.randomUUID()
    ids.add(id)
    const nome = ehTexto(item.name) ? item.name.trim() : ''
    const paleta: Palette = {
      id,
      name: nome || `Paleta ${paletas.length + 1}`,
      colors: sanearCores(item.colors),
      createdAt: ehTexto(item.createdAt) ? item.createdAt : agora,
      updatedAt: ehTexto(item.updatedAt) ? item.updatedAt : agora,
    }
    paletas.push(paleta)
  }
  return paletas
}

function sanearEstado(bruto: unknown): Persistido {
  if (!ehObjeto(bruto)) return { palettes: [], activePaletteId: null }
  const palettes = sanearPaletas(bruto.palettes)
  const ativa = ehTexto(bruto.activePaletteId) ? bruto.activePaletteId : null
  return {
    palettes,
    activePaletteId: ativa !== null && palettes.some((p) => p.id === ativa) ? ativa : null,
  }
}

/**
 * Armazenamento que nunca lança e nunca devolve algo inválido: JSON quebrado,
 * `null`, formato de outra versão ou campos com tipo errado voltam como vazio.
 */
const armazenamento: PersistStorage<Persistido> = {
  getItem: (nome) => {
    try {
      const bruto = localStorage.getItem(nome)
      if (bruto === null) return null
      const lido: unknown = JSON.parse(bruto)
      if (!ehObjeto(lido) || !ehObjeto(lido.state)) return null
      const versao = typeof lido.version === 'number' ? lido.version : 0
      return { state: sanearEstado(lido.state), version: versao } satisfies StorageValue<Persistido>
    } catch {
      return null
    }
  },
  setItem: (nome, valor) => {
    try {
      localStorage.setItem(nome, JSON.stringify(valor))
    } catch {
      // cota cheia ou armazenamento bloqueado: a sessão continua em memória
    }
  },
  removeItem: (nome) => {
    try {
      localStorage.removeItem(nome)
    } catch {
      // sem armazenamento disponível: nada a remover
    }
  },
}

export const usePaletteStore = create<PaletteState>()(
  persist(
    (set, get) => ({
      palettes: [],
      activePaletteId: null,

      createPalette: (name: string) => {
        const now = new Date().toISOString()
        const palette: Palette = {
          id: crypto.randomUUID(),
          name: name.trim() || `Paleta ${get().palettes.length + 1}`,
          colors: [],
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ palettes: [...state.palettes, palette] }))
        return palette
      },

      deletePalette: (id) => {
        set((state) => ({
          palettes: state.palettes.filter((p) => p.id !== id),
          activePaletteId: state.activePaletteId === id ? null : state.activePaletteId,
        }))
      },

      renamePalette: (id, name) => {
        const limpo = name.trim()
        if (!limpo) return
        set((state) => ({
          palettes: state.palettes.map((p) =>
            p.id === id ? { ...p, name: limpo, updatedAt: new Date().toISOString() } : p,
          ),
        }))
      },

      addColorToPalette: (paletteId, hex) => {
        const normalizado = hexTolerante(hex)
        if (!normalizado) return
        set((state) => ({
          palettes: state.palettes.map((p) => {
            if (p.id !== paletteId) return p
            if (p.colors.length >= CORES_MAX || p.colors.some((c) => c.hex === normalizado)) return p
            return {
              ...p,
              colors: [...p.colors, { hex: normalizado, position: p.colors.length }],
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      removeColorFromPalette: (paletteId, position) => {
        set((state) => ({
          palettes: state.palettes.map((p) => {
            if (p.id !== paletteId) return p
            return {
              ...p,
              colors: p.colors
                .filter((c) => c.position !== position)
                .map((c, i) => ({ ...c, position: i })),
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      setActivePalette: (id) =>
        set((state) => ({
          activePaletteId: id === null || state.palettes.some((p) => p.id === id) ? id : state.activePaletteId,
        })),
    }),
    {
      name: CHAVE,
      version: VERSAO,
      storage: armazenamento,
      // O servidor renderiza vazio; o cliente reidrata num efeito (ver reidratar)
      skipHydration: true,
      partialize: (state): Persistido => ({
        palettes: state.palettes,
        activePaletteId: state.activePaletteId,
      }),
      // qualquer versão anterior (ou desconhecida) passa pela mesma limpeza
      migrate: (persistido) => sanearEstado(persistido),
      merge: (persistido, atual) => ({ ...atual, ...sanearEstado(persistido) }),
    },
  ),
)

/**
 * Lê as paletas salvas. Chamar num `useEffect` (SecaoColecao e SecaoExportar
 * fazem isso): reidratar só depois da montagem evita o descompasso entre o HTML
 * do servidor e o primeiro render do cliente. É idempotente.
 */
export function reidratar(): Promise<void> {
  return Promise.resolve(usePaletteStore.persist.rehydrate()).catch(() => undefined)
}
