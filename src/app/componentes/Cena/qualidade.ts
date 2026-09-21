/**
 * Gerenciamento e persistência dos níveis de qualidade gráfica da cena.
 */
export type Qualidade = 'alta' | 'media' | 'baixa' | 'off'

export const NIVEIS: readonly Qualidade[] = ['alta', 'media', 'baixa', 'off']

export const CHAVE_CENA = 'lumen-cena'

export function ehQualidade(v: unknown): v is Qualidade {
  return v === 'alta' || v === 'media' || v === 'baixa' || v === 'off'
}

/** Retorna o nível de qualidade padrão ('baixa'). */
export function escolherPadrao(): Qualidade {
  return 'baixa'
}

export function lerSalva(): Qualidade | null {
  try {
    const v = localStorage.getItem(CHAVE_CENA)
    if (v === 'off') {
      localStorage.removeItem(CHAVE_CENA)
      return 'baixa'
    }
    return ehQualidade(v) ? v : null
  } catch {
    return null
  }
}

export function gravarSalva(q: Qualidade): void {
  try {
    localStorage.setItem(CHAVE_CENA, q)
  } catch {
    /* Armazenamento local indisponível */
  }
}

/**
 * Script síncrono injetado no cabeçalho HTML para definir data-cena antes da hidratação.
 */
export const SCRIPT_CENA = `(function(){try{var q=null;try{q=localStorage.getItem('${CHAVE_CENA}')}catch(e){}if(q==='off'){try{localStorage.removeItem('${CHAVE_CENA}')}catch(e){}q='baixa'}else if(q!=='alta'&&q!=='media'&&q!=='baixa'){q='baixa'}document.documentElement.dataset.cena=q}catch(e){}})();`

/* Estado reativo de qualidade observável por useSyncExternalStore */

let atual: Qualidade | null = null
const assinantes = new Set<() => void>()

export function qualidadeAtual(): Qualidade {
  if (atual === null || atual === 'off') {
    const salva = lerSalva()
    atual = (salva === 'off' ? null : salva) ?? escolherPadrao()
  }
  return atual
}

/**
 * Atualiza o nível global de qualidade e notifica os assinantes registrados.
 */
export function definirQualidadeGlobal(q: Qualidade, { persistir = true } = {}): void {
  atual = q
  if (persistir) gravarSalva(q)
  try {
    document.documentElement.dataset.cena = q
  } catch {
    /* Ambiente sem DOM */
  }
  assinantes.forEach((f) => f())
}

export function assinarQualidade(f: () => void): () => void {
  assinantes.add(f)
  return () => {
    assinantes.delete(f)
  }
}

export const qualidadeServidor = (): Qualidade => 'baixa'
