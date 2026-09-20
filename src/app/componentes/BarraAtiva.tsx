'use client'

import type { MouseEvent } from 'react'
import { useHex } from '@/stores/useColorStore'
import { useCopiar } from '@/hooks/useCopiar'
import { useSaiuDeVista, useSecaoAtiva } from '@/hooks/useObservar'
import { IDS_SECOES, SECOES } from '../secoes'
import { IconeCheck, IconeCopiar, IconeSeta } from './Icones'

/**
 * Barra fixa que aparece quando o herói sai de vista e leva a cor ativa junto,
 * então o seletor não precisa ficar na tela durante a rolagem. É a única
 * superfície com desfoque sempre visível, de propósito.
 */
function BarraAtiva() {
  const hex = useHex()
  const { copiar, copiado } = useCopiar()
  const visivel = useSaiuDeVista('inicio')
  const ativa = useSecaoAtiva(IDS_SECOES)

  // Fecha o menu do celular depois de escolher uma seção
  const fecharMenu = (ev: MouseEvent<HTMLAnchorElement>) =>
    ev.currentTarget.closest('details')?.removeAttribute('open')

  return (
    <div
      className="fixed top-[14px] left-1/2 z-50 w-[min(880px,calc(100%-28px))] flex items-center justify-between gap-4 py-2 pr-2.5 pl-4 rounded-[var(--raio-pilula)] bg-[rgba(var(--escuro-rgb),0.58)] backdrop-blur-[var(--desfoque-lamina)] backdrop-saturate-[165%] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.22),inset_0_-1px_1px_rgba(var(--escuro-rgb),0.6),0_0_0_1px_rgba(var(--tinta-rgb),0.06),0_22px_44px_-22px_rgba(var(--escuro-rgb),0.9)] transition-[transform,opacity] duration-[var(--t-medio)] ease-[var(--ease)] -translate-x-1/2 -translate-y-[160%] opacity-0 data-[visivel=true]:translate-y-0 data-[visivel=true]:opacity-100"
      data-visivel={visivel}
      inert={!visivel}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="w-7 h-7 shrink-0 rounded-[9px] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.4),inset_0_-2px_3px_rgba(var(--escuro-rgb),0.45),0_0_0_1px_rgba(var(--escuro-rgb),0.5)]"
          style={{ backgroundColor: 'var(--cor-atual)' }}
          aria-hidden="true"
        />
        <span className="font-mono text-[15px] tabular-nums text-[var(--tinta)]">{hex}</span>
        <button
          type="button"
          className="grid place-items-center w-8 h-8 border-0 rounded-full cursor-pointer text-[var(--tinta-media)] bg-transparent transition-[color,background-color,transform] duration-[var(--t-curto)] ease-[var(--ease)] hover:text-[var(--tinta)] hover:bg-[rgba(var(--tinta-rgb),0.08)] active:scale-[0.94]"
          aria-label="Copiar cor ativa"
          title="Copiar cor ativa"
          onClick={() => copiar(hex, 'Hex')}
        >
          {copiado === 'Hex' ? <IconeCheck /> : <IconeCopiar />}
        </button>
      </div>

      <nav className="max-[760px]:hidden flex items-center gap-1" aria-label="Seções">
        {SECOES.map((secao) => (
          <a
            key={secao.id}
            href={`#${secao.id}`}
            className="text-[14px] font-medium no-underline text-[var(--tinta-media)] py-2 px-3.5 rounded-[var(--raio-pilula)] transition-[color,background-color] duration-[var(--t-curto)] ease-[var(--ease)] hover:text-[var(--tinta)] hover:bg-[rgba(var(--tinta-rgb),0.08)] aria-[current=location]:text-[var(--tinta)] aria-[current=location]:bg-[rgba(var(--luz-rgb),0.14)] aria-[current=location]:shadow-[inset_0_0_0_1px_rgba(var(--luz-rgb),0.38)]"
            aria-current={ativa === secao.id ? 'location' : undefined}
          >
            {secao.rotulo}
          </a>
        ))}
      </nav>

      <details className="hidden max-[760px]:block relative">
        <summary className="list-none [&::-webkit-details-marker]:hidden inline-flex items-center gap-1.5 cursor-pointer text-[14px] font-medium text-[var(--tinta-media)] py-2 px-3.5 rounded-[var(--raio-pilula)] shadow-[inset_0_0_0_1px_rgba(var(--tinta-rgb),0.16)]">
          Seções
          <IconeSeta />
        </summary>
        <div className="absolute right-0 top-[calc(100%+10px)] min-w-[190px] flex flex-col gap-0.5 p-2 rounded-[20px] bg-[rgba(var(--escuro-rgb),0.9)] backdrop-blur-[var(--desfoque-lamina)] backdrop-saturate-[165%] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.2),0_26px_50px_-22px_rgba(var(--escuro-rgb),0.95)]">
          {SECOES.map((secao) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              className="text-[14px] font-medium no-underline text-[var(--tinta-media)] py-2 px-3.5 rounded-[var(--raio-pilula)] transition-[color,background-color] duration-[var(--t-curto)] ease-[var(--ease)] hover:text-[var(--tinta)] hover:bg-[rgba(var(--tinta-rgb),0.08)] aria-[current=location]:text-[var(--tinta)] aria-[current=location]:bg-[rgba(var(--luz-rgb),0.14)] aria-[current=location]:shadow-[inset_0_0_0_1px_rgba(var(--luz-rgb),0.38)]"
              aria-current={ativa === secao.id ? 'location' : undefined}
              onClick={fecharMenu}
            >
              {secao.rotulo}
            </a>
          ))}
        </div>
      </details>
    </div>
  )
}

export default BarraAtiva
