/**
 * Lista de seções navegáveis da página para os componentes Topo e BarraAtiva.
 */
export const SECOES = [
  { id: 'seletor', rotulo: 'Seletor' },
  { id: 'colecao', rotulo: 'Coleção' },
  { id: 'analise', rotulo: 'Análise' },
  { id: 'exportar', rotulo: 'Exportar' },
] as const

export const IDS_SECOES: readonly string[] = SECOES.map((secao) => secao.id)
