'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * COMPONENTE RODA DE CORES CUSTOMIZADO
 *
 * Este componente cria uma roda de cores interativa onde:
 * - As cores puras ficam na borda externa (matiz)
 * - As cores vão se tornando brancas conforme se aproximam do centro (saturação)
 * - O usuário pode clicar e arrastar para selecionar cores
 *
 * @param {Object} props
 * @param {string} props.color - Cor inicial em formato hex (#RRGGBB)
 * @param {function} props.onChange - Callback chamado quando a cor muda
 * @param {number} props.size - Tamanho da roda em pixels (padrão: 200)
 */
interface RodaDeCoresProps {
  color: string;
  onChange: (color: string) => void;
  onCommit?: (color: string) => void;
  size?: number;
}

function RodaDeCores({ color, onChange, onCommit, size = 200 }: RodaDeCoresProps) {
  // Referências para os elementos canvas (fundo e ponteiro)
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerCanvasRef = useRef<HTMLCanvasElement>(null);

  // Referência para armazenar a cor atual durante o arrasto
  const currentColorRef = useRef(color);

  // Estado para controlar se o usuário está arrastando
  const [isDragging, setIsDragging] = useState(false);

  // Estado para armazenar a posição atual do ponteiro
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

  // Estado para armazenar a imagem pré-renderizada do fundo
  const [backgroundImage, setBackgroundImage] = useState<ImageData | null>(null);

  /**
   * CONVERSÃO DE CORES
   * Função auxiliar para converter HSL para RGB
   */
  const hslToRgb = useCallback((h: number, s: number, l: number): [number, number, number] => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }, []);

  /**
   * CONVERSÃO DE CORES
   * Função auxiliar para converter RGB para Hex
   */
  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);


  /**
   * PRÉ-RENDERIZAÇÃO DO FUNDO DA RODA
   * Cria uma imagem pré-renderizada do fundo (executado apenas uma vez)
   */
  const createBackgroundImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Cria ImageData para armazenar os pixels
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    // Preenche pixel por pixel (mais eficiente que fillRect em loop)
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          const angle = Math.atan2(dy, dx);
          const hue = ((angle * 180 / Math.PI) + 360) % 360;
          const saturation = distance / radius;
          const lightness = 0.5 + (1 - saturation) * 0.3;

          const [r, g, b] = hslToRgb(hue, saturation, lightness);

          const index = (y * size + x) * 4;
          data[index] = r;     // Red
          data[index + 1] = g; // Green
          data[index + 2] = b; // Blue
          data[index + 3] = 255; // Alpha
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return imageData;
  }, [size, hslToRgb]);

  /**
   * DESENHO DO FUNDO (OTIMIZADO)
   * Desenha a imagem pré-renderizada no canvas de fundo
   */
  const drawBackground = useCallback(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (backgroundImage) {
      ctx.putImageData(backgroundImage, 0, 0);
    }
  }, [backgroundImage]);

  /**
   * DESENHO DO PONTEIRO (OTIMIZADO)
   * Desenha apenas o ponteiro no canvas separado
   */
  const drawPointer = useCallback(() => {
    const canvas = pointerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpa apenas o canvas do ponteiro
    ctx.clearRect(0, 0, size, size);

    // Desenha o ponteiro com anti-aliasing melhorado
    ctx.beginPath();
    ctx.arc(pointerPosition.x, pointerPosition.y, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pointerPosition.x, pointerPosition.y, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [pointerPosition, size]);

  /**
   * CONVERSÃO DE POSIÇÃO PARA COR
   * Converte coordenadas (x, y) do mouse para valores HSL
   */
  const positionToColor = useCallback((x: number, y: number): string => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Calcula a distância do centro
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se estiver fora do círculo, retorna a cor atual
    if (distance > radius) return color;

    // Calcula o ângulo (matiz)
    const angle = Math.atan2(dy, dx);
    const hue = ((angle * 180 / Math.PI) + 360) % 360;

    // Calcula a saturação baseada na distância
    const saturation = Math.min(distance / radius, 1);

    // Converte para RGB e depois para Hex
    const lightness = 0.5 + (1 - saturation) * 0.3;
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    return rgbToHex(r, g, b);
  }, [size, color, hslToRgb, rgbToHex]);

  /**
   * CONVERSÃO DE COR PARA POSIÇÃO
   * Converte uma cor hex para coordenadas (x, y) na roda
   *
   * Esta função implementa a conversão inversa da positionToColor:
   * 1. Converte hex → RGB → HSL
   * 2. Usa o hue para calcular o ângulo na roda
   * 3. Usa a saturação para calcular a distância do centro
   * 4. Converte coordenadas polares para cartesianas
   */
  const colorToPosition = useCallback((hexColor: string): { x: number; y: number } => {
    // Converte hex para RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Converte RGB para HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let hue = 0;
    if (delta !== 0) {
      if (max === rNorm) {
        hue = ((gNorm - bNorm) / delta) % 6;
      } else if (max === gNorm) {
        hue = (bNorm - rNorm) / delta + 2;
      } else {
        hue = (rNorm - gNorm) / delta + 4;
      }
      hue *= 60;
      if (hue < 0) hue += 360;
    }

    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

    // Calcula a posição baseada no HSL
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // O ângulo é determinado pelo hue
    const angle = (hue * Math.PI) / 180;

    // A distância do centro é determinada pela saturação
    const distance = saturation * radius;

    // Calcula as coordenadas
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);

    return { x, y };
  }, [size]);

  /**
   * LIMITAR POSIÇÃO À BORDA DA RODA
   * Garante que o ponteiro fique sempre dentro da roda de cores
   *
   * CORREÇÃO DO PROBLEMA: Antes o ponteiro podia "atravessar" as bordas da roda
   * e ir para áreas vazias do canvas. Agora ele sempre fica na borda da roda.
   *
   * Lógica:
   * 1. Calcula a distância do centro
   * 2. Se estiver dentro da roda → retorna posição original
   * 3. Se estiver fora → calcula posição na borda mantendo o mesmo ângulo
   */
  const clampPositionToWheel = useCallback((x: number, y: number): { x: number; y: number } => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se estiver dentro da roda, retorna a posição original
    if (distance <= radius) {
      return { x, y };
    }

    // Se estiver fora, calcula a posição na borda da roda
    const angle = Math.atan2(dy, dx);
    const clampedX = centerX + radius * Math.cos(angle);
    const clampedY = centerY + radius * Math.sin(angle);

    return { x: clampedX, y: clampedY };
  }, [size]);

  /**
   * FUNÇÃO AUXILIAR PARA EXTRAIR COORDENADAS
   * Extrai coordenadas relativas ao canvas de eventos mouse ou touch
   */
  const getEventCoordinates = useCallback((event: React.MouseEvent<HTMLCanvasElement> | MouseEvent | TouchEvent | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in event && event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  /**
   * MANIPULADORES DE EVENTOS DO MOUSE (COM DRAG GLOBAL)
   *
   * FUNCIONALIDADE DE DRAG FORA DO CANVAS:
   * - Quando o usuário clica no ponteiro, o dragging começa
   * - Mesmo que o mouse saia do canvas, o ponteiro continua sendo arrastado
   * - Só para quando o usuário solta o botão do mouse
   * - Usa event listeners globais do documento para capturar movimento fora do canvas
   */
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setIsDragging(true);

    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(event, canvas);

    // Limita a posição à borda da roda
    const clampedPosition = clampPositionToWheel(x, y);

    const newColor = positionToColor(clampedPosition.x, clampedPosition.y);
    currentColorRef.current = newColor;
    onChange(newColor);
    setPointerPosition(clampedPosition);
  }, [getEventCoordinates, clampPositionToWheel, positionToColor, onChange]);

  // Handler para movimento do mouse (local ao canvas)
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(event, canvas);

    // Limita a posição à borda da roda
    const clampedPosition = clampPositionToWheel(x, y);

    const newColor = positionToColor(clampedPosition.x, clampedPosition.y);
    currentColorRef.current = newColor;
    onChange(newColor);
    setPointerPosition(clampedPosition);
  }, [isDragging, getEventCoordinates, clampPositionToWheel, positionToColor, onChange]);

  // Handler global para movimento do mouse (funciona fora do canvas)
  const handleGlobalMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;

    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(event, canvas);

    // Limita a posição à borda da roda
    const clampedPosition = clampPositionToWheel(x, y);

    const newColor = positionToColor(clampedPosition.x, clampedPosition.y);
    currentColorRef.current = newColor;
    onChange(newColor);
    setPointerPosition(clampedPosition);
  }, [isDragging, getEventCoordinates, clampPositionToWheel, positionToColor, onChange]);

  // Handler para soltar o mouse (para o dragging)
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (onCommit) {
      onCommit(currentColorRef.current);
    }
  }, [onCommit]);

  // Handler para quando o mouse sai do canvas (mas continua dragging)
  const handleMouseLeave = useCallback(() => {
    // Não para o dragging aqui - permite drag fora do canvas
  }, []);

  /**
   * MANIPULADORES DE EVENTOS DE TOQUE (TOUCH)
   *
   * FUNCIONALIDADE DE DRAG POR TOQUE:
   * - Permite seleção de cores em dispositivos móveis
   * - Usa event listeners globais para movimento fora do canvas
   * - Compatível com a lógica existente de mouse
   */
  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setIsDragging(true);

    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(event, canvas);

    // Limita a posição à borda da roda
    const clampedPosition = clampPositionToWheel(x, y);

    const newColor = positionToColor(clampedPosition.x, clampedPosition.y);
    currentColorRef.current = newColor;
    onChange(newColor);
    setPointerPosition(clampedPosition);
  }, [getEventCoordinates, clampPositionToWheel, positionToColor, onChange]);

  // Handler global para movimento por toque (funciona fora do canvas)
  const handleGlobalTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging) return;

    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(event, canvas);

    // Limita a posição à borda da roda
    const clampedPosition = clampPositionToWheel(x, y);

    const newColor = positionToColor(clampedPosition.x, clampedPosition.y);
    currentColorRef.current = newColor;
    onChange(newColor);
    setPointerPosition(clampedPosition);
  }, [isDragging, getEventCoordinates, clampPositionToWheel, positionToColor, onChange]);

  // Handler para finalizar toque
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (onCommit) {
      onCommit(currentColorRef.current);
    }
  }, [onCommit]);

  /**
   * EFEITOS OTIMIZADOS PARA PERFORMANCE
   *
   * ESTRATÉGIA DE RENDERIZAÇÃO EM CAMADAS:
   * - Fundo: Pré-renderizado uma vez (ImageData)
   * - Ponteiro: Renderizado em canvas separado
   * - Movimento: Apenas o ponteiro é redesenhado
   *
   * 1. Cria imagem do fundo quando componente monta
   * 2. Desenha fundo apenas uma vez
   * 3. Desenha ponteiro apenas quando necessário
   * 4. Atualiza posição apenas quando cor muda externamente
   */

  // Cria a imagem pré-renderizada do fundo
  useEffect(() => {
    const imageData = createBackgroundImage();
    setBackgroundImage(imageData);
  }, [createBackgroundImage]);

  // Desenha o fundo quando a imagem estiver pronta
  useEffect(() => {
    if (backgroundImage) {
      drawBackground();
    }
  }, [backgroundImage, drawBackground]);

  // Desenha o ponteiro quando a posição muda
  useEffect(() => {
    drawPointer();
  }, [drawPointer]);

  // Atualiza a posição do ponteiro quando a cor muda (apenas se não estiver arrastando)
  useEffect(() => {
    if (!isDragging) {
      const position = colorToPosition(color);
      setPointerPosition(position);
    }
  }, [color, colorToPosition, isDragging]);

  /**
   * GESTÃO DE EVENTOS GLOBAIS PARA DRAG (MOUSE E TOUCH)
   * Permite que o ponteiro continue sendo arrastado mesmo fora do canvas
   *
   * COMO FUNCIONA:
   * 1. Quando isDragging=true, adiciona listeners globais ao documento
   * 2. handleGlobalMouseMove e handleGlobalTouchMove capturam movimento mesmo fora do canvas
   * 3. handleMouseUp e handleTouchEnd param o dragging quando solta
   * 4. Cleanup automático remove os listeners quando drag para
   *
   * RESULTADO: Experiência profissional de drag-and-drop em mouse e toque!
   */
  useEffect(() => {
    if (isDragging) {
      // Adiciona listeners globais quando começa o drag
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove);
      document.addEventListener('touchend', handleTouchEnd);

      // Cleanup: remove os listeners quando o componente desmonta ou drag para
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleGlobalMouseMove, handleMouseUp, handleGlobalTouchMove, handleTouchEnd]);

  return (
    <div className="relative inline-block" style={{ width: size + 'px', height: size + 'px' }}>
      {/* Canvas do fundo (pré-renderizado) */}
      <canvas
        ref={backgroundCanvasRef}
        width={size}
        height={size}
        className="absolute inset-0 cursor-crosshair rounded-full border-2 border-gray-800"
      />

      {/* Canvas do ponteiro (sobreposto) */}
      <canvas
        ref={pointerCanvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        className="absolute inset-0 cursor-crosshair rounded-full"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
}

export default RodaDeCores;