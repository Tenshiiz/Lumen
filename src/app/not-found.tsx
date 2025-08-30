import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090A0B] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logoSemNome.svg"
            alt="Lumen Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Título com gradiente */}
        <h1 className="text-8xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-violet-600 bg-clip-text text-transparent mb-4">
          404
        </h1>

        {/* Subtítulo */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Página não encontrada
        </h2>

        {/* Descrição */}
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Desculpe, mas a página que você está procurando não existe ou foi movida.
        </p>

        {/* Botão de voltar */}
        <Link
          href="/"
          className="inline-block rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-400/60"
        >
          Voltar ao Início
        </Link>

        {/* Elemento decorativo */}
        <div className="mt-12 opacity-20">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-sky-400 to-violet-600 blur-xl"></div>
        </div>
      </div>
    </div>
  );
}