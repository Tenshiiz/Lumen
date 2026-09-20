/**
 * Níveis de qualidade da cena e a persistência da escolha.
 *
 * O estado deste módulo é só a escolha do usuário (um valor + assinantes); o
 * motor de desenho mantém o seu próprio estado dentro de cada instância.
 */
export type Qualidade = 'alta' | 'media' | 'baixa' | 'off'

export const NIVEIS: readonly Qualidade[] = ['alta', 'media', 'baixa', 'off']

export const CHAVE_CENA = 'lumen-cena'

export function ehQualidade(v: unknown): v is Qualidade {
  return v === 'alta' || v === 'media' || v === 'baixa' || v === 'off'
}

/** Padrão do aparelho: fixa em 'baixa' (perfil leve e otimizado com chuva ativa). */
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
    /* armazenamento bloqueado ou cheio: a escolha vale só nesta sessão */
  }
}

/**
 * JavaScript mínimo, executado de forma síncrona no <head>, que define
 * data-cena antes da hidratação. Sem isso o desfoque do vidro pisca ao trocar
 * do valor padrão do CSS para o nível escolhido.
 */
export const SCRIPT_CENA = `(function(){try{var q=null;try{q=localStorage.getItem('${CHAVE_CENA}')}catch(e){}if(q==='off'){try{localStorage.removeItem('${CHAVE_CENA}')}catch(e){}q='baixa'}else if(q!=='alta'&&q!=='media'&&q!=='baixa'){q='baixa'}document.documentElement.dataset.cena=q}catch(e){}})();`

/* ── escolha atual, observável por useSyncExternalStore ── */

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
 * Aplica e avisa quem assina. `persistir: false` vale só nesta sessão: é o caso
 * da redução automática por desempenho, que não é uma escolha da pessoa e não
 * pode prender a cena num nível baixo nas próximas visitas.
 */
export function definirQualidadeGlobal(q: Qualidade, { persistir = true } = {}): void {
  atual = q
  if (persistir) gravarSalva(q)
  try {
    document.documentElement.dataset.cena = q
  } catch {
    /* sem DOM */
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
