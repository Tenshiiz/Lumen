import { useEffect, useState } from 'react'

/**
 * Detecta quando um elemento ultrapassa o topo da viewport através de IntersectionObserver.
 */
export function useSaiuDeVista(id: string) {
  const [saiu, setSaiu] = useState(false)

  useEffect(() => {
    const el = document.getElementById(id)
    if (!el) return
    const observador = new IntersectionObserver(([entrada]) => setSaiu(!entrada.isIntersecting), {
      rootMargin: '-35% 0px 0px 0px',
    })
    observador.observe(el)
    return () => observador.disconnect()
  }, [id])

  return saiu
}

/** Retorna o identificador da seção atualmente visível na faixa central da tela. */
export function useSecaoAtiva(ids: readonly string[]) {
  const [ativa, setAtiva] = useState<string | null>(null)

  useEffect(() => {
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elementos.length === 0) return

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setAtiva(entrada.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    elementos.forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [ids])

  return ativa
}
