# Arquitetura do Projeto: Lumen

## Visão Geral da Arquitetura

O projeto Lumen é uma aplicação web construída com Next.js e segue a estrutura do **App Router**. A arquitetura é baseada em componentes React, com uma clara separação entre páginas, componentes reutilizáveis e estilos globais. O gerenciamento de estado principal da cor é centralizado no componente `Home` (`page.tsx`) para permitir a comunicação entre componentes irmãos.

## Estrutura de Diretórios

*   **`src/app/`**: Contém a estrutura principal da aplicação.
    *   **`layout.tsx`**: Define o layout raiz da aplicação, incluindo a estrutura HTML, fontes e estilos globais.
    *   **`page.tsx`**: É a página inicial (landing page) da aplicação e o **controlador de estado de cor principal**.
<<<<<<< HEAD
    *   **`not-found.tsx`**: Define a página 404 global, que é exibida para qualquer rota não encontrada.
    *   **`(auth)/`**: Um **Route Group** para as páginas de autenticação. O layout dentro deste grupo é minimalista para focar no formulário.
        *   **`layout.tsx`**: Layout compartilhado para as páginas de login e registro.
        *   **`login/page.tsx`**: Página de login (`/login`).
        *   **`register/page.tsx`**: Página de registro (`/register`).
    *   **`componentes/`**: Diretório que agrupa os componentes React reutilizáveis.
        *   **`Header/`**: Componente de cabeçalho, responsável pela navegação, menu de usuário e seletor de tema.
        *   **`PickerColor/`**: Componente que orquestra a seleção de cores.
        *   **`RodaDeCores/`**: Componente customizado de canvas para seleção visual de cores.
        *   **`InputColors/`**: Componente para exibição e edição de valores de cor.
        *   **`SideLeftbar/`** e **`SideRightbar/`**: Barras laterais.
=======
    *   **`globals.css`**: Estilos globais e variáveis CSS, incluindo configuração para tema claro/escuro.
    *   **`componentes/`**: Diretório que agrupa os componentes React reutilizáveis.
        *   **`Header/`**: Componente de cabeçalho, responsável pela navegação e pelo seletor de tema.
        *   **`PickerColor/`**: Componente que orquestra a seleção de cores, contendo `RodaDeCores` e `InputColors`.
        *   **`RodaDeCores/`**: Componente customizado de canvas que renderiza uma roda de cores interativa para seleção visual.
        *   **`InputColors/`**: Componente que exibe e permite edição de valores de cor em diferentes formatos (HEX, RGB, HSL, CMYK).
        *   **`SideLeftbar/`**: Barra lateral esquerda com lista de cores recentes e paletas salvas, que pode atualizar a cor global.
        *   **`SideRightbar/`**: Barra lateral direita com lista de cores recentes e paletas salvas.
>>>>>>> 6e5cdabad9d1d6b49abf0ebe207101a21e42c1fd
        *   **`Glow/`**: Componente para efeitos visuais de brilho.

## Componentes Principais e Gerenciamento de Estado

<<<<<<< HEAD
*   **`Home` ([`src/app/page.tsx`](src/app/page.tsx:11))**: A página principal que gerencia o estado de cor global (`color` e `colors`).
*   **`PickerColor` ([`src/app/componentes/PickerColor/index.tsx`](src/app/componentes/PickerColor/index.tsx:16))**: Orquestra a seleção de cores, recebendo o estado da `Home` e gerenciando um estado interno (`committedColor`).
*   **`RodaDeCores` ([`src/app/componentes/RodaDeCores/index.tsx`](src/app/componentes/RodaDeCores/index.tsx:24))**: Componente de canvas com callbacks `onChange` (tempo real) e `onCommit` (confirmação).
*   **`SideLeftbar` ([`src/app/componentes/SideLeftbar/index.tsx`](src/app/componentes/SideLeftbar/index.tsx:6))**: Atualiza o estado de cor global na `Home`.
*   **`AuthLayout` ([`src/app/(auth)/layout.tsx`](src/app/(auth)/layout.tsx:4))**: Layout minimalista para as rotas de autenticação, garantindo performance ao não carregar componentes desnecessários.

## Decisões Técnicas Chave

*   **Elevação de Estado (State Lifting):** O estado de cor foi movido de `PickerColor` para `Home` (`page.tsx`) para permitir a comunicação entre componentes irmãos.
*   **Sincronização com `useEffect`:** Um `useEffect` em `PickerColor` sincroniza o estado `committedColor` com a prop `cor`, garantindo que seleções de cor externas se reflitam nos inputs.
*   **Route Groups para Performance**: A pasta `(auth)` é usada para aplicar um layout específico e mais leve às páginas de login/registro, evitando o carregamento do `Header` completo e das sidebars.
=======
*   **`Home` ([`src/app/page.tsx`](src/app/page.tsx:11))**: A página principal que agora gerencia o estado de cor global (`color` e `colors`). Ela passa o estado e as funções de atualização para os componentes filhos.
*   **`PickerColor` ([`src/app/componentes/PickerColor/index.tsx`](src/app/componentes/PickerColor/index.tsx:16))**: Componente `client-side` que recebe o estado de cor da `Home`. Ele gerencia um estado interno (`committedColor`) para controlar a atualização dos `InputColors` e sincroniza esse estado com a prop `cor` vinda da `Home` através de um `useEffect`.
*   **`RodaDeCores` ([`src/app/componentes/RodaDeCores/index.tsx`](src/app/componentes/RodaDeCores/index.tsx:24))**: Componente `client-side` customizado. Ele agora possui duas props de callback:
    *   `onChange`: Chamada em tempo real durante o arraste do mouse para atualizar o preview visual.
    *   `onCommit`: Chamada apenas no `mouseup` para "confirmar" a cor selecionada.
*   **`SideLeftbar` ([`src/app/componentes/SideLeftbar/index.tsx`](src/app/componentes/SideLeftbar/index.tsx:6))**: Barra lateral que, ao ter uma de suas cores clicada, chama a função `onColorSelect` para atualizar o estado de cor global na `Home`.
*   **`InputColors` ([`src/app/componentes/InputColors/index.tsx`](src/app/componentes/InputColors/index.tsx:57))**: Componente `client-side` que exibe os valores da cor. Ele lê o valor do estado `committedColor` do `PickerColor`, garantindo que só seja atualizado quando a cor é confirmada (seja pelo `mouseup` na roda ou por uma seleção externa).

## Decisões Técnicas Chave

*   **Elevação de Estado (State Lifting):** O estado de cor foi movido de `PickerColor` para `Home` (`page.tsx`) para permitir que componentes irmãos (`SideLeftbar` e `PickerColor`) compartilhem e modifiquem o mesmo estado.
*   **Sincronização com `useEffect`:** Um `useEffect` em `PickerColor` foi adicionado para sincronizar o estado `committedColor` com a prop `cor` vinda da `Home`. Isso garante que seleções de cor externas (como da `SideLeftbar`) se reflitam corretamente nos `InputColors`.
*   **Separação de Eventos de Cor:** A `RodaDeCores` agora distingue entre uma mudança de cor em tempo real (`onChange`) e uma confirmação de cor (`onCommit`), permitindo um controle mais granular da experiência do usuário.
>>>>>>> 6e5cdabad9d1d6b49abf0ebe207101a21e42c1fd
