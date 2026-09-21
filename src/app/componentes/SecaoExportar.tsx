'use client'

import { useEffect, useMemo, useState } from 'react'
import { colord } from '@/lib/color'
import {
  gerarCss,
  gerarJson,
  gerarTailwind,
  gerarTypeScript,
  type EntradaExportacao,
} from '@/lib/color/exportar'
import { reidratar, usePaletteStore } from '@/stores/usePaletteStore'
import { useHex } from '@/stores/useColorStore'
import { useCopiar } from '@/hooks/useCopiar'
import { useToast } from '@/context/ToastContext'
import { IconeCheck, IconeCopiar, IconeBaixar } from './Icones'

type Formato = 'css' | 'tailwind' | 'json' | 'typescript'

const FORMATOS: Record<Formato, { rotulo: string; extensao: string; mime: string; gerar: (e: EntradaExportacao) => string }> = {
  css: { rotulo: 'CSS', extensao: 'css', mime: 'text/css', gerar: gerarCss },
  tailwind: { rotulo: 'Tailwind', extensao: 'css', mime: 'text/css', gerar: gerarTailwind },
  json: { rotulo: 'JSON', extensao: 'json', mime: 'application/json', gerar: gerarJson },
  typescript: { rotulo: 'TypeScript', extensao: 'ts', mime: 'text/plain', gerar: gerarTypeScript },
}

export default function SecaoExportar() {
  const paletas = usePaletteStore((estado) => estado.palettes)
  const ativaId = usePaletteStore((estado) => estado.activePaletteId)
  const hex = useHex()
  const { copiar, copiado } = useCopiar()
  const { showToast } = useToast()

  const [formato, setFormato] = useState<Formato>('css')
  const [incluirAtiva, setIncluirAtiva] = useState(true)
  // Armazena a seleção manual de paletas para inclusão no arquivo de exportação
  const [alterados, setAlterados] = useState<Record<string, boolean>>({})

  useEffect(() => {
    void reidratar()
  }, [])

  const marcada = (id: string) => alterados[id] ?? id === ativaId

  const codigo = useMemo(() => {
    const cor = colord(hex)
    const entrada: EntradaExportacao = {
      corAtiva: incluirAtiva ? { hex, rgb: cor.toRgb(), hsl: cor.toHsl() } : null,
      paletas: paletas.filter((p) => alterados[p.id] ?? p.id === ativaId),
    }
    return FORMATOS[formato].gerar(entrada)
  }, [formato, hex, incluirAtiva, paletas, alterados, ativaId])

  const nadaSelecionado = !incluirAtiva && !paletas.some((p) => marcada(p.id))
  const nomeArquivo = `lumen-tokens.${FORMATOS[formato].extensao}`

  function baixar() {
    const blob = new Blob([codigo], { type: `${FORMATOS[formato].mime};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivo
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    showToast(`Arquivo ${nomeArquivo} baixado.`, 'success')
  }

  return (
    <section
      id="exportar"
      aria-labelledby="titulo-exportar"
      className="w-full max-w-[1280px] mx-auto pt-0 px-[clamp(20px,5vw,64px)] pb-[clamp(60px,10vh,110px)]"
    >
      <div className="rotulo-secao">
        <h2 id="titulo-exportar">Exportar</h2>
        <i />
      </div>

      <div className="lamina grid gap-[26px] p-[clamp(20px,4vw,34px)]">
        <div className="grid grid-cols-1 min-[721px]:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-x-10 gap-y-[26px]">
          <div className="min-w-0 m-0 p-0 border-0" role="group" aria-labelledby="rotulo-formato">
            <span id="rotulo-formato" className="block mb-3 p-0 text-xs font-semibold tracking-[0.12em] uppercase text-tinta-fraca">
              Formato
            </span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(FORMATOS) as Formato[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  className="pilula"
                  aria-pressed={formato === f}
                  onClick={() => setFormato(f)}
                >
                  {FORMATOS[f].rotulo}
                </button>
              ))}
            </div>
          </div>

          <fieldset className="min-w-0 m-0 p-0 border-0">
            <legend className="block mb-3 p-0 text-xs font-semibold tracking-[0.12em] uppercase text-tinta-fraca">Incluir</legend>
            <div className="grid gap-1">
              <label className="flex items-center gap-2.5 min-h-10 px-2.5 -mx-2.5 rounded-campo text-[15px] text-tinta cursor-pointer transition-colors duration-[0.28s] ease-[var(--ease)] hover:bg-[rgba(var(--tinta-rgb),0.06)]">
                <input
                  type="checkbox"
                  checked={incluirAtiva}
                  onChange={(ev) => setIncluirAtiva(ev.target.checked)}
                  className="w-[18px] h-[18px] shrink-0 m-0 cursor-pointer accent-(--luz-quente)"
                />
                <span className="w-[18px] h-[18px] shrink-0 rounded-[6px] shadow-[inset_0_1px_0_rgba(var(--claro-rgb),0.3),0_0_0_1px_rgba(var(--tinta-rgb),0.14)]" style={{ backgroundColor: hex }} aria-hidden="true" />
                <span>Cor ativa</span>
                <span className="ml-auto font-mono text-[13px] text-tinta-fraca">{hex}</span>
              </label>
              {paletas.map((p) => (
                <label className="flex items-center gap-2.5 min-h-10 px-2.5 -mx-2.5 rounded-campo text-[15px] text-tinta cursor-pointer transition-colors duration-[0.28s] ease-[var(--ease)] hover:bg-[rgba(var(--tinta-rgb),0.06)]" key={p.id}>
                  <input
                    type="checkbox"
                    checked={marcada(p.id)}
                    onChange={(ev) => setAlterados((antes) => ({ ...antes, [p.id]: ev.target.checked }))}
                    className="w-[18px] h-[18px] shrink-0 m-0 cursor-pointer accent-(--luz-quente)"
                  />
                  <span>{p.name}</span>
                  <span className="ml-auto font-mono text-[13px] text-tinta-fraca">
                    {p.colors.length} {p.colors.length === 1 ? 'cor' : 'cores'}
                    {p.id === ativaId ? ', ativa' : ''}
                  </span>
                </label>
              ))}
            </div>
            {paletas.length === 0 && (
              <p className="mt-2.5 text-sm text-tinta-fraca">As paletas que você salvar na Coleção podem ser incluídas aqui.</p>
            )}
          </fieldset>
        </div>

        <div className="min-w-0 rounded-card bg-[rgba(var(--escuro-rgb),0.6)] shadow-[inset_0_2px_8px_rgba(var(--escuro-rgb),0.7),inset_0_0_0_1px_rgba(var(--tinta-rgb),0.07)]">
          {nadaSelecionado ? (
            <p className="p-[22px_20px] text-sm text-tinta-fraca">Marque a cor ativa ou uma paleta para gerar o código.</p>
          ) : (
            <pre tabIndex={0} aria-label={`Código ${FORMATOS[formato].rotulo}`} className="m-0 p-[18px_20px] max-h-[340px] overflow-auto rounded-[inherit] font-mono text-sm leading-[1.65] text-tinta-media [tab-size:2]">
              <code className="font-[inherit] whitespace-pre">{codigo}</code>
            </pre>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 [&>.pilula:disabled]:cursor-default [&>.pilula:disabled]:opacity-50">
          <button
            type="button"
            className="pilula"
            disabled={nadaSelecionado}
            onClick={() => copiar(codigo, FORMATOS[formato].rotulo)}
          >
            {copiado === FORMATOS[formato].rotulo ? <IconeCheck /> : <IconeCopiar />}
            Copiar
          </button>
          <button type="button" className="pilula" disabled={nadaSelecionado} onClick={baixar}>
            <IconeBaixar />
            Baixar {nomeArquivo}
          </button>
        </div>
      </div>
    </section>
  )
}
