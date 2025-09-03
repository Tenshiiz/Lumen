# Stack de Tecnologia: Lumen

## Linguagens e Frameworks

*   **Linguagem Principal:** TypeScript
*   **Framework Web:** Next.js (utilizando o App Router)
*   **Biblioteca de UI:** React

## Autenticação e Banco de Dados

*   **Backend as a Service (BaaS):** [Supabase](https://supabase.com/)
    *   **Autenticação:** Gerenciamento de usuários, incluindo registro e login.
    *   **Banco de Dados:** PostgreSQL para armazenamento de dados (ainda a ser implementado).

## Estilização

*   **Framework CSS:** Tailwind CSS (v4)
*   **Processador CSS:** PostCSS (com `@tailwindcss/postcss`)
*   **Fontes:** Geist Sans, Geist Mono, Inter

## Dependências Principais (Frontend)

*   **`next`**: Framework principal da aplicação (v15.5.0).
*   **`react`**: Biblioteca para construção da interface (v19.1.0).
*   **`react-dom`**: Biblioteca para manipulação do DOM (v19.1.0).
*   **`@supabase/supabase-js`**: Cliente JavaScript para interagir com a API do Supabase (v2.56.1).
*   **`react-colorful`**: Dependência listada, mas o seletor de cores principal (`RodaDeCores`) é uma implementação customizada com Canvas (v5.6.1).
*   **`react-icons`**: Biblioteca para inclusão de ícones (ex: `BsMoon`, `BsSun` para o seletor de tema) (v5.5.0).
*   **`@types/node`**: Tipos TypeScript para Node.js (v20.x).
*   **`@types/react`**: Tipos TypeScript para React (v19.x).
*   **`@types/react-dom`**: Tipos TypeScript para React DOM (v19.x).

## Ferramentas de Desenvolvimento e Build

*   **Build e Desenvolvimento Local:** Next.js com Turbopack (`next dev --turbopack`).
*   **Linter:** ESLint, configurado com `eslint-config-next` (v9).
*   **Gerenciador de Pacotes:** npm (inferido pelo `package-lock.json`).
*   **SVG como Componentes:** Configuração Webpack com `@svgr/webpack` para importar arquivos `.svg` como componentes React.
*   **Testes:** Puppeteer para automação de testes (v24.18.0).

## Configuração do Projeto

*   **TypeScript:** Configurado com caminhos de alias (`@/*` aponta para `./src/*`).
*   **Next.js:** Configuração para habilitar Turbopack e processamento de SVGs.
*   **Tailwind CSS:** Configurado para escanear arquivos no diretório `src/` (v4).
*   **PostCSS:** Configurado com `@tailwindcss/postcss`.
*   **Variáveis de Ambiente:** Utilização de `.env` e `.env.local` para gerenciamento de credenciais do Supabase.
*   **Fontes:** Geist Sans, Geist Mono, Inter configuradas no layout.