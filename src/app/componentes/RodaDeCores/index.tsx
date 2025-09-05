'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface RodaDeCoresProps {
  color: string;
  onChange: (color: string) => void;
  /**
   * DIFERENÇA ENTRE onChange E onCommit:
   * - onChange: Chamado em tempo real durante o arraste do mouse, para preview visual imediato
   * - onCommit: Chamado apenas ao soltar o mouse, para confirmar a cor final selecionada
   * - Permite desacoplar preview (rápido) de confirmação (definitiva) para melhor UX
   */
  onCommit?: (color: string) => void;
  size?: number;
}

function RodaDeCores({ color, onChange, onCommit, size = 200 }: RodaDeCoresProps) {
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerCanvasRef = useRef<HTMLCanvasElement>(null);

  const currentColorRef = useRef(color);

  const [isDragging, setIsDragging] = useState(false);

  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });

  const [backgroundImage, setBackgroundImage] = useState<ImageData | null>(null);

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

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);


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
    // LÓGICA DE RENDERIZAÇÃO DO CANVAS: A roda de cores é desenhada pixel por pixel usando ImageData para performance
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

  const drawBackground = useCallback(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (backgroundImage) {
      ctx.putImageData(backgroundImage, 0, 0);
    }
  }, [backgroundImage]);

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

  const positionToColor = useCallback((x: number, y: number): string => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) return color;

    // CÁLCULOS MATEMÁTICOS PARA CONVERSÃO DE COORDENADAS EM HSL:
    // - Ângulo (hue): Calculado com Math.atan2(dy, dx) convertido para graus (0-360°)
    // - Distância do centro (saturation): Normalizada pelo raio da roda (0-1)
    // - Luminosidade: Fixa em 0.5 + ajuste baseado na saturação para cores vibrantes
    const angle = Math.atan2(dy, dx);
    const hue = ((angle * 180 / Math.PI) + 360) % 360;

    const saturation = Math.min(distance / radius, 1);

    const lightness = 0.5 + (1 - saturation) * 0.3;
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    return rgbToHex(r, g, b);
  }, [size, color, hslToRgb, rgbToHex]);

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

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setIsDragging(true);

    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(event, canvas);

    const clampedPosition = clampPositionToWheel(x, y);

    const newColor = positionToColor(clampedPosition.x, clampedPosition.y);
    currentColorRef.current = newColor;
    onChange(newColor);
    setPointerPosition(clampedPosition);
  }, [getEventCoordinates, clampPositionToWheel, positionToColor, onChange]);

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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (onCommit) {
      onCommit(currentColorRef.current);
    }
  }, [onCommit]);

  const handleMouseLeave = useCallback(() => {
    // Não para o dragging aqui - permite drag fora do canvas
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
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

  const handleGlobalTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging) return;

    event.preventDefault(); // Previne o scroll da página durante o drag

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

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (onCommit) {
      onCommit(currentColorRef.current);
    }
  }, [onCommit]);


  useEffect(() => {
    const imageData = createBackgroundImage();
    setBackgroundImage(imageData);
  }, [createBackgroundImage]);

  useEffect(() => {
    if (backgroundImage) {
      drawBackground();
    }
  }, [backgroundImage, drawBackground]);

  useEffect(() => {
    drawPointer();
  }, [drawPointer]);

  useEffect(() => {
    if (!isDragging) {
      const position = colorToPosition(color);
      setPointerPosition(position);
    }
  }, [color, colorToPosition, isDragging]);

  useEffect(() => {
    if (isDragging) {
      // Adiciona listeners globais quando começa o drag
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
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

  useEffect(() => {
    const canvas = pointerCanvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [handleTouchStart]);

  return (
    <div className="relative inline-block" style={{ width: size + 'px', height: size + 'px' }}>
      <canvas
        ref={backgroundCanvasRef}
        width={size}
        height={size}
        className="absolute inset-0 cursor-crosshair rounded-full border-2 border-gray-800"
      />

      <canvas
        ref={pointerCanvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 cursor-crosshair rounded-full"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
}

export default RodaDeCores;