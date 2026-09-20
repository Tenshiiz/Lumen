'use client'

import { useState } from 'react'
import { ACORDES, gerarAcorde, type TipoAcorde } from '@/lib/color/harmonies'
import { tintaSobre } from '@/lib/color/tinta'
import { useColorStore, useHex, useHsl } from '@/stores/useColorStore'
import { usePaletteStore } from '@/stores/usePaletteStore'
import { useToast } from '@/context/ToastContext'

export default function PainelHarmonias() {
  const hex = useHex()
  const hsl = useHsl()
  const setFromHex = useColorStore((e) => e.setFromHex)
  const commitColor = useColorStore((e) => e.commitColor)
  const { showToast } = useToast()
  const [tipo, setTipo] = useState<TipoAcorde>('analoga')

  const def = ACORDES.find((a) => a.tipo === tipo) ?? ACORDES[0]
  const cores = gerarAcorde(hsl, tipo, hex)

  function aplicar(cor: string) {
    setFromHex(cor)
    commitColor()
  }

  function salvar() {
    const { createPalette, addColorToPalette } = usePaletteStore.getState()
    const paleta = createPalette(`${def.rotulo} ${hex}`)
    cores.forEach((cor) => addColorToPalette(paleta.id, cor))
    showToast(`Paleta "${paleta.name}" salva com ${cores.length} cores.`, 'success')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-[22px]" role="group" aria-label="Tipo de harmonia">
        {ACORDES.map((a) => (
          <button
            key={a.tipo}
            type="button"
            className="pilula"
            aria-pressed={tipo === a.tipo}
            onClick={() => setTipo(a.tipo)}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      <div
        className="flex h-[clamp(130px,17vw,178px)] rounded-card overflow-hidden shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.28),inset_0_-2px_4px_rgba(var(--escuro-rgb),0.6)]"
        role="group"
        aria-label={`Cores da harmonia ${def.rotulo}`}
      >
        {cores.map((cor, i) => (
          <button
            key={i}
            type="button"
            className="flex-1 min-w-0 flex items-end justify-center px-0.5 pb-3.5 border-0 cursor-pointer font-mono text-xs font-medium tabular-nums transition-[flex,background-color] duration-[0.55s] ease-[var(--ease)] hover:flex-[1.45_1_0%] focus-visible:flex-[1.45_1_0%] focus-visible:outline-2 focus-visible:outline-tinta focus-visible:-outline-offset-5 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
            style={{
              background: cor,
              color: tintaSobre(cor) === 'clara' ? 'var(--tinta)' : 'var(--tinta-inversa)',
            }}
            aria-label={`Aplicar a cor ${cor}`}
            title={`Aplicar ${cor}`}
            onClick={() => aplicar(cor)}
          >
            {cor}
          </button>
        ))}
      </div>

      <p className="mt-[18px] max-w-[66ch] text-[15px] text-tinta-media">{def.descricao}</p>

      <button type="button" className="pilula mt-5" onClick={salvar}>
        Salvar como paleta
      </button>
    </div>
  )
}
