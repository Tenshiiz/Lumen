import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '@/context/ToastContext'

/**
 * Copia texto para a área de transferência e avisa pelo toast (que é uma região
 * `status`, então leitores de tela anunciam uma vez). `copiado` guarda o rótulo
 * do último item copiado por ~1,6 s, para o botão trocar o ícone.
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
