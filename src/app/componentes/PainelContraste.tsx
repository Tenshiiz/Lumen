'use client'

import { useId, useState } from 'react'
import { colord } from '@/lib/color/setup'
import { hexTolerante } from '@/lib/color/campos'
import { useColorStore, useHex } from '@/stores/useColorStore'
import { IconeCheck, IconeErro } from './Icones'

const EXEMPLO = '#141838'

const CRITERIOS = [
  { chave: 'aa', rotulo: 'AA, texto normal', minimo: 4.5 },
  { chave: 'aaa', rotulo: 'AAA, texto normal', minimo: 7 },
  { chave: 'aa-grande', rotulo: 'AA, texto grande', minimo: 3 },
  { chave: 'aaa-grande', rotulo: 'AAA, texto grande', minimo: 4.5 },
]

export default function PainelContraste() {
  const texto = useHex()
  const setFromHex = useColorStore((e) => e.setFromHex)
  const commitColor = useColorStore((e) => e.commitColor)
  const idCampo = useId()
  const idAviso = useId()
  const [entrada, setEntrada] = useState(EXEMPLO)

  const fundo = hexTolerante(entrada)
  // Razão de contraste WCAG calculada entre a cor ativa e a cor de fundo
  const razao = fundo ? colord(texto).contrast(fundo) : null

  function inverter() {
    if (!fundo) return
    setEntrada(texto)
    setFromHex(fundo)
    commitColor()
  }

  return (
    <div className="grid grid-cols-1 min-[821px]:grid-cols-[1.15fr_0.85fr] gap-[clamp(22px,3.6vw,46px)] items-start">
      <div>
        {fundo ? (
          <div
            className="rounded-card p-[28px_26px] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.22),inset_0_-2px_4px_rgba(var(--escuro-rgb),0.55)] transition-[background-color,color] duration-[0.55s] ease-[var(--ease)] [&>p:first-child]:text-[27px] [&>p:first-child]:font-semibold [&>p:first-child]:leading-[1.24] [&>p:first-child]:mb-[9px] [&>p:first-child]:tracking-[-0.015em] [&>p:last-child]:text-[15px]"
            style={{ background: fundo, color: texto }}
          >
            <p>Texto sobre a superfície</p>
            <p>Corpo de leitura em tamanho pequeno, que é o caso mais exigente.</p>
          </div>
        ) : (
          <div className="rounded-card p-[28px_26px] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.22),inset_0_-2px_4px_rgba(var(--escuro-rgb),0.55)] transition-[background-color,color] duration-[0.55s] ease-[var(--ease)] [&>p:first-child]:text-[27px] [&>p:first-child]:font-semibold [&>p:first-child]:leading-[1.24] [&>p:first-child]:mb-[9px] [&>p:first-child]:tracking-[-0.015em] [&>p:last-child]:text-[15px] bg-[rgba(var(--escuro-rgb),0.55)] text-tinta-fraca">
            <p>Sem amostra</p>
            <p>Informe uma cor de fundo válida para ver o texto sobre ela.</p>
          </div>
        )}

        <div className="flex items-stretch gap-2.5 mt-4 [&>*:first-child]:flex-1 [&>*:first-child]:min-w-0">
          <div className="campo">
            <label htmlFor={idCampo}>Cor de fundo</label>
            <input
              id={idCampo}
              value={entrada}
              onChange={(ev) => setEntrada(ev.target.value)}
              aria-invalid={!fundo}
              aria-describedby={fundo ? undefined : idAviso}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            className="pilula self-center disabled:opacity-45 disabled:cursor-not-allowed"
            onClick={inverter}
            disabled={!fundo}
            title="Troca a cor de texto com a cor de fundo"
          >
            Inverter
          </button>
        </div>

        {!fundo && (
          <p id={idAviso} className="mt-3 text-sm text-sinal-erro" role="alert">
            Informe uma cor de fundo válida em hexadecimal, por exemplo #141838.
          </p>
        )}
      </div>

      <div>
        <p className="text-sm text-tinta-media mb-2.5 [&>span]:font-mono [&>span]:text-tinta [&>span]:ml-1">
          Texto <span>{texto}</span>
        </p>
        {razao === null ? (
          <p className="font-mono text-[clamp(42px,6.4vw,66px)] font-medium leading-none tabular-nums [&>small]:text-[0.46em] text-tinta-fraca" aria-label="Sem razão de contraste">
            &mdash;
          </p>
        ) : (
          <p
            className="font-mono text-[clamp(42px,6.4vw,66px)] font-medium leading-none tabular-nums [&>small]:text-[0.46em]"
            style={{
              color:
                razao >= 4.5 ? 'var(--sinal-ok)' : razao >= 3 ? 'var(--sinal-alerta)' : 'var(--sinal-erro)',
            }}
          >
            {razao.toFixed(2)}
            <small>:1</small>
          </p>
        )}
        <p className="mt-[9px] text-xs tracking-[0.14em] uppercase font-semibold text-tinta-fraca">Razão de contraste</p>

        {razao !== null && (
          <ul className="list-none mt-5 p-0 grid gap-3">
            {CRITERIOS.map((c) => {
              const passa = razao >= c.minimo
              return (
                <li
                  key={c.chave}
                  className={`grid grid-cols-[16px_1fr_auto] items-center gap-2.5 text-sm text-tinta-media [&>em]:not-italic [&>em]:font-mono [&>em]:text-tinta-fraca [&>strong]:font-semibold ${
                    passa
                      ? '[&>svg]:text-sinal-ok [&>strong]:text-sinal-ok'
                      : '[&>svg]:text-sinal-erro [&>strong]:text-sinal-erro'
                  }`}
                >
                  {passa ? <IconeCheck /> : <IconeErro />}
                  <span>
                    {c.rotulo} <em>({c.minimo}:1)</em>
                  </span>
                  <strong>{passa ? 'aprovado' : 'reprovado'}</strong>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
