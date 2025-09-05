import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090A0B] flex flex-col">
      {}
      <header className="w-full py-4 px-4 sm:py-6 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logoSemNome.svg"
              alt="Lumen Logo"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-400 to-violet-600 bg-clip-text text-transparent">
              Lumen
            </span>
          </Link>
        </div>
      </header>

      {}
      <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-sky-400/10 to-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-violet-600/10 to-sky-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}