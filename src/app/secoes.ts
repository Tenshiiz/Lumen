/**
 * Seções que a navegação (Topo e BarraAtiva) oferece. Cada entrada precisa ter
 * um elemento com esse id na página: uma âncora sem destino é um link morto.
 * A lista cresce conforme as seções passam a existir.
 */
export const SECOES = [
  { id: 'seletor', rotulo: 'Seletor' },
  { id: 'colecao', rotulo: 'Coleção' },
  { id: 'analise', rotulo: 'Análise' },
  { id: 'exportar', rotulo: 'Exportar' },
] as const

export const IDS_SECOES: readonly string[] = SECOES.map((secao) => secao.id)
