'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ToastState {
  message: string
  show: boolean
  type?: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContextType {
  showToast: (message: string, type?: ToastState['type']) => void
  hideToast: () => void
  toastState: ToastState
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>({
    message: '',
    show: false,
    type: 'info'
  })

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToastState({
      message,
      show: true,
      type
    })
  }, [])

  const hideToast = useCallback(() => {
    setToastState(prev => ({
      ...prev,
      show: false
    }))
  }, [])

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

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error(
      'useToast deve ser usado dentro de um ToastProvider. ' +
      'Certifique-se de que o ToastProvider está envolvendo sua aplicação no layout.tsx'
    )
  }

  return context
}