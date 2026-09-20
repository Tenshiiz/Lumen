'use client'

import { useId, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from 'react'
import { usePaletteStore } from '@/stores/usePaletteStore'
import { useColorStore, useHex } from '@/stores/useColorStore'
import { useToast } from '@/context/ToastContext'
import type { Palette } from '@/types/palette'
import FitaDeCores from './FitaDeCores'

/** Nome da paleta com edição direta: Enter confirma, Escape volta ao nome salvo. */
function NomeEditavel({ paleta }: { paleta: Palette }) {
  const renomear = usePaletteStore((estado) => estado.renamePalette)
  const [rascunho, setRascunhoEstado] = useState<string | null>(null)
  // espelho síncrono: Enter/Escape chamam blur() no mesmo evento, e o onBlur
  // veria o estado antigo do render (renomearia depois de um Escape)
  const atual = useRef<string | null>(null)
  const exibido = rascunho ?? paleta.name

  function setRascunho(valor: string | null) {
    atual.current = valor
    setRascunhoEstado(valor)
  }

  function confirmar() {
    const valor = atual.current
    if (valor !== null && valor.trim()) renomear(paleta.id, valor)
    setRascunho(null)
  }

  function aoTeclar(ev: KeyboardEvent<HTMLInputElement>) {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      confirmar()
      ev.currentTarget.blur()
    } else if (ev.key === 'Escape') {
      setRascunho(null)
      ev.currentTarget.blur()
    }
  }

  return (
    <input
      className="flex-1 min-w-0 py-1 px-2 -ml-2 border-0 rounded-[9px] bg-transparent text-tinta text-[17px] font-semibold tracking-[-0.01em] transition-[background-color,box-shadow] duration-[0.28s] ease-[var(--ease)] hover:bg-[rgba(var(--tinta-rgb),0.06)] focus:outline-none focus:bg-[rgba(var(--escuro-rgb),0.55)] focus:shadow-[inset_0_0_0_1.5px_var(--luz-quente)] aria-[invalid=true]:shadow-[inset_0_0_0_1.5px_var(--sinal-erro)]"
      type="text"
      value={exibido}
      maxLength={60}
      spellCheck={false}
      autoComplete="off"
      aria-label={`Nome da paleta ${paleta.name}`}
      aria-invalid={rascunho !== null && !rascunho.trim()}
      onChange={(ev) => setRascunho(ev.target.value)}
      onFocus={(ev) => ev.currentTarget.select()}
      onBlur={confirmar}
      onKeyDown={aoTeclar}
    />
  )
}

function LinhaPaleta({ paleta, ativa, hexAtivo }: { paleta: Palette; ativa: boolean; hexAtivo: string }) {
  const setActivePalette = usePaletteStore((estado) => estado.setActivePalette)
  const addColorToPalette = usePaletteStore((estado) => estado.addColorToPalette)
  const removeColorFromPalette = usePaletteStore((estado) => estado.removeColorFromPalette)
  const deletePalette = usePaletteStore((estado) => estado.deletePalette)
  const setFromHex = useColorStore((estado) => estado.setFromHex)
  const commitColor = useColorStore((estado) => estado.commitColor)
  const { showToast } = useToast()
  const [confirmando, setConfirmando] = useState(false)

  const hexes = paleta.colors.map((c) => c.hex)
  const jaTem = hexes.includes(hexAtivo)

  function aplicar(hex: string) {
    setFromHex(hex)
    commitColor()
  }

  function excluir() {
    if (!confirmando) {
      setConfirmando(true)
      return
    }
    deletePalette(paleta.id)
    showToast(`Paleta "${paleta.name}" excluída.`, 'info')
  }

  // sair do grupo de ações sem confirmar desfaz o pedido de exclusão
  function aoSairDasAcoes(ev: FocusEvent<HTMLDivElement>) {
    if (!ev.currentTarget.contains(ev.relatedTarget)) setConfirmando(false)
  }

  function aoTeclarAcoes(ev: KeyboardEvent<HTMLDivElement>) {
    if (ev.key === 'Escape' && confirmando) {
      ev.stopPropagation()
      setConfirmando(false)
    }
  }

  return (
    <li className="grid gap-3 py-[22px] border-t border-[rgba(var(--tinta-rgb),0.09)] first:border-t-0 first:pt-1">
      <div className="flex items-baseline justify-between gap-3.5">
        <NomeEditavel paleta={paleta} />
        <span className="shrink-0 font-mono text-[13px] text-tinta-fraca">
          {hexes.length} {hexes.length === 1 ? 'cor' : 'cores'}
        </span>
      </div>

      {hexes.length === 0 ? (
        <p className="mt-0 text-sm text-tinta-fraca">Paleta vazia. Adicione a cor ativa.</p>
      ) : (
        <FitaDeCores
          cores={hexes}
          rotulo={`Cores da paleta ${paleta.name}`}
          aoAplicar={aplicar}
          aoRemover={(_, indice) => removeColorFromPalette(paleta.id, paleta.colors[indice].position)}
          atual={hexAtivo}
        />
      )}

      <div className="flex flex-wrap items-center gap-2" onBlur={aoSairDasAcoes} onKeyDown={aoTeclarAcoes}>
        <button
          type="button"
          className="pilula disabled:cursor-default disabled:opacity-50"
          disabled={jaTem}
          onClick={() => addColorToPalette(paleta.id, hexAtivo)}
        >
          {jaTem ? 'Cor ativa já está na paleta' : 'Adicionar cor ativa'}
        </button>
        <button
          type="button"
          className="pilula"
          aria-pressed={ativa}
          onClick={() => setActivePalette(ativa ? null : paleta.id)}
        >
          Paleta ativa
        </button>
        <span className="flex-1" />
        {confirmando && (
          <button type="button" className="pilula" onClick={() => setConfirmando(false)}>
            Cancelar
          </button>
        )}
        <button
          type="button"
          className="pilula data-[confirmando=true]:text-sinal-erro data-[confirmando=true]:shadow-[inset_0_0_0_1.5px_var(--sinal-erro)] data-[confirmando=true]:bg-[color-mix(in_srgb,var(--sinal-erro)_10%,transparent)]"
          data-confirmando={confirmando}
          onClick={excluir}
        >
          {confirmando ? 'Confirmar exclusão' : 'Excluir'}
        </button>
      </div>
    </li>
  )
}

/**
 * Paletas salvas. `pronto` só fica true depois da reidratação: até lá o estado
 * vazio não é mostrado, para não piscar "nenhuma paleta" com paletas salvas.
 */
export default function ListaPaletas({ pronto }: { pronto: boolean }) {
  const paletas = usePaletteStore((estado) => estado.palettes)
  const ativaId = usePaletteStore((estado) => estado.activePaletteId)
  const createPalette = usePaletteStore((estado) => estado.createPalette)
  const addColorToPalette = usePaletteStore((estado) => estado.addColorToPalette)
  const setActivePalette = usePaletteStore((estado) => estado.setActivePalette)
  const hexAtivo = useHex()

  const idCampo = useId()
  const [nome, setNome] = useState('')
  const campo = useRef<HTMLInputElement>(null)

  function criar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    let nomeFinal = nome.trim()
    if (!nomeFinal) {
      const usados = new Set(paletas.map((p) => p.name))
      let n = paletas.length + 1
      while (usados.has(`Paleta ${n}`)) n++
      nomeFinal = `Paleta ${n}`
    }
    const nova = createPalette(nomeFinal)
    addColorToPalette(nova.id, hexAtivo)
    setActivePalette(nova.id)
    setNome('')
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-tinta-media">Paletas</h3>

      <form className="flex items-stretch gap-2.5 flex-wrap" onSubmit={criar}>
        <div className="campo flex-1 min-w-0 basis-[220px]">
          <label htmlFor={idCampo}>Nova paleta</label>
          <input
            ref={campo}
            id={idCampo}
            type="text"
            value={nome}
            maxLength={60}
            placeholder="Nome (opcional)"
            spellCheck={false}
            autoComplete="off"
            onChange={(ev) => setNome(ev.target.value)}
          />
        </div>
        <button type="submit" className="pilula self-center">
          Criar com a cor ativa
        </button>
      </form>

      {pronto && paletas.length === 0 && (
        <p className="mt-3.5 text-sm text-tinta-fraca">Nenhuma paleta salva. Crie uma acima para guardar cores.</p>
      )}

      {paletas.length > 0 && (
        <ul className="list-none mt-[22px] mb-0 p-0 grid gap-0">
          {paletas.map((p) => (
            <LinhaPaleta key={p.id} paleta={p} ativa={p.id === ativaId} hexAtivo={hexAtivo} />
          ))}
        </ul>
      )}
    </div>
  )
}
