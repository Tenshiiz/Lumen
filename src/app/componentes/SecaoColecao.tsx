'use client'

import { useEffect, useState } from 'react'
import { reidratar } from '@/stores/usePaletteStore'
import FitaRecentes from './FitaRecentes'
import ListaPaletas from './ListaPaletas'

export default function SecaoColecao() {
  const [pronto, setPronto] = useState(false)

  // Lê as paletas salvas só depois da montagem (o servidor renderiza vazio)
  useEffect(() => {
    let vivo = true
    reidratar().then(() => {
      if (vivo) setPronto(true)
    })
    return () => {
      vivo = false
    }
  }, [])

  return (
    <section
      id="colecao"
      aria-labelledby="titulo-colecao"
      className="w-full max-w-[1280px] mx-auto pt-[clamp(34px,6vh,70px)] px-[clamp(20px,5vw,64px)] pb-0"
    >
      <div className="rotulo-secao">
        <h2 id="titulo-colecao">Coleção</h2>
        <i />
      </div>
      <div className="lamina grid gap-[34px] p-[clamp(20px,4vw,34px)]">
        <FitaRecentes />
        <ListaPaletas pronto={pronto} />
      </div>
    </section>
  )
}
