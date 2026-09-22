'use client'

import { useState, useEffect } from 'react'
import { ACORDES, gerarAcorde, type TipoAcorde } from '@/lib/color/harmonies'
import { simular } from '@/lib/color/daltonismo'
import { colord } from '@/lib/color/setup'
import { useColorStore, useHex, useHsl } from '@/stores/useColorStore'
import { usePaletteStore } from '@/stores/usePaletteStore'
import { useToast } from '@/context/ToastContext'
import ExtratorImagem from './ExtratorImagem'
import { IconeCheck, IconeMais } from './Icones'

interface PainelContextoProps {
  onFechar?: () => void
}

/**
 * Painel de contexto lateral do Ateliê integrado, com suporte a abas de
 * Análise Cromática e Extrator de Imagem com sincronia imediata.
 */
export default function PainelContexto({ onFechar }: PainelContextoProps) {
  const hex = useHex()
  const hsl = useHsl()
  const setFromHex = useColorStore((e) => e.setFromHex)
  const commitColor = useColorStore((e) => e.commitColor)
  const { showToast } = useToast()

  const [abaAtiva, setAbaAtiva] = useState<'analise' | 'imagem'>('analise')
  const [tipoAcorde, setTipoAcorde] = useState<TipoAcorde>('analoga')
  const [salvo, setSalvo] = useState(false)

  const defAcorde = ACORDES.find((a) => a.tipo === tipoAcorde) ?? ACORDES[0]
  const coresHarmonia = gerarAcorde(hsl, tipoAcorde, hex)

  // Cálculos de Contraste WCAG em tempo real
  const ratioEscuro = colord(hex).contrast('#090A0F')
  const ratioClaro = colord(hex).contrast('#FAF8F5')

  // Simulações de Daltonismo
  const hexProtanopia = simular(hex, 'protanopia')
  const hexDeuteranopia = simular(hex, 'deuteranopia')
  const hexTritanopia = simular(hex, 'tritanopia')

  // Escuta de teclado para alternar abas [A] e [I] e comutação automática ao colar imagem
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'a' || e.key === 'A') setAbaAtiva('analise')
      if (e.key === 'i' || e.key === 'I') setAbaAtiva('imagem')
    }

    function aoColar(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          setAbaAtiva('imagem')
          break
        }
      }
    }

    window.addEventListener('keydown', aoTeclar)
    window.addEventListener('paste', aoColar)
    return () => {
      window.removeEventListener('keydown', aoTeclar)
      window.removeEventListener('paste', aoColar)
    }
  }, [])

  function aplicarCor(cor: string) {
    setFromHex(cor)
    commitColor()
  }

  function salvarPaleta() {
    const { createPalette, addColorToPalette } = usePaletteStore.getState()
    const paleta = createPalette(`${defAcorde.rotulo} · ${hex}`)
    coresHarmonia.forEach((cor) => addColorToPalette(paleta.id, cor))
    setSalvo(true)
    showToast(`Paleta "${paleta.name}" salva com ${coresHarmonia.length} cores.`, 'success')
    setTimeout(() => setSalvo(false), 2000)
  }

  return (
    <aside
      aria-label="Painel de Análise e Contexto do Ateliê"
      className="flex flex-col gap-3 p-4 rounded-[24px] bg-[rgba(var(--escuro-rgb),0.70)] backdrop-blur-[var(--desfoque-lamina)] backdrop-saturate-[165%] border border-[rgba(var(--tinta-rgb),0.09)] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.22),0_22px_44px_-20px_rgba(var(--escuro-rgb),0.9)]"
    >
      {/* Abas Superiores com Frestas de Luz e Ação de Foco */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[rgba(var(--tinta-rgb),0.07)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAbaAtiva('analise')}
            className={`relative py-0.5 px-1 font-semibold text-[13px] tracking-[0.05em] uppercase transition-colors cursor-pointer ${
              abaAtiva === 'analise'
                ? 'text-[var(--tinta)]'
                : 'text-[var(--tinta-fraca)] hover:text-[var(--tinta-media)]'
            }`}
          >
            Análise & Harmonias
            {abaAtiva === 'analise' && (
              <span
                className="absolute bottom-[-11px] inset-x-0 h-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--cor-atual), transparent)',
                  boxShadow: '0 0 8px var(--cor-atual)',
                }}
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('imagem')}
            className={`relative py-0.5 px-1 font-semibold text-[13px] tracking-[0.05em] uppercase transition-colors cursor-pointer ${
              abaAtiva === 'imagem'
                ? 'text-[var(--tinta)]'
                : 'text-[var(--tinta-fraca)] hover:text-[var(--tinta-media)]'
            }`}
          >
            Imagem
            {abaAtiva === 'imagem' && (
              <span
                className="absolute bottom-[-11px] inset-x-0 h-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--cor-atual), transparent)',
                  boxShadow: '0 0 8px var(--cor-atual)',
                }}
              />
            )}
          </button>
        </div>

        {onFechar && (
          <button
            type="button"
            onClick={onFechar}
            className="text-[12px] font-medium text-[var(--tinta-fraca)] hover:text-[var(--tinta)] py-0.5 px-2 rounded transition-colors"
            title="Recolher painel para modo foco"
          >
            Foco
          </button>
        )}
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {abaAtiva === 'imagem' ? (
        <ExtratorImagem />
      ) : (
        <div className="flex flex-col gap-2.5">
          {/* 1. Harmonias Cromáticas */}
          <section className="flex flex-col gap-2 p-3 rounded-[18px] bg-[rgba(var(--tinta-rgb),0.025)] border border-[rgba(var(--tinta-rgb),0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[var(--tinta-media)]">
                Harmonias
              </span>
              <button
                type="button"
                onClick={salvarPaleta}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--tinta-media)] hover:text-[var(--tinta)] py-0.5 px-1.5 rounded transition-colors"
                title="Salvar acorde como paleta"
              >
                {salvo ? <IconeCheck /> : <IconeMais />}
                <span>{salvo ? 'Salvo' : 'Salvar'}</span>
              </button>
            </div>

            {/* Pílulas de Acordes */}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tipos de harmonia">
              {ACORDES.map((a) => (
                <button
                  key={a.tipo}
                  type="button"
                  onClick={() => setTipoAcorde(a.tipo)}
                  aria-pressed={tipoAcorde === a.tipo}
                  className={`text-[13px] font-medium py-0.5 px-2.5 rounded-[var(--raio-pilula)] transition-all ${
                    tipoAcorde === a.tipo
                      ? 'bg-[rgba(var(--tinta-rgb),0.18)] text-[var(--tinta)] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.25)]'
                      : 'bg-transparent text-[var(--tinta-fraca)] hover:text-[var(--tinta-media)]'
                  }`}
                >
                  {a.rotulo}
                </button>
              ))}
            </div>

            {/* Fita de Cores */}
            <div className="flex h-10 rounded-[10px] overflow-hidden border border-[rgba(var(--tinta-rgb),0.1)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] mt-0.5">
              {coresHarmonia.map((cor, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => aplicarCor(cor)}
                  className="flex-1 border-0 cursor-pointer relative group transition-all duration-[var(--t-curto)] hover:flex-[1.4]"
                  style={{ backgroundColor: cor }}
                  title={`Aplicar ${cor}`}
                  aria-label={`Aplicar ${cor}`}
                >
                  <span className="absolute inset-x-0 bottom-1 text-[10px] font-mono font-semibold text-center text-white opacity-0 group-hover:opacity-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-opacity">
                    {cor}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Contraste WCAG */}
          <section className="flex flex-col gap-2 p-3 rounded-[18px] bg-[rgba(var(--tinta-rgb),0.025)] border border-[rgba(var(--tinta-rgb),0.06)]">
            <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[var(--tinta-media)]">
              Acessibilidade WCAG
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Fundo Escuro */}
              <div
                className="p-2.5 rounded-[10px] flex flex-col justify-between min-h-[52px] border border-[rgba(255,255,255,0.06)]"
                style={{ backgroundColor: '#090A0F', color: hex }}
              >
                <span className="text-[13px] font-semibold leading-tight">Texto Ativo</span>
                <span className="font-mono text-[12px] font-medium opacity-90">
                  {ratioEscuro.toFixed(1)} : 1 {ratioEscuro >= 4.5 ? '· AA' : ''}
                </span>
              </div>

              {/* Fundo Claro */}
              <div
                className="p-2.5 rounded-[10px] flex flex-col justify-between min-h-[52px] border border-[rgba(255,255,255,0.06)]"
                style={{ backgroundColor: hex, color: '#090A0F' }}
              >
                <span className="text-[13px] font-semibold leading-tight">Fundo Ativo</span>
                <span className="font-mono text-[12px] font-medium opacity-90">
                  {ratioClaro.toFixed(1)} : 1 {ratioClaro >= 4.5 ? '· AA' : ''}
                </span>
              </div>
            </div>
          </section>

          {/* 3. Simulação de Daltonismo */}
          <section className="flex flex-col gap-1.5 p-3 rounded-[18px] bg-[rgba(var(--tinta-rgb),0.025)] border border-[rgba(var(--tinta-rgb),0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[var(--tinta-media)]">
                Visão Daltonismo
              </span>
              <span className="text-[11px] text-[var(--tinta-fraca)]">Clique p/ copiar</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { tipo: 'protanopia' as const, label: 'Protan', hex: hexProtanopia, nome: 'Protanopia' },
                { tipo: 'deuteranopia' as const, label: 'Deuter', hex: hexDeuteranopia, nome: 'Deuteranopia' },
                { tipo: 'tritanopia' as const, label: 'Tritan', hex: hexTritanopia, nome: 'Tritanopia' },
              ].map((item) => (
                <button
                  key={item.tipo}
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(item.hex)
                    showToast(`${item.nome} (${item.hex}) copiado!`, 'info')
                  }}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-[10px] bg-transparent border border-transparent hover:border-[rgba(var(--tinta-rgb),0.15)] hover:bg-[rgba(var(--tinta-rgb),0.04)] transition-all cursor-pointer group"
                  title={`${item.nome}: ${item.hex} · Clique para copiar`}
                  aria-label={`Copiar simulação de ${item.nome}: ${item.hex}`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.15)] shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-[11px] text-[var(--tinta-fraca)] group-hover:text-[var(--tinta)] font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </aside>
  )
}
