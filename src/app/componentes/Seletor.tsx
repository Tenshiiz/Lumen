'use client'

import { useState } from 'react'
import { useColorStore, useHex } from '@/stores/useColorStore'
import { useCopiar } from '@/hooks/useCopiar'
import RodaSeletor from './RodaSeletor'
import Fader from './Fader'
import CamposDeValor from './CamposDeValor'
import PainelContexto from './PainelContexto'
import { IconeCheck, IconeCopiar } from './Icones'

function Seletor() {
  const hex = useHex()
  // Arredonda os valores HSV da store para exibição inteira na interface
  const h = Math.round(useColorStore((estado) => estado.hsv.h))
  const sat = Math.round(useColorStore((estado) => estado.hsv.s))
  const v = Math.round(useColorStore((estado) => estado.hsv.v))
  const setSaturation = useColorStore((estado) => estado.setSaturation)
  const setBrightness = useColorStore((estado) => estado.setBrightness)
  const commitColor = useColorStore((estado) => estado.commitColor)
  const { copiar, copiado } = useCopiar()
  const [painelAberto, setPainelAberto] = useState(true)

  return (
    <div id="seletor" className="flex-1 flex flex-col justify-between relative">
      {/* Vão da janela: Ateliê integrado no desktop (Roda à esquerda, Painel de Contexto à direita) */}
      <div className="flex-1 flex items-center justify-center relative z-10 min-h-0 py-1 max-[900px]:py-2 px-[clamp(16px,4vw,56px)] w-full max-w-[1360px] mx-auto">
        <div
          className={`w-full grid items-center transition-all duration-[var(--t-medio)] ease-[var(--ease)] ${
            painelAberto
              ? 'min-[1080px]:grid-cols-[1.1fr_0.9fr] min-[1080px]:gap-[clamp(30px,5vw,70px)]'
              : 'grid-cols-1'
          }`}
        >
          {/* Lado Esquerdo: Roda Cromática */}
          <div className="flex items-center justify-center">
            <div className="peitoril-disco">
              <RodaSeletor />
            </div>
          </div>

          {/* Lado Direito: Painel de Contexto no Desktop */}
          {painelAberto && (
            <div className="hidden min-[1080px]:block max-w-[500px] w-full ml-auto animate-in fade-in duration-300">
              <PainelContexto onFechar={() => setPainelAberto(false)} />
            </div>
          )}
        </div>
      </div>

      <div className="peitoril">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,64px)] pb-[clamp(24px,3.6vh,42px)] grid grid-cols-1 max-[900px]:justify-stretch min-[901px]:grid-cols-[auto_minmax(260px,500px)] min-[901px]:justify-between items-end gap-x-[clamp(30px,6vw,90px)] gap-y-[clamp(20px,3vh,34px)]">
        <div className="min-w-0">
          <span className="inline-block font-mono font-normal text-[clamp(42px,5.2vw,70px)] tracking-[-0.035em] leading-none tabular-nums text-[var(--tinta)] pb-[11px] border-b-[3px] border-[var(--cor-atual)] transition-[border-color] duration-[var(--t-curto)] ease-[var(--ease)]">
            {hex}
          </span>
          <div className="mt-[13px] flex items-center gap-[18px] flex-wrap">
            <p className="font-mono text-[15px] tabular-nums text-[var(--tinta-fraca)]">Matiz {h}°</p>
            <button
              type="button"
              className="border-0 py-1 bg-transparent cursor-pointer inline-flex items-center gap-[7px] text-[15px] font-medium text-[var(--tinta-media)] shadow-[inset_0_-1px_0_transparent] transition-[color,box-shadow] duration-[var(--t-curto)] ease-[var(--ease)] hover:text-[var(--tinta)] hover:shadow-[inset_0_-1px_0_rgba(var(--tinta-rgb),0.5)] active:scale-[0.96]"
              onClick={() => copiar(hex, 'Hex')}
            >
              {copiado === 'Hex' ? <IconeCheck /> : <IconeCopiar />}
              Copiar
            </button>
            <button
              type="button"
              className="hidden min-[1080px]:inline-flex items-center gap-[6px] border-0 py-1 px-2.5 rounded-[var(--raio-pilula)] bg-[rgba(var(--tinta-rgb),0.06)] cursor-pointer text-[13px] font-medium text-[var(--tinta-media)] hover:text-[var(--tinta)] hover:bg-[rgba(var(--tinta-rgb),0.1)] transition-colors active:scale-[0.96]"
              onClick={() => setPainelAberto(!painelAberto)}
              title={painelAberto ? 'Recolher painel para modo foco' : 'Expandir painel do ateliê'}
            >
              {painelAberto ? 'Modo Foco' : 'Ateliê'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[461px]:grid-cols-2 gap-[clamp(18px,2.6vw,34px)]">
          <Fader
            rotulo="Saturação"
            valor={sat}
            trilho="var(--trilho-saturacao)"
            onChange={setSaturation}
            onCommit={commitColor}
          />
          <Fader
            rotulo="Brilho"
            valor={v}
            trilho="var(--trilho-brilho)"
            onChange={setBrightness}
            onCommit={commitColor}
          />
        </div>
      </div>

      <CamposDeValor />
      </div>
    </div>
  )
}

export default Seletor
