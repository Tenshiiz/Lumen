# Arquitetura do Projeto: Lumen

## Visão Geral da Arquitetura

O projeto Lumen é uma aplicação web construída com Next.js e segue a estrutura do **App Router**. A arquitetura é baseada em componentes React, com uma clara separação entre páginas, componentes reutilizáveis e estilos globais.

## Estrutura de Diretórios

*   **`src/app/`**: Contém a estrutura principal da aplicação.
    *   **`layout.tsx`**: Define o layout raiz da aplicação, incluindo a estrutura HTML, fontes e estilos globais.
    *   **`page.tsx`**: É a página inicial (landing page) da aplicação.
    *   **`globals.css`**: Estilos globais e variáveis CSS, incluindo configuração para tema claro/escuro.
    *   **`componentes/`**: Diretório que agrupa os componentes React reutilizáveis.
        *   **`Header/`**: Componente de cabeçalho, responsável pela navegação e pelo seletor de tema.
        *   **`PickerColor/`**: Componente que encapsula a funcionalidade do seletor de cores (`color wheel`).
        *   **`Sidebar/`**: Componente de barra lateral (funcionalidade a ser detalhada).
        *   **`Glow/`**: Componente para efeitos visuais de brilho.

## Componentes Principais e Relacionamentos

*   **`RootLayout` ([`src/app/layout.tsx`](src/app/layout.tsx:28))**: É o componente pai de toda a aplicação. Ele envolve o conteúdo das páginas (`children`) e aplica as fontes e estilos globais.
*   **`Home` ([`src/app/page.tsx`](src/app/page.tsx:7))**: A página principal que renderiza a landing page. Ela compõe a UI utilizando os componentes `Header`, `Glow`, e `Sidebar`.
*   **`Header` ([`src/app/componentes/Header/index.tsx`](src/app/componentes/Header/index.tsx:7))**: Um componente `client-side` (`'use client'`) que gerencia o estado do tema (claro/escuro) e o efeito de blur no scroll.
*   **`PickerColor` ([`src/app/componentes/PickerColor/index.tsx`](src/app/componentes/PickerColor/index.tsx:6))**: Componente `client-side` que utiliza a biblioteca `@uiw/react-color-wheel` para a seleção de cores interativa.

## Decisões Técnicas Chave

*   **Next.js App Router:** A escolha pelo App Router indica uma abordagem moderna para roteamento e renderização no Next.js, favorecendo Server Components por padrão.
*   **Componentização:** A aplicação é bem modularizada em componentes React, facilitando a manutenção e reutilização.
*   **Estilização com Tailwind CSS:** O uso do Tailwind CSS permite um desenvolvimento rápido da UI com classes utilitárias, mantendo a consistência visual.
*   **Uso de `use client`:** Componentes que necessitam de interatividade e estado (como `Header` e `PickerColor`) são corretamente marcados como Client Components.