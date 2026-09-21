'use client'

import { useColorStore, useHex } from '@/stores/useColorStore'
import { useCopiar } from '@/hooks/useCopiar'
import RodaSeletor from './RodaSeletor'
import Fader from './Fader'
import CamposDeValor from './CamposDeValor'
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

  return (
    <div id="seletor" className="flex-1 flex flex-col justify-between relative">
      {/* Vão da janela: centralização vertical do disco seletor */}
      <div className="flex-1 flex items-center justify-center relative z-10 min-h-[160px] py-3 px-4">
        <div className="peitoril-disco">
          <RodaSeletor />
        </div>
      </div>

      <div className="peitoril">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,64px)] pb-[clamp(24px,3.6vh,42px)] grid grid-cols-1 max-[900px]:justify-stretch min-[901px]:grid-cols-[auto_minmax(260px,500px)] min-[901px]:justify-between items-end gap-x-[clamp(30px,6vw,90px)] gap-y-[clamp(20px,3vh,34px)]">
        <div className="min-w-0">
          <span className="inline-block font-mono font-normal text-[clamp(38px,4.8vw,66px)] tracking-[-0.035em] leading-none tabular-nums text-[var(--tinta)] pb-[11px] border-b-[3px] border-[var(--cor-atual)] transition-[border-color] duration-[var(--t-curto)] ease-[var(--ease)]">
            {hex}
          </span>
          <div className="mt-[13px] flex items-center gap-[18px] flex-wrap">
            <p className="font-mono text-[14px] tabular-nums text-[var(--tinta-fraca)]">Matiz {h}°</p>
            <button
              type="button"
              className="border-0 py-1 bg-transparent cursor-pointer inline-flex items-center gap-[7px] text-[14px] font-medium text-[var(--tinta-media)] shadow-[inset_0_-1px_0_transparent] transition-[color,box-shadow] duration-[var(--t-curto)] ease-[var(--ease)] hover:text-[var(--tinta)] hover:shadow-[inset_0_-1px_0_rgba(var(--tinta-rgb),0.5)] active:scale-[0.96]"
              onClick={() => copiar(hex, 'Hex')}
            >
              {copiado === 'Hex' ? <IconeCheck /> : <IconeCopiar />}
              Copiar
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
