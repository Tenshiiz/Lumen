import { useCallback, useEffect, useRef } from 'react'

/**
 * Adia a confirmação de alterações de cor com debounce, permitindo execução imediata ao finalizar gestos.
 */
export function useCommitAdiado(confirmar: () => void, atrasoMs = 700) {
  const relogio = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pendente = useRef(false)
  const confirmarRef = useRef(confirmar)

  useEffect(() => {
    confirmarRef.current = confirmar
  })

  const agora = useCallback(() => {
    clearTimeout(relogio.current)
    if (!pendente.current) return
    pendente.current = false
    confirmarRef.current()
  }, [])

  const agendar = useCallback(() => {
    pendente.current = true
    clearTimeout(relogio.current)
    relogio.current = setTimeout(agora, atrasoMs)
  }, [agora, atrasoMs])

  // Confirma alterações pendentes antes da desmontagem
  useEffect(() => agora, [agora])

  return { agendar, agora }
}
