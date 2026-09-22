'use client'

import { useId, type CSSProperties } from 'react'
import { useCommitAdiado } from '@/hooks/useCommitAdiado'

interface FaderProps {
  rotulo: string
  valor: number
  min?: number
  max?: number
  unidade?: string
  /** Valor CSS do gradiente do trilho. */
  trilho: string
  onChange: (valor: number) => void
  /** Callback executado após a conclusão do ajuste. */
  onCommit: () => void
}

function Fader({ rotulo, valor, min = 0, max = 100, unidade = '%', trilho, onChange, onCommit }: FaderProps) {
  const id = useId()
  const { agendar, agora } = useCommitAdiado(onCommit)

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] tracking-[0.14em] uppercase font-semibold text-[var(--tinta-fraca)]">
          {rotulo}
        </label>
        <output htmlFor={id} className="font-mono text-[15px] tabular-nums text-[var(--tinta-media)]">
          {valor}
          {unidade}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={valor}
        aria-valuetext={`${valor}${unidade === '%' ? ' por cento' : unidade}`}
        className="fader-input"
        style={{ '--trilho': trilho } as CSSProperties}
        onChange={(e) => {
          onChange(Number(e.target.value))
          agendar()
        }}
        onPointerUp={agora}
        onBlur={agora}
      />
    </div>
  )
}

export default Fader
