
function Glow() {
  return (
    
    <div className="absolute inset-0 overflow-hidden">
      {}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <defs>
          {}
          <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
            {}
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        {}
        <rect width="100%" height="100%" fill="url(#grid)" className="text-white" />
      </svg>

      {}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-28 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 60%)",
        }}
      />

      {}
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
