// Componente Glow: Gera um fundo visual com grid e gradientes para a aplicação.
function Glow() {
  return (
    // Contêiner principal para o efeito de fundo, cobrindo toda a área e escondendo overflow.
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG para renderizar um padrão de grade sutil. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Definição do padrão de grade. */}
          <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Caminho que forma uma célula da grade. */}
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        {/* Retângulo que aplica o padrão de grade. */}
        <rect width="100%" height="100%" fill="url(#grid)" className="text-white" />
      </svg>

      {/* Gradiente radial azul no canto superior-direito */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-28 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 60%)",
        }}
      />

      {/* Gradiente radial roxo no canto superior-esquerdo (oposto do azul) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-60 -left-28 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(139,92,246,0.26) 0%, rgba(139,92,246,0) 60%)",
        }}
      />
    </div>
  );
}

export default Glow;
