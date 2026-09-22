<div align="center">

<br>

<a href="https://lumen-ashy.vercel.app">
  <img src="./public/hero.svg" alt="Lumen" width="100%">
</a>

<br><br>

<a href="https://lumen-ashy.vercel.app">
  <img src="https://img.shields.io/badge/%E2%9C%A8%20Acessar%20o%20Lumen%20%E2%86%92-111111?style=for-the-badge&labelColor=111111" alt="Acessar o Lumen">
</a>

<br><br>

<img src="https://img.shields.io/badge/Next.js-15.5-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">&nbsp;
<img src="https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">&nbsp;
<img src="https://img.shields.io/badge/TypeScript-5.x-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">&nbsp;
<img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">&nbsp;
<img src="https://img.shields.io/badge/Zustand-v5-443E38?style=flat-square" alt="Zustand">&nbsp;
<img src="https://img.shields.io/badge/Testes%20E2E-Playwright%207%2F7-4ADE80?style=flat-square" alt="E2E Tests">&nbsp;
<img src="https://img.shields.io/badge/Testes%20Unit%C3%A1rios-38%20passing-4ADE80?style=flat-square" alt="Unit Tests">&nbsp;
<img src="https://img.shields.io/badge/License-MIT-A78BFA?style=flat-square" alt="License">

<br><br>

<img src="./public/divider.svg" alt="" width="100%">

<br>

## 📖 Visão Geral

Plataforma sensorial de seleção, análise cromática, extração por imagem e exportação de tokens de cor.<br>
Construída para operar **100% no cliente**, sem autenticação, sem banco de dados externo e sem telemetria.<br>
Toda a coleção, histórico e configurações são persistidos instantaneamente no seu `localStorage`.

<br>

<img src="./public/divider.svg" alt="" width="100%">

<br>

## ✨ Funcionalidades

<table align="center">
  <tr>
    <td align="center" width="50%">
      <b>🎨 Seletor Cromático Sensorial</b><br>
      <sub>Disco contínuo de matiz e saturação com faders analógicos de precisão decimal no espaço HSV.</sub>
    </td>
    <td align="center" width="50%">
      <b>🖼️ Extrator de Imagem de Alta Fidelidade</b><br>
      <sub>Lupa de precisão 10x com retículo em cruz, preenchimento total (cover), zoom &ge; 100%, arrasto direto por mouse/Espaço e extração de tons dominantes.</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>⚖️ Análise de Contraste WCAG</b><br>
      <sub>Cálculo de conformidade AA e AAA em tempo real para texto normal e grande com simulação visual.</sub>
    </td>
    <td align="center">
      <b>👁️ Auditoria de Daltonismo</b><br>
      <sub>Simulações de Protanopia, Deuteranopia, Tritanopia e Acromatopsia com proteção matemática contra distorção e cópia em 1 clique.</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>🎼 Harmonias Cromáticas</b><br>
      <sub>Geração matemática de acordes: Análoga, Complementar, Dividida, Tríade e Monocromática.</sub>
    </td>
    <td align="center">
      <b>🔄 Conversão Universal de Formatos</b><br>
      <sub>Edição bidirecional em HEX, RGB, HSL e CMYK com validação tolerante e atualização simultânea.</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>🗃️ Paletas Locais & Histórico</b><br>
      <sub>Organizador completo de paletas e histórico de cores recentes salvo localmente no navegador.</sub>
    </td>
    <td align="center">
      <b>📦 Exportação de Tokens de Design</b><br>
      <sub>Exportação instantânea para CSS Variables, Tailwind CSS v4, JSON W3C DTCG e TypeScript.</sub>
    </td>
  </tr>
</table>

<br>

<img src="./public/divider.svg" alt="" width="100%">

<br>

## 🏛️ O Ateliê Integrado

O Lumen adota uma arquitetura de visualização em duas colunas no desktop para maximizar a produtividade criativa:

- **Coluna Esquerda:** A grande Roda Cromática suspensa com frestas de luz atmosféricas e faders de precisão.
- **Coluna Direita (Painel de Contexto):**
  - **Aba Análise & Harmonias:** Acordes cromáticos, contraste WCAG 2.1 e auditoria visual de daltonismo integrados em um layout compacto de rolagem zero.
  - **Aba Imagem:** Extrator de imagens com suporte a Drag & Drop, navegação por arquivos ou `Ctrl + V` direto da área de transferência.
- **Atalhos Rápidos de Teclado:**
  - `[A]`: Alterna instantaneamente para a aba de **Análise**.
  - `[I]`: Alterna instantaneamente para a aba de **Imagem**.
  - `Ctrl + V`: Cola uma imagem da área de transferência e abre o extrator automaticamente.
  - `Espaço + Arrastar` ou `Arrasto com o Mouse`: Move a foto sem descer a página web.

<br>

<img src="./public/divider.svg" alt="" width="100%">

<br>

## 🛠️ Stack de Tecnologia

### Dependências Principais

**Framework Principal:** Next.js (v15.5.0)&nbsp; <img src="https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white&style=flat-square" alt="Next.js" height="20">

**Biblioteca de UI:** React (v19.1.0)&nbsp; <img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square" alt="React" height="20">

**Linguagem:** TypeScript (v5.x)&nbsp; <img src="https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript" height="20">

**Estilização:** Tailwind CSS (v4)&nbsp; <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat-square" alt="Tailwind CSS" height="20">

**Gerenciamento de Estado:** Zustand (v5)&nbsp; <img src="https://img.shields.io/badge/-Zustand-443E38?logo=react&logoColor=white&style=flat-square" alt="Zustand" height="20">

**Manipulação Cromática:** colord (v2.9.3)&nbsp; <img src="https://img.shields.io/badge/-colord-8A2BE2?style=flat-square" alt="colord" height="20">

<br>

### Ferramentas de Testes e Qualidade

**Testes End-to-End (E2E):** Playwright (7 perfis de dispositivos: Desktop, Notebook, Tablets e Smartphones)&nbsp; <img src="https://img.shields.io/badge/-Playwright-2EAD33?logo=playwright&logoColor=white&style=flat-square" alt="Playwright" height="20">

**Testes Unitários:** tsx Runner com 38 testes matemáticos de conversão e gamut&nbsp; <img src="https://img.shields.io/badge/-tsx-3178C6?logo=typescript&logoColor=white&style=flat-square" alt="tsx" height="20">

**Análise Estática:** ESLint (v9)&nbsp; <img src="https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint&logoColor=white&style=flat-square" alt="ESLint" height="20">

**Deploy:** Vercel&nbsp; <img src="https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white&style=flat-square" alt="Vercel" height="20">

<br>

<img src="./public/divider.svg" alt="" width="100%">

<br>

## 🚀 Como Executar

```bash
# 1. Clonar o repositório
git clone https://github.com/Tenshiiz/lumen.git
cd lumen

# 2. Instalar as dependências
npm install

# 3. Executar os testes matemáticos unitários
npm test

# 4. Executar os testes E2E do Playwright
npx playwright test

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

<sub>Requer Node.js 18.17 ou superior</sub>

<br><br>

<img src="./public/divider.svg" alt="" width="100%">

<br>

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.<br>
Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

<br><br>

<img src="./public/divider.svg" alt="" width="100%">

<br>

**Construído com paixão para a comunidade de designers e desenvolvedores web**

<br>

<a href="https://github.com/Tenshiiz">
  <img src="https://img.shields.io/badge/Made_with_💖_by-Tenshi-FF69B4?style=for-the-badge" alt="Made with love by Tenshi">
</a>

<br><br>

</div>
