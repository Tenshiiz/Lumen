'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Carregamento dinâmico sem SSR para componentes dependentes de Canvas 2D
const CenaCanvas = dynamic(() => import('./CenaCanvas'), { ssr: false })

/**
 * Monta a camada dinâmica de canvas no cliente após a hidratação inicial.
 */
export default function CenaCarregador() {
  const [liberado, setLiberado] = useState(false)

  useEffect(() => {
    setLiberado(true)
  }, [])

  if (!liberado) return null
  return <CenaCanvas />
}
