# 🌀 Roda de Cores Customizada - Guia de Customização

Este documento explica como customizar o componente `RodaDeCores` que você criou. O componente foi desenvolvido com foco em flexibilidade e facilidade de modificação.

## 📋 Visão Geral

O componente `RodaDeCores` cria uma roda de cores interativa usando HTML5 Canvas, onde:
- **Borda externa**: Cores puras (alta saturação)
- **Centro**: Cores brancas (baixa saturação)
- **Interação**: Clique e arraste para selecionar cores

## 🎨 Propriedades Principais

```tsx
<RodaDeCores
  color="#FF6B6B"        // Cor inicial (formato hex)
  onChange={setColor}    // Função chamada quando a cor muda
  size={250}             // Tamanho da roda em pixels
/>
```

### `color` (string)
- **Formato**: `#RRGGBB` (ex: `#FF6B6B`)
- **Padrão**: `#FFFFFF` (branco)
- **Função**: Define a cor inicial selecionada

### `onChange` (function)
- **Tipo**: `(color: string) => void`
- **Função**: Callback executado sempre que o usuário seleciona uma nova cor
- **Exemplo**: `onChange={(newColor) => setSelectedColor(newColor)}`

### `size` (number)
- **Padrão**: `200`
- **Unidade**: pixels
- **Função**: Define o diâmetro da roda de cores

## 🎯 Como Customizar

### 1. **Alterar o Tamanho da Roda**

```tsx
<RodaDeCores
  color={selectedColor}
  onChange={setSelectedColor}
  size={300}  // Roda maior
/>
```

### 2. **Modificar as Cores do Ponteiro**

Edite o arquivo `src/app/globals.css`:

```css
/* Personalizar o ponteiro */
.roda-de-cores-container canvas {
  /* Estilos do canvas */
}

.roda-de-cores-container .pointer {
  border-color: #FF0000 !important;  /* Borda vermelha */
  background-color: #00FF00 !important;  /* Fundo verde */
}
```

### 3. **Alterar a Aparência da Roda**

Para modificar como a roda é desenhada, edite a função `drawColorWheel()` no arquivo `index.tsx`:

```tsx
const drawColorWheel = useCallback(() => {
  // Modifique estes valores para alterar a aparência:
  const radius = size / 2 - 15;  // Margem maior
  const lightness = 0.6;        // Cores mais claras
  // ... resto do código
}, [size, hslToRgb]);
```

### 4. **Personalizar a Conversão de Cores**

A função `positionToColor()` converte coordenadas do mouse em cores HSL. Você pode modificá-la:

```tsx
const positionToColor = useCallback((x: number, y: number): string => {
  // Modifique estes cálculos para alterar como as cores são geradas
  const saturation = Math.min(distance / radius, 0.8);  // Máximo 80% de saturação
  const lightness = 0.6;  // Sempre 60% de luminosidade

  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  return rgbToHex(r, g, b);
}, [size, hslToRgb, rgbToHex]);
```

## 🔧 Estrutura Interna do Código

### Funções Principais

1. **`hslToRgb(h, s, l)`**: Converte HSL para RGB
2. **`rgbToHex(r, g, b)`**: Converte RGB para formato hexadecimal
3. **`drawColorWheel()`**: Desenha a roda de cores no canvas
4. **`drawPointer()`**: Desenha o indicador de seleção
5. **`positionToColor(x, y)`**: Converte coordenadas em cores
6. **`colorToPosition(hex)`**: Converte cores em coordenadas (para implementar)

### Estados Internos

- **`isDragging`**: Controla se o usuário está arrastando
- **`pointerPosition`**: Posição atual do ponteiro na roda

### Manipuladores de Eventos

- **`handleMouseDown`**: Inicia a seleção de cor
- **`handleMouseMove`**: Atualiza a cor durante o arrasto
- **`handleMouseUp`**: Finaliza a seleção

## 🚀 Melhorias Futuras

### Funcionalidades que você pode adicionar:

1. **Suporte a Opacidade (Alpha)**:
   ```tsx
   // Adicionar slider vertical para controlar opacidade
   const [alpha, setAlpha] = useState(1);
   ```

2. **Predefinições de Cores**:
   ```tsx
   const colorPresets = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
   ```

3. **Exportar Cor em Diferentes Formatos**:
   ```tsx
   // RGB, HSL, HSV, etc.
   const exportFormats = {
     hex: selectedColor,
     rgb: hexToRgb(selectedColor),
     hsl: hexToHsl(selectedColor)
   };
   ```

4. **Histórico de Cores**:
   ```tsx
   const [colorHistory, setColorHistory] = useState<string[]>([]);
   ```

## 📝 Dicas de Desenvolvimento

### Performance
- O canvas redesenha a roda inteira a cada mudança
- Para roda muito grandes, considere otimizar o algoritmo de desenho
- Use `useCallback` para evitar recriação desnecessária de funções

### Acessibilidade
- Adicione suporte a navegação por teclado
- Inclua labels ARIA para leitores de tela
- Considere contraste de cores para usuários com daltonismo

### Responsividade
- O componente se adapta automaticamente ao tamanho definido
- Para telas menores, considere tamanhos menores: `size={150}`

## 🎨 Exemplos de Uso

### Uso Básico
```tsx
function App() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <RodaDeCores
      color={color}
      onChange={setColor}
    />
  );
}
```

### Com Visualização da Cor
```tsx
function ColorPicker() {
  const [color, setColor] = useState('#FF6B6B');

  return (
    <div>
      <RodaDeCores
        color={color}
        onChange={setColor}
        size={200}
      />
      <div
        style={{
          width: 50,
          height: 50,
          backgroundColor: color,
          border: '1px solid #ccc'
        }}
      />
      <p>Cor selecionada: {color}</p>
    </div>
  );
}
```

---

**💡 Dica**: Sempre teste suas modificações no navegador para ver os resultados em tempo real. O componente foi projetado para ser facilmente extensível e modificável!