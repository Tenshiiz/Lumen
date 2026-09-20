'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// o motor e os canvases ficam fora do bundle inicial e do HTML do servidor
const CenaCanvas = dynamic(() => import('./CenaCanvas'), { ssr: false })

/**
 * Monta os canvases da cidade no cliente após a primeira hidratação.
 */
export default function CenaCarregador() {
  const [liberado, setLiberado] = useState(false)

  useEffect(() => {
    setLiberado(true)
  }, [])

  if (!liberado) return null
  return <CenaCanvas />
}
