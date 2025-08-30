'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

/**
 * INTERFACE DO ESTADO DO TOAST
 * Define as propriedades que controlam o comportamento da notificação
 */
interface ToastState {
  message: string      // Texto da notificação
  show: boolean        // Controla se o toast está visível
  type?: 'success' | 'error' | 'info' | 'warning' // Tipo da notificação (para estilização futura)
}

/**
 * INTERFACE DAS FUNÇÕES DISPONÍVEIS NO CONTEXTO
 * Define as funções que os componentes podem chamar para interagir com o toast
 */
interface ToastContextType {
  showToast: (message: string, type?: ToastState['type']) => void  // Mostra uma notificação
  hideToast: () => void                                             // Esconde a notificação atual
  toastState: ToastState                                            // Estado atual do toast (apenas leitura)
}

/**
 * CONTEXTO DO TOAST
 * Este é o contexto que será usado pelos componentes para acessar as funções do toast
 * O valor padrão é undefined para forçar o uso dentro de um ToastProvider
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * PROVEDOR DO CONTEXTO DO TOAST
 * Este componente deve envolver toda a aplicação para que o contexto esteja disponível
 * em qualquer lugar da árvore de componentes
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  // Estado interno do toast
  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    show: false,
    type: 'info'
  })

  /**
   * FUNÇÃO PARA MOSTRAR UMA NOTIFICAÇÃO
   * @param message - Texto da notificação
   * @param type - Tipo da notificação (opcional, padrão: 'info')
   */
  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToastState({
      message,
      show: true,
      type
    })
  }, [])

  /**
   * FUNÇÃO PARA ESCONDER A NOTIFICAÇÃO ATUAL
   * Chamada automaticamente após 3 segundos ou quando o usuário clica para fechar
   */
  const hideToast = useCallback(() => {
    setToastState(prev => ({
      ...prev,
      show: false
    }))
  }, [])

  // Valor do contexto que será compartilhado com todos os componentes filhos
  const contextValue: ToastContextType = {
    showToast,
    hideToast,
    toastState
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * HOOK PERSONALIZADO PARA USAR O CONTEXTO DO TOAST
 * Este hook deve ser usado pelos componentes que precisam mostrar notificações
 *
 * Exemplo de uso:
 * const { showToast } = useToast()
 * showToast('Cor copiada com sucesso!')
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext)

  // Se o hook for usado fora de um ToastProvider, lança um erro
  if (context === undefined) {
    throw new Error(
      'useToast deve ser usado dentro de um ToastProvider. ' +
      'Certifique-se de que o ToastProvider está envolvendo sua aplicação no layout.tsx'
    )
  }

  return context
}