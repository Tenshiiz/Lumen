import type { Metadata } from "next";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../context/ToastContext";
import ToastNotification from "./componentes/ToastNotification";
import { SCRIPT_CENA } from "./componentes/Cena/qualidade";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumen — Seletor e Ateliê de Cores",
  description: "Ferramenta de exploração, harmonias e contraste cromático para designers e desenvolvedores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // As variáveis do next/font ficam no <html>: o :root as referencia em
    // --letra/--numero, e um filho (body) não é visível a partir do :root.
    <html lang="pt-BR" className={`${figtree.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* síncrono: define data-cena antes do primeiro paint e da hidratação, para o blur do vidro não piscar */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CENA }} />
      </head>
      <body className="antialiased">
        <ToastProvider>
          {children}
          <ToastNotification />
        </ToastProvider>
      </body>
    </html>
  );
}
