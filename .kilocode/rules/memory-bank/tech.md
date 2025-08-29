# Stack de Tecnologia: Lumen

## Linguagens e Frameworks

*   **Linguagem Principal:** TypeScript
*   **Framework Web:** Next.js (utilizando o App Router)
*   **Biblioteca de UI:** React

## Estilização

*   **Framework CSS:** Tailwind CSS
*   **Processador CSS:** PostCSS (com `@tailwindcss/postcss`)
*   **Fontes:** Geist Sans, Geist Mono, Inter

## Dependências Principais (Frontend)

*   **`@uiw/react-color-wheel`:** Componente de roda de cores para seleção interativa.
*   **`react-colorful`:** Outro componente de seletor de cores, leve e personalizável.
*   **`react-icons`:** Biblioteca para inclusão de ícones (ex: `BsMoon`, `BsSun` para o seletor de tema).

## Ferramentas de Desenvolvimento e Build

*   **Build e Desenvolvimento Local:** Next.js com Turbopack (`next dev --turbopack`).
*   **Linter:** ESLint, configurado com `eslint-config-next`.
*   **Gerenciador de Pacotes:** npm (inferido pelo `package-lock.json`).

## Configuração do Projeto

*   **TypeScript:** Configurado com caminhos de alias (`@/*` aponta para `./src/*`).
*   **Next.js:** Configuração básica com Turbopack habilitado.
*   **Tailwind CSS:** Configurado para escanear arquivos em `pages`, `components`, `app` e `src`.