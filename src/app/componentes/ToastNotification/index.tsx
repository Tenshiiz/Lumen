'use client'

import React, { useEffect } from 'react'
import { useToast } from '../../../context/ToastContext' // Importa o hook do contexto do toast

/**
 * COMPONENTE TOAST NOTIFICATION - VERSÃO COM CONTEXTO
 *
 * Este componente agora usa o Context API para obter seu estado e funções,
 * em vez de receber props. Isso permite que ele seja usado globalmente
 * em qualquer lugar da aplicação sem precisar passar props através de vários níveis.
 */
function ToastNotification() {
  // Usa o hook do contexto para acessar o estado e as funções do toast
  const { toastState, hideToast } = useToast()

  // Efeito para esconder automaticamente o toast após 3 segundos
  useEffect(() => {
    if (!toastState.show) return

    const timer = setTimeout(() => {
      hideToast() // Chama a função do contexto para esconder o toast
    }, 3000)

    // Cleanup: limpa o timer se o componente for desmontado ou o estado mudar
    return () => clearTimeout(timer)
  }, [toastState.show, hideToast])

  // Se o toast não deve ser mostrado, retorna null (não renderiza nada)
  if (!toastState.show) return null

  return (
    <div
      // Estilos inline convertidos para classes Tailwind CSS
      className={`
        fixed bottom-5 right-5 z-50
        bg-gray-900 text-white
        px-4 py-3 rounded-lg shadow-lg
        border border-gray-700
        animate-in slide-in-from-right-2 fade-in duration-300
        max-w-xs sm:max-w-sm
      `}
    >
      {/* Ícone baseado no tipo do toast (futuramente expandível) */}
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-sm">✓</span>
        <span className="text-sm font-medium">{toastState.message}</span>
      </div>
    </div>
  )
}

export default ToastNotification
