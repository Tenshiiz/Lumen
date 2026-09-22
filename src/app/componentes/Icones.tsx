import type { SVGProps } from 'react'

// Ícones SVG padronizados com traço de 1.8px e herança de cor via currentColor
function Icone({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconeCopiar = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.6" />
    <path d="M5 15V6.2A2.2 2.2 0 0 1 7.2 4H15" />
  </Icone>
)

export const IconeCheck = (p: SVGProps<SVGSVGElement>) => (
  <Icone strokeWidth="2.2" {...p}>
    <path d="M4 12.6 9.6 18.2 20 6.4" />
  </Icone>
)

export const IconeErro = (p: SVGProps<SVGSVGElement>) => (
  <Icone strokeWidth="2.2" {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icone>
)

export const IconeAviso = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M12 8v5M12 16.5v.01" />
    <path d="M10.3 4.6 3.4 17a2 2 0 0 0 1.7 3h13.8a2 2 0 0 0 1.7-3L13.7 4.6a2 2 0 0 0-3.4 0Z" />
  </Icone>
)

export const IconeSeta = (p: SVGProps<SVGSVGElement>) => (
  <Icone strokeWidth="2" {...p}>
    <path d="M6 9.5 12 15.5 18 9.5" />
  </Icone>
)

export const IconeFechar = (p: SVGProps<SVGSVGElement>) => (
  <Icone width="14" height="14" strokeWidth="2.2" {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icone>
)

export const IconeBaixar = (p: SVGProps<SVGSVGElement>) => (
  <Icone {...p}>
    <path d="M12 4v11M7.5 10.8 12 15.3l4.5-4.5M5 19.5h14" />
  </Icone>
)

export const IconeMais = (p: SVGProps<SVGSVGElement>) => (
  <Icone strokeWidth="2" {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icone>
)

