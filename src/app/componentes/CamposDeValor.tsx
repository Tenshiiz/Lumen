'use client'

import { useId, useState, type KeyboardEvent } from 'react'
import { EXEMPLO_CAMPO, formatarCampo, interpretarCampo, type FormatoCampo } from '@/lib/color'
import { useColorStore, useHex } from '@/stores/useColorStore'
import { useCopiar } from '@/hooks/useCopiar'
import { IconeCheck, IconeCopiar } from './Icones'

const CAMPOS: { formato: FormatoCampo; rotulo: string }[] = [
  { formato: 'hex', rotulo: 'Hex' },
  { formato: 'rgb', rotulo: 'RGB' },
  { formato: 'hsl', rotulo: 'HSL' },
  { formato: 'cmyk', rotulo: 'CMYK' },
]

// Estado temporário de digitação associado ao valor HEX de referência
interface Rascunho {
  texto: string
  base: string
}

function CampoDeValor({ formato, rotulo }: { formato: FormatoCampo; rotulo: string }) {
  const hex = useHex()
  const setFromHex = useColorStore((estado) => estado.setFromHex)
  const commitColor = useColorStore((estado) => estado.commitColor)
  const { copiar, copiado } = useCopiar()

  const idInput = useId()
  const idAviso = useId()
  const [rascunho, setRascunho] = useState<Rascunho | null>(null)
  const [invalido, setInvalido] = useState(false)

  const formatado = formatarCampo(hex, formato)
  const emEdicao = rascunho !== null && rascunho.base === hex
  const exibido = emEdicao ? rascunho.texto : formatado

  function confirmar() {
    if (!emEdicao) return
    const novo = interpretarCampo(formato, rascunho.texto)
    if (novo) {
      setFromHex(novo)
      commitColor()
      setRascunho(null)
      setInvalido(false)
    } else {
      setInvalido(true)
    }
  }

  function aoTeclar(ev: KeyboardEvent<HTMLInputElement>) {
    if (ev.key === 'Enter') {
      ev.preventDefault()
      confirmar()
    } else if (ev.key === 'Escape') {
      setRascunho(null)
      setInvalido(false)
    }
  }

  // Contêiner em grid para alinhamento e acessibilidade sem aninhamento de botões no label
  return (
    <div className="group relative min-w-0 py-[13px] pb-[15px] px-[clamp(10px,1.4vw,18px)] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-1.5 [&:not(:first-child)]:before:content-[''] [&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:left-0 [&:not(:first-child)]:before:top-[18%] [&:not(:first-child)]:before:bottom-[18%] [&:not(:first-child)]:before:w-px [&:not(:first-child)]:before:bg-[rgba(var(--tinta-rgb),0.10)] max-[760px]:[&:nth-child(odd)]:before:hidden max-[760px]:[&:nth-child(n+3)]:border-t max-[760px]:[&:nth-child(n+3)]:border-[rgba(var(--tinta-rgb),0.08)]">
      <label
        htmlFor={idInput}
        className={`col-span-full text-[12px] tracking-[0.14em] uppercase font-semibold transition-colors duration-[var(--t-curto)] ease-[var(--ease)] ${
          invalido ? 'text-[var(--sinal-erro)]' : 'text-[var(--tinta-fraca)]'
        }`}
      >
        {rotulo}
      </label>
      <input
        id={idInput}
        type="text"
        value={exibido}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={invalido}
        aria-describedby={invalido ? idAviso : undefined}
        className="w-full min-w-0 mt-[3px] border-0 py-[2px] px-0 bg-transparent text-[var(--tinta)] font-mono text-[15px] tabular-nums shadow-[inset_0_-1px_0_transparent] transition-[box-shadow] duration-[var(--t-curto)] ease-[var(--ease)] hover:shadow-[inset_0_-1px_0_rgba(var(--tinta-rgb),0.22)] focus:outline-none focus:shadow-[inset_0_-1.5px_0_var(--luz-quente)] aria-[invalid=true]:shadow-[inset_0_-1.5px_0_var(--sinal-erro)]"
        onChange={(ev) => {
          setRascunho({ texto: ev.target.value, base: hex })
          setInvalido(false)
        }}
        onBlur={confirmar}
        onKeyDown={aoTeclar}
      />
      <button
        type="button"
        className="row-start-2 border-0 p-[5px] -mr-[5px] bg-transparent text-[var(--tinta-fraca)] cursor-pointer rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-[opacity,color,transform] duration-[var(--t-curto)] ease-[var(--ease)] hover:text-[var(--tinta)] active:scale-90"
        aria-label={`Copiar ${rotulo}`}
        title={`Copiar ${rotulo}`}
        onClick={() => copiar(formatado, rotulo)}
      >
        {copiado === rotulo ? <IconeCheck /> : <IconeCopiar />}
      </button>

      {invalido && (
        <p id={idAviso} role="alert" className="col-span-full mt-1.5 text-[14px] leading-[1.35] text-[var(--sinal-erro)]">
          Informe um valor {rotulo} válido, por exemplo {EXEMPLO_CAMPO[formato]}.
        </p>
      )}
    </div>
  )
}

function CamposDeValor() {
  return (
    <div className="border-t border-[rgba(var(--tinta-rgb),0.10)] bg-[linear-gradient(180deg,rgba(var(--escuro-rgb),0.34),rgba(var(--escuro-rgb),0.62))]">
      <div className="max-w-[1280px] mx-auto px-[clamp(12px,4.2vw,56px)] grid grid-cols-2 min-[761px]:grid-cols-4">
        {CAMPOS.map((campo) => (
          <CampoDeValor key={campo.formato} {...campo} />
        ))}
      </div>
    </div>
  )
}

export default CamposDeValor
