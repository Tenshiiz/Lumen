import { useCallback, useEffect, useRef } from 'react'

/**
 * Adia a confirmação de uma cor até a pessoa parar de mexer.
 *
 * Mouse e toque confirmam ao soltar (`agora`). Teclado não tem "soltar": cada
 * seta seria uma cor no histórico. `agendar` reinicia um relógio a cada passo e
 * só confirma quando o controle fica parado, ou quando perde o foco.
 * `agora` não faz nada se não houve mudança desde a última confirmação.
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

  // Ao desmontar, não perde uma confirmação pendente
  useEffect(() => agora, [agora])

  return { agendar, agora }
}
