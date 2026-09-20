'use client'

import { useEffect } from 'react'
import { useToast } from '@/context/ToastContext'
import { IconeAviso, IconeCheck, IconeErro } from './Icones'

function ToastNotification() {
  const { toastState, hideToast } = useToast()
  const { show, message, type } = toastState

  useEffect(() => {
    if (!show) return
    const relogio = setTimeout(hideToast, 3200)
    return () => clearTimeout(relogio)
  }, [show, message, hideToast])

  // O contêiner existe sempre: uma região `status` precisa estar na página antes
  // de o texto mudar para o leitor de tela anunciá-la.
  return (
    <div
      className="fixed left-1/2 bottom-7 z-[70] flex items-center gap-2.5 max-w-[min(440px,calc(100%-32px))] py-3 px-[18px] rounded-[var(--raio-pilula)] text-[14px] text-[var(--tinta)] bg-[rgba(var(--escuro-rgb),0.82)] backdrop-blur-[var(--desfoque-lamina)] backdrop-saturate-[165%] shadow-[inset_0_1px_0_rgba(var(--tinta-rgb),0.2),inset_0_-1px_1px_rgba(var(--escuro-rgb),0.6),0_0_0_1px_rgba(var(--tinta-rgb),0.06),0_22px_44px_-18px_rgba(var(--escuro-rgb),0.9)] pointer-events-none transition-[transform,opacity] duration-[var(--t-medio)] ease-[var(--ease)] -translate-x-1/2 translate-y-3.5 opacity-0 data-[visivel=true]:translate-y-0 data-[visivel=true]:opacity-100 [&>svg]:shrink-0 [&>svg]:text-[var(--sinal-ok)] data-[tipo=error]:[&>svg]:text-[var(--sinal-erro)] data-[tipo=warning]:[&>svg]:text-[var(--sinal-alerta)]"
      role="status"
      aria-live="polite"
      data-visivel={show}
      data-tipo={type}
    >
      {show && (
        <>
          {type === 'error' ? <IconeErro /> : type === 'warning' ? <IconeAviso /> : <IconeCheck />}
          <span>{message}</span>
        </>
      )}
    </div>
  )
}

export default ToastNotification
