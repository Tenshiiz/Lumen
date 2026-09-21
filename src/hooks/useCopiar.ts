import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '@/context/ToastContext'

/**
 * Copia texto para a área de transferência com feedback temporário e notificação via toast.
 */
export function useCopiar() {
  const { showToast } = useToast()
  const [copiado, setCopiado] = useState<string | null>(null)
  const relogio = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(relogio.current), [])

  const copiar = useCallback(
    async (texto: string, rotulo: string) => {
      try {
        await navigator.clipboard.writeText(texto)
        setCopiado(rotulo)
        clearTimeout(relogio.current)
        relogio.current = setTimeout(() => setCopiado(null), 1600)
        showToast(`${rotulo} copiado: ${texto}`, 'success')
      } catch {
        showToast('Não foi possível copiar. Verifique a permissão da área de transferência.', 'error')
      }
    },
    [showToast],
  )

  return { copiar, copiado }
}
