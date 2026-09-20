import { SECOES } from '../secoes'

function Topo() {
  return (
    <header className="relative z-40 pt-[clamp(26px,4.4vh,40px)]">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,64px)] flex items-center justify-between gap-5">
        <a className="flex items-center gap-[11px] no-underline text-[var(--tinta)] font-bold text-[21px] tracking-[-0.02em]" href="#inicio">
          <span
            className="w-[17px] h-[17px] rounded-full shrink-0 bg-[radial-gradient(circle_at_34%_30%,var(--luz-quente),var(--luz-ambar)_62%,transparent_78%)] shadow-[0_0_18px_rgba(var(--luz-rgb),0.55)]"
            aria-hidden="true"
          />
          Lumen
        </a>

        <nav className="max-[760px]:hidden flex gap-1.5 items-center" aria-label="Seções">
          {SECOES.map((secao) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              className="text-[14px] font-medium no-underline text-[var(--tinta-media)] py-2 px-3.5 rounded-[var(--raio-pilula)] transition-[color,background-color] duration-[var(--t-curto)] ease-[var(--ease)] hover:text-[var(--tinta)] hover:bg-[rgba(var(--tinta-rgb),0.08)]"
            >
              {secao.rotulo}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Topo
