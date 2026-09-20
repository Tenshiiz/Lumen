import CenaCarregador from './CenaCarregador'

/**
 * Fundo da página: uma cidade à noite vista por uma janela. Esta versão é só a
 * base em CSS (céu, reflexo, vinheta, grão e moldura), que já vem no HTML do
 * servidor: o vidro das lâminas tem o que desfocar antes de qualquer
 * JavaScript rodar, e sem JavaScript ela é a cena inteira. O CenaCarregador
 * traz a cidade em canvas para dentro do .pano depois do primeiro paint; quando
 * ela termina de desenhar, o .pano recebe data-pronto e o gradiente sai.
 */
function Cena() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden [background:linear-gradient(0deg,var(--predio-perto)_0%,rgba(var(--escuro-rgb),0)_30%),radial-gradient(130%_62%_at_50%_64%,var(--ceu-6)_0%,var(--ceu-5)_16%,var(--ceu-4)_34%,var(--ceu-3)_54%,var(--ceu-2)_76%,var(--ceu-1)_100%)] data-[pronto=true]:[background:var(--ceu-1)]"
        aria-hidden="true"
      >
        <CenaCarregador />
      </div>
      <div
        className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen [background:radial-gradient(58%_46%_at_4%_106%,rgba(var(--luz-rgb),0.42),rgba(var(--luz-rgb),0.10)_48%,transparent_74%),radial-gradient(26%_20%_at_11%_90%,rgba(var(--luz-rgb),0.20),transparent_70%)] animate-oscilar motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[1] pointer-events-none [background:linear-gradient(116deg,transparent_36%,rgba(var(--tinta-rgb),0.045)_45%,transparent_54%)]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[2] pointer-events-none [background:radial-gradient(ellipse_120%_92%_at_46%_46%,transparent_46%,rgba(var(--escuro-rgb),0.62)_100%)]"
        aria-hidden="true"
      />
      <svg
        className="fixed inset-0 w-full h-full z-[3] pointer-events-none opacity-[0.06] mix-blend-overlay"
        aria-hidden="true"
        focusable="false"
      >
        <filter id="lumen-grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lumen-grao)" />
      </svg>
      <div
        className="fixed inset-0 z-[60] pointer-events-none shadow-[inset_0_0_0_10px_var(--moldura),inset_0_0_0_11px_var(--moldura-brilho),inset_0_0_70px_12px_rgba(var(--escuro-rgb),0.55)] max-[700px]:shadow-[inset_0_0_0_5px_var(--moldura),inset_0_0_0_6px_var(--moldura-brilho)]"
        aria-hidden="true"
      />
    </>
  )
}

export default Cena
