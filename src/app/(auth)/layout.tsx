import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090A0B] flex flex-col">
      {/* Header minimalista apenas com logo e link para voltar */}
      <header className="w-full py-6 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logoSemNome.svg"
              alt="Lumen Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-violet-600 bg-clip-text text-transparent">
              Lumen
            </span>
          </Link>
        </div>
      </header>

      {/* Conteúdo principal centralizado */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Elemento decorativo sutil */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sky-400/10 to-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-600/10 to-sky-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}