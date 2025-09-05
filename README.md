<div align="center">

# 🌟 Lumen

### ✨ Uma ferramenta elegante e intuitiva para designers e desenvolvedores explorarem e manipularem cores na web

<p align="center">
  <img src="./public/logoSemNome.svg" alt="Lumen Logo" width="140">
</p>

<p align="center">
  Plataforma de alta performance para seleção, conversão e gerenciamento de cores, construída com tecnologias modernas para uma experiência fluida e responsiva.
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
  <img src="https://via.placeholder.com/800x400/1a1f25/00d4ff?text=Demonstração+da+Roda+de+Cores" alt="Demonstração da Roda de Cores" width="80%">
</p>

<p align="center">
  <a href="https://lumen-ashy.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Acesse_a_Aplicação-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Acesse a Aplicação">
  </a>
</p>

---

## 📖 Visão Geral

Lumen é uma aplicação web moderna projetada para simplificar o trabalho com cores para designers e desenvolvedores. Oferece uma interface intuitiva e ferramentas essenciais para seleção visual, conversão de formatos e gerenciamento de paletas, tudo rodando 100% no navegador com máxima performance.

---

## ✨ Funcionalidades

Lumen foi desenvolvido para atender às necessidades de profissionais criativos, proporcionando uma experiência de usuário fluida e eficiente:

| Funcionalidade | Descrição | Benefício |
| -------------- | --------- | --------- |
| 🎨 **Seletor de Cor Interativo** | Roda de cores customizada com Canvas para seleção precisa e visual de matiz, saturação e luminosidade | Seleção intuitiva e visual de cores |
| 🔄 **Conversão de Formatos** | Suporte completo e em tempo real para HEX, RGB, HSL e CMYK | Facilita integração em projetos |
| 💾 **Salvamento de Paletas** | Sistema para salvar e gerenciar paletas de cores personalizadas | Organização e reutilização de cores |
| 🎨 **Criação de Gradientes** | Ferramentas para gerar gradientes visuais e exportá-los em CSS | Design visual avançado |
| ♿ **Verificação de Acessibilidade** | Análise de contraste WCAG para acessibilidade | Conformidade com padrões web |
| 📱 **Interface Responsiva** | Layout adaptável para desktop e mobile | Experiência consistente |
| 🌙 **Tema Claro/Escuro** | Alternância de temas com persistência | Adaptação às preferências |
| 👤 **Autenticação** | Sistema completo de login e registro com Supabase | Personalização e segurança |
| 🔔 **Notificações** | Sistema de notificações toast globais | Feedback imediato |
| 📄 **Página 404** | Experiência de erro elegante | Navegação consistente |

---

## 🏗️ Arquitetura do Projeto

```mermaid
graph TD
    A[Lumen App] --> B[Next.js App Router]
    B --> C[Home Page]
    B --> D[Auth Pages]
    C --> E[PickerColor Component]
    C --> F[SideLeftbar]
    C --> G[SideRightbar]
    E --> H[RodaDeCores Canvas]
    E --> I[InputColors]
    H --> J[Color Conversion Logic]
    F --> K[Color Management]
    G --> L[Palette Display]
    D --> M[Supabase Auth]
    A --> N[Tailwind CSS]
    A --> O[Context API]
    O --> P[Toast Notifications]
    O --> Q[Global State]
```

---

## ✨ Destaques Técnicos

Lumen combina arquitetura robusta com decisões técnicas estratégicas para entregar alta performance e escalabilidade:

- 🚀 **Next.js com App Router**: Estrutura moderna para roteamento eficiente e carregamento otimizado
- 🎨 **Componente de Canvas Customizado**: Implementação própria para máxima performance gráfica
- 🔐 **Autenticação com Supabase**: Integração completa com backend as a service
- 🌐 **Context API Global**: Gerenciamento centralizado de estado entre componentes
- 📱 **Route Groups Otimizados**: Layouts específicos para performance aprimorada

---

## 🛠️ Stack de Tecnologia

### Linguagens e Frameworks
- **Linguagem Principal**: TypeScript <img src="https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript" height="20">
- **Framework Web**: Next.js (App Router) <img src="https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=flat-square" alt="Next.js" height="20">
- **Biblioteca de UI**: React <img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square" alt="React" height="20">

### Autenticação e Banco de Dados
- Backend as a Service: [Supabase](https://supabase.com/) <img src="https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=black&style=flat-square" alt="Supabase" height="20">
- Autenticação de usuários
- Banco de dados PostgreSQL

### Estilização
- **Framework CSS**: Tailwind CSS (v4) <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square" alt="Tailwind CSS" height="20">
- **Processador CSS**: PostCSS <img src="https://img.shields.io/badge/-PostCSS-DD3735?logo=postcss&logoColor=white&style=flat-square" alt="PostCSS" height="20">
- **Fontes**: Geist Sans, Geist Mono, Inter

### Dependências Principais
- **`next`**: Framework principal (v15.5.0) <img src="https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=flat-square" alt="Next.js" height="20">
- **`react`**: Biblioteca de interface (v19.1.0) <img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square" alt="React" height="20">
- **`@supabase/supabase-js`**: Cliente Supabase (v2.56.1) <img src="https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=black&style=flat-square" alt="Supabase" height="20">
- **`react-icons`**: Ícones (v5.5.0) <img src="https://img.shields.io/badge/-React_Icons-000000?logo=react&logoColor=white&style=flat-square" alt="React Icons" height="20">
- **Outros**: Tipos TypeScript, configurações para SVGs e testes

### Ferramentas de Desenvolvimento
- **Build e Desenvolvimento**: Next.js com Turbopack <img src="https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=flat-square" alt="Next.js" height="20">
- **Linter**: ESLint <img src="https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white&style=flat-square" alt="ESLint" height="20">
- **Gerenciador de Pacotes**: npm <img src="https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white&style=flat-square" alt="npm" height="20">
- **Testes**: Puppeteer para automação <img src="https://img.shields.io/badge/-Puppeteer-40B5A4?logo=puppeteer&logoColor=white&style=flat-square" alt="Puppeteer" height="20">

---

## 📊 Estatísticas do Projeto

<p align="center">
  <img src="https://img.shields.io/github/stars/Tenshiiz/lumen?style=social" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/Tenshiiz/lumen?style=social" alt="GitHub Forks">
  <img src="https://img.shields.io/github/issues/Tenshiiz/lumen" alt="GitHub Issues">
  <img src="https://img.shields.io/github/license/Tenshiiz/lumen" alt="License">
</p>


## 📄 Licença

Este projeto está licenciado sob a **MIT License**.  
Veja o arquivo `LICENSE` para mais detalhes.

---

<p align="center">
  <strong>Construído com paixão para a comunidade de designers e desenvolvedores web</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made_with_❤️_by-Tenshi-FF69B4?style=flat-square" alt="Made with love">
</p>
