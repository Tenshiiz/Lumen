# Arquitetura do Projeto: Lumen

## Visão Geral da Arquitetura

O projeto Lumen é uma aplicação web construída com Next.js e segue a estrutura do **App Router**. A arquitetura é baseada em componentes React, com uma clara separação entre páginas, componentes reutilizáveis e estilos globais. O gerenciamento de estado principal da cor é centralizado no componente `Home` (`page.tsx`) para permitir a comunicação entre componentes irmãos.

## Estrutura de Diretórios

*   **`src/app/`**: Contém a estrutura principal da aplicação.
    *   **`layout.tsx`**: Define o layout raiz da aplicação, incluindo a estrutura HTML, fontes e estilos globais.
    *   **`page.tsx`**: É a página inicial (landing page) da aplicação e o **controlador de estado de cor principal**.
    *   **`not-found.tsx`**: Define a página 404 global, que é exibida para qualquer rota não encontrada.
    *   **`(auth)/`**: Um **Route Group** para as páginas de autenticação. O layout dentro deste grupo é minimalista para focar no formulário.
        *   **`layout.tsx`**: Layout compartilhado para as páginas de login e registro.
        *   **`login/page.tsx`**: Página de login (`/login`).
        *   **`register/page.tsx`**: Página de registro (`/register`).
    *   **`globals.css`**: Estilos globais e variáveis CSS, incluindo configuração para tema claro/escuro.
    *   **`componentes/`**: Diretório que agrupa os componentes React reutilizáveis.
        *   **`Header/`**: Componente de cabeçalho, responsável pela navegação, menu de usuário e seletor de tema.
        *   **`PickerColor/`**: Componente que orquestra a seleção de cores, contendo `RodaDeCores` e `InputColors`.
        *   **`RodaDeCores/`**: Componente customizado de canvas que renderiza uma roda de cores interativa para seleção visual.
        *   **`InputColors/`**: Componente que exibe e permite edição de valores de cor em diferentes formatos (HEX, RGB, HSL, CMYK).
        *   **`SideLeftbar/`**: Barra lateral esquerda com lista de cores recentes e paletas salvas, que pode atualizar a cor global.
        *   **`SideRightbar/`**: Barra lateral direita com lista de cores recentes e paletas salvas.
        *   **`Glow/`**: Componente para efeitos visuais de brilho.
        *   **`Modal/`**: Componente genérico para modais com tipos (success, error, info) e animações.
        *   **`ToastNotification/`**: Componente de notificação temporária que usa o Context API.
    *   **`context/`**: Diretório para contextos globais da aplicação.
        *   **`ToastContext.tsx`**: Contexto global para gerenciamento de notificações toast.

## Componentes Principais e Gerenciamento de Estado

*   **`Home` ([`src/app/page.tsx`](src/app/page.tsx:11))**: A página principal que gerencia o estado de cor global (`color`, `colors`, `committedColor`) e o estado de autenticação (`user`, `loading`). Ela verifica a sessão do usuário no carregamento e passa o estado de cor e funções de atualização para os componentes filhos, centralizando o fluxo de seleção e autenticação.
*   **`PickerColor` ([`src/app/componentes/PickerColor/index.tsx`](src/app/componentes/PickerColor/index.tsx:16))**: Componente `client-side` que recebe o estado de cor da `Home`. Ele gerencia um estado interno (`committedColor`) para controlar a atualização dos `InputColors` e sincroniza esse estado com a prop `cor` vinda da `Home` através de um `useEffect`. Inclui funcionalidade de cópia de cor para a área de transferência com notificações toast.
*   **`RodaDeCores` ([`src/app/componentes/RodaDeCores/index.tsx`](src/app/componentes/RodaDeCores/index.tsx:24))**: Componente `client-side` customizado usando Canvas para alta performance. Possui duas props de callback:
    *   `onChange`: Chamada em tempo real durante o arraste do mouse para atualizar o preview visual.
    *   `onCommit`: Chamada apenas no `mouseup` para "confirmar" a cor selecionada.
    Implementa drag global (fora do canvas), conversões precisas de coordenadas para HSL, e prevenção de scroll no mobile.
*   **`SideLeftbar` ([`src/app/componentes/SideLeftbar/index.tsx`](src/app/componentes/SideLeftbar/index.tsx:6))**: Barra lateral que exibe cores recentes e paletas salvas. Ao clicar em uma cor, chama `onColorSelect` para atualizar o estado de cor global na `Home`. Inclui paletas estáticas como exemplo.
*   **`SideRightbar` ([`src/app/componentes/SideRightbar/index.tsx`](src/app/componentes/SideRightbar/index.tsx:6))**: Barra lateral direita com cores recentes e paletas salvas, similar à esquerda mas sem funcionalidade de atualização (apenas visual).
*   **`InputColors` ([`src/app/componentes/InputColors/index.tsx`](src/app/componentes/InputColors/index.tsx:57))**: Componente `client-side` que exibe e permite conversão de formatos de cor (HEX, RGB, HSL, CMYK). Lê o valor do estado `committedColor` do `PickerColor`, garantindo atualização apenas quando a cor é confirmada. Inclui funcionalidade de cópia com notificações.
*   **`Header` ([`src/app/componentes/Header/index.tsx`](src/app/componentes/Header/index.tsx:17))**: Componente de navegação com menu responsivo, seletor de tema (claro/escuro), menu de perfil com autenticação e logout integrado com Supabase.
*   **`AuthLayout` ([`src/app/(auth)/layout.tsx`](src/app/(auth)/layout.tsx:4))**: Layout minimalista para as rotas de autenticação (`/login`, `/register`), garantindo performance ao não carregar componentes desnecessários como Header completo e sidebars.
*   **`LoginPage` ([`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx:9))**: Página de login com formulário validado, integração com Supabase para autenticação, modais de feedback e redirecionamento automático.
*   **`RegisterPage` ([`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx:11))**: Página de registro com validação de senha, integração com Supabase, modais de feedback e redirecionamento.
*   **`NotFound` ([`src/app/not-found.tsx`](src/app/not-found.tsx:4))**: Página 404 customizada com design consistente e link de retorno à home.
*   **`ToastProvider` ([`src/context/ToastContext.tsx`](src/context/ToastContext.tsx:37))**: Provedor de contexto global que gerencia o estado das notificações toast em toda a aplicação usando Context API.
*   **`ToastNotification` ([`src/app/componentes/ToastNotification/index.tsx`](src/app/componentes/ToastNotification/index.tsx:13))**: Componente de notificação temporária que aparece automaticamente e desaparece após 3 segundos, posicionado globalmente.
*   **`Modal` ([`src/app/componentes/Modal/index.tsx`](src/app/componentes/Modal/index.tsx:15))**: Componente genérico para exibir modais com tipos (success, error, info), animações suaves e ícones personalizados.
*   **`Glow` ([`src/app/componentes/Glow/index.tsx`](src/app/componentes/Glow/index.tsx:2))**: Componente para efeitos visuais de fundo com gradientes e grid sutil.

## Decisões Técnicas Chave

*   **Elevação de Estado (State Lifting):** O estado de cor foi movido de `PickerColor` para `Home` (`page.tsx`) para permitir que componentes irmãos (`SideLeftbar` e `PickerColor`) compartilhem e modifiquem o mesmo estado.
*   **Sincronização com `useEffect`:** Um `useEffect` em `PickerColor` foi adicionado para sincronizar o estado `committedColor` com a prop `cor` vinda da `Home`. Isso garante que seleções de cor externas (como da `SideLeftbar`) se reflitam corretamente nos `InputColors`.
*   **Separação de Eventos de Cor:** A `RodaDeCores` agora distingue entre uma mudança de cor em tempo real (`onChange`) e uma confirmação de cor (`onCommit`), permitindo um controle mais granular da experiência do usuário.
*   **Route Groups para Performance**: A pasta `(auth)` é usada para aplicar um layout específico e mais leve às páginas de login/registro, evitando o carregamento do `Header` completo e das sidebars.
*   **Sistema de Notificações Global**: Utiliza Context API para gerenciamento de notificações toast, permitindo que qualquer componente da aplicação mostre mensagens temporárias sem precisar passar props através de vários níveis da árvore de componentes.
*   **Prevenção de Scroll no Mobile**: Para melhorar a usabilidade em dispositivos de toque, `event.preventDefault()` foi adicionado ao manipulador de `touchmove` no componente `RodaDeCores`. Isso impede que a página role verticalmente enquanto o usuário interage com a roda de cores.
*   **Autenticação Integrada**: Implementação completa de autenticação com Supabase, incluindo páginas de login/registro, verificação de sessão, logout e proteção de rotas.
*   **Modais Genéricos**: Sistema de modais reutilizáveis com tipos (success, error, info) e animações personalizadas para feedback consistente.
*   **Página 404 Customizada**: Página de erro 404 com design consistente e navegação de volta à home.
*   **Canvas Otimizado em Camadas**: Roda de cores implementada com canvas em camadas (fundo pré-renderizado + ponteiro sobreposto) para máxima performance.
*   **Drag Global**: Permite arrastar o ponteiro da roda de cores mesmo fora dos limites do canvas, como em softwares profissionais.
