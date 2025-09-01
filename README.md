<div align="center">

# Lumen: Ferramentas de Cores para a Web

</div>

<p align="center">
  <img src="./public/logoSemNome.svg" alt="Lumen Logo" width="140">
</p>

<p align="center">
  Uma plataforma de exploração de cores de alta performance, construída com Next.js e React, com um componente de roda de cores totalmente customizado.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.0-blue?logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.1.0-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-blue?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

---

## 🎥 Demonstração

<p align="center">
  [INSERIR GIF DA RODA DE CORES EM AÇÃO]
</p>

<p align="center">
  <a href="https://lumen-ashy.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Acesse_a_Aplicação-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Acesse a Aplicação">
  </a>
</p>

## ✨ Funcionalidades

- **🎨 Roda de Cores Interativa**: Componente customizado usando Canvas com arraste global e precisão matemática.
- **🔄 Conversão de Formatos**: Suporte completo a HEX, RGB, HSL e CMYK.
- **👤 Autenticação de Usuário**: Páginas de Login e Registro com layout otimizado.
- **📄 Página 404 Customizada**: Uma página "Não Encontrado" elegante e consistente com o design.
- **📱 Interface Responsiva**: Layout moderno com sidebars para cores recentes e paletas salvas.
- **🌙 Tema Claro/Escuro**: Alternância de temas com persistência.
- **⚡ Alta Performance**: Roda 100% no navegador sem dependências pesadas.
- **🔗 Sincronização de Componentes**: A seleção de cores (seja na roda, nas sidebars ou por input direto) atualiza instantaneamente todos os componentes relevantes da interface, garantindo uma experiência de usuário coesa.
- **🔔 Sistema de Notificações**: Notificações toast globais com Context API para feedback imediato ao usuário.
- **📋 Modais Interativos**: Modais genéricos com animações suaves e tipos (success, error, info) para confirmações e alertas.

## ✨ Destaques Técnicos

O coração do Lumen é uma **roda de cores de alta performance**, construída do zero para superar as limitações de bibliotecas tradicionais:

- **Canvas Otimizado em Camadas**: Fundo estático e ponteiro em canvas sobreposto, garantindo redesenho mínimo e experiência **sem lag**.
- **Arraste Global**: O ponteiro pode ser arrastado fora dos limites do componente, como em softwares profissionais de design.
- **Precisão Matemática**: Conversão de coordenadas (x, y) para HSL usando cálculos diretos, evitando o uso de APIs pesadas como `getImageData`.
- **Arquitetura de Estado Centralizada**: Utiliza o padrão *state lifting* do React, onde o estado de cor global é gerenciado por um componente pai (`Home`) e distribuído para os filhos (`PickerColor`, `SideLeftbar`), garantindo uma única fonte da verdade e sincronização consistente.
- **Route Groups para Performance**: As rotas de autenticação (`/login`, `/register`) usam um layout minimalista para um carregamento mais rápido, sem carregar componentes desnecessários da aplicação principal.

## 🛠️ Stack de Tecnologia

- **Framework**: [Next.js 15.5.0](https://nextjs.org/)
- **Linguagem**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **UI Library**: [React 19.1.0](https://reactjs.org/)
- **Estilização**: [TailwindCSS 4.x](https://tailwindcss.com/)
- **Ícones**: [React Icons](https://react-icons.github.io/react-icons/)
- **Renderização Gráfica**: HTML5 Canvas API
- **Backend as a Service**: [Supabase](https://supabase.com/) (Autenticação e Banco de Dados)

## 🚧 Próximos Passos

- [ ] **Lógica de Autenticação**: Implementar a lógica de autenticação real nas páginas de login e registro usando o cliente Supabase.
- [ ] **Funcionalidade Dinâmica nas Sidebars**: Implementar funcionalidade de salvamento de cores e paletas na `SideLeftbar` e `SideRightbar`.
- [ ] **Sistema de Persistência**: Desenvolver um sistema de persistência de dados (ex: `localStorage` ou banco de dados).
- [ ] **Validação de Acessibilidade**: Adicionar validação de acessibilidade de cores (contraste WCAG).
- [ ] **Exportação de Paletas**: Implementar a funcionalidade de exportação de paletas em diferentes formatos (CSS, JSON, etc.).

## ⚖️ Licença

Este projeto está licenciado sob a **MIT License**.
Veja o arquivo `LICENSE` para mais detalhes.

---

<p align="center">
  Este projeto é um exemplo de construção de componentes de UI complexos e performáticos com React e Canvas.
</p>
