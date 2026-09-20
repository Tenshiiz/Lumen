'use client'

import { useColorStore, useHex } from '@/stores/useColorStore'
import FitaDeCores from './FitaDeCores'

/** Cores confirmadas na sessão, da mais recente para a mais antiga. */
export default function FitaRecentes() {
  const recentes = useColorStore((estado) => estado.recentColors)
  const setFromHex = useColorStore((estado) => estado.setFromHex)
  const commitColor = useColorStore((estado) => estado.commitColor)
  const hex = useHex()

  function aplicar(cor: string) {
    setFromHex(cor)
    commitColor()
  }

  return (
    <div>
      <h3 className="mb-2.5 text-sm font-medium text-tinta-media">Recentes</h3>
      {recentes.length === 0 ? (
        <p className="text-sm text-tinta-fraca">As cores que você confirmar aparecem aqui.</p>
      ) : (
        <FitaDeCores cores={recentes} rotulo="Cores recentes" aoAplicar={aplicar} atual={hex} />
      )}
    </div>
  )
}
