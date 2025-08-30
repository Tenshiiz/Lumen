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
        *   **`PickerColor/`**: Componente que orquestra a seleção de cores, contendo `RodaDeCores` e `InputColors`.
        *   **`RodaDeCores/`**: Componente customizado de canvas que renderiza uma roda de cores interativa para seleção visual.
        *   **`InputColors/`**: Componente que exibe e permite edição de valores de cor em diferentes formatos (HEX, RGB, HSL, CMYK).
        *   **`SideLeftbar/`**: Barra lateral esquerda com lista de cores recentes e paletas salvas.
        *   **`SideRightbar/`**: Barra lateral direita com lista de cores recentes e paletas salvas.
        *   **`Glow/`**: Componente para efeitos visuais de brilho.

## Componentes Principais e Relacionamentos

*   **`RootLayout` ([`src/app/layout.tsx`](src/app/layout.tsx:28))**: É o componente pai de toda a aplicação. Ele envolve o conteúdo das páginas (`children`) e aplica as fontes e estilos globais.
*   **`Home` ([`src/app/page.tsx`](src/app/page.tsx:7))**: A página principal que renderiza a landing page. Ela compõe a UI utilizando os componentes `Header`, `Glow`, `SideLeftbar`, `PickerColor` e `SideRightbar`.
*   **`Header` ([`src/app/componentes/Header/index.tsx`](src/app/componentes/Header/index.tsx:7))**: Um componente `client-side` (`'use client'`) que gerencia o estado do tema (claro/escuro) e o efeito de blur no scroll.
*   **`PickerColor` ([`src/app/componentes/PickerColor/index.tsx`](src/app/componentes/PickerColor/index.tsx:6))**: Componente `client-side` que orquestra a seleção de cores, contendo `RodaDeCores` e `InputColors`.
*   **`RodaDeCores` ([`src/app/componentes/RodaDeCores/index.tsx`](src/app/componentes/RodaDeCores/index.tsx:24))**: Componente `client-side` customizado que renderiza uma roda de cores interativa usando canvas, permitindo seleção visual de cores com drag-and-drop.
*   **`InputColors` ([`src/app/componentes/InputColors/index.tsx`](src/app/componentes/InputColors/index.tsx:61))**: Componente `client-side` que exibe valores de cor em diferentes formatos (HEX, RGB, HSL, CMYK) e permite edição do valor HEX.
*   **`SideLeftbar` ([`src/app/componentes/SideLeftbar/index.tsx`](src/app/componentes/SideLeftbar/index.tsx:5))**: Barra lateral esquerda que exibe cores recentes e paletas salvas (atualmente com dados estáticos).
*   **`SideRightbar` ([`src/app/componentes/SideRightbar/index.tsx`](src/app/componentes/SideRightbar/index.tsx:5))**: Barra lateral direita que exibe cores recentes e paletas salvas (atualmente com dados estáticos).

## Decisões Técnicas Chave

*   **Next.js App Router:** A escolha pelo App Router indica uma abordagem moderna para roteamento e renderização no Next.js, favorecendo Server Components por padrão.
*   **Componentização:** A aplicação é bem modularizada em componentes React, facilitando a manutenção e reutilização.
*   **Roda de Cores Customizada:** Em vez de usar bibliotecas prontas como `@uiw/react-color-wheel`, foi desenvolvido um componente customizado (`RodaDeCores`) usando Canvas para maior controle sobre a experiência do usuário e otimização de performance.
*   **Separação de Responsabilidades:** A lógica de conversão de cores permanece no componente `InputColors` para manter a coesão, evitando dependências desnecessárias.
*   **Estilização com Tailwind CSS:** O uso do Tailwind CSS permite um desenvolvimento rápido da UI com classes utilitárias, mantendo a consistência visual.
*   **Uso de `use client`:** Componentes que necessitam de interatividade e estado (como `Header`, `PickerColor`, `RodaDeCores` e `InputColors`) são corretamente marcados como Client Components.