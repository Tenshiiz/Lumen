'use client'

import { simular, VISOES } from '@/lib/color/daltonismo'
import { useHex } from '@/stores/useColorStore'

export default function PainelDaltonismo() {
  const hex = useHex()

  return (
    <div>
      <ul className="list-none m-0 p-0 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-x-3.5 gap-y-[18px]">
        {VISOES.map((v) => {
          const cor = simular(hex, v.tipo)
          return (
            <li key={v.nome}>
              <div
                className="h-[92px] rounded-campo shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.25),inset_0_-2px_3px_rgba(var(--escuro-rgb),0.5)] transition-[background-color] duration-[0.55s] ease-[var(--ease)] motion-reduce:transition-none"
                style={{ background: cor }}
                role="img"
                aria-label={`${v.nome}: ${cor}`}
              />
              <h3 className="mt-[11px] text-[15px] font-semibold">{v.nome}</h3>
              <p className="font-mono text-sm text-tinta-media tabular-nums">{cor}</p>
              <p className="mt-0.5 text-sm text-tinta-fraca">{v.prevalencia}</p>
            </li>
          )
        })}
      </ul>
      <p className="mt-[22px] max-w-[66ch] text-[15px] text-tinta-media">
        Simulação aproximada de como a cor selecionada é percebida em cada tipo de dicromacia. A forma mais comum,
        a deuteranomalia (tricromacia anômala, cerca de 5% dos homens), é mais branda e não está incluída.
      </p>
    </div>
  )
}
