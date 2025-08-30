'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from '../../../context/ToastContext' // Hook para mostrar notificações globais

interface InputColorsProps {
  value: string
  onChange: (value: string) => void
  label?: string
  width?: string
  format?: 'hex' | 'rgb' | 'hsl' | 'cmyk'
  id?: string
  onClickButton?: () => void
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHsl({ r, g, b }: { r: number, g: number, b: number }) {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min
  let h = 0
  if (delta !== 0) {
    if (max === rNorm) h = 60 * (((gNorm - bNorm) / delta) % 6)
    else if (max === gNorm) h = 60 * (((bNorm - rNorm) / delta) + 2)
    else h = 60 * (((rNorm - gNorm) / delta) + 4)
  }
  if (h < 0) h += 360
  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function rgbToCmyk({ r, g, b }: { r: number, g: number, b: number }) {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const k = 1 - Math.max(rNorm, gNorm, bNorm)
  const c = (1 - rNorm - k) / (1 - k) || 0
  const m = (1 - gNorm - k) / (1 - k) || 0
  const y = (1 - bNorm - k) / (1 - k) || 0
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  }
}

function InputColors({ value, label = 'Nome', width = 'w-full', format = 'hex', id }: InputColorsProps) {
  const [displayValue, setDisplayValue] = useState('')

  const { showToast } = useToast()

  useEffect(() => {
    if (!value) return
    const rgb = hexToRgb(value)
    if (format === 'rgb') setDisplayValue(`${rgb.r}, ${rgb.g}, ${rgb.b}`)
    else if (format === 'hsl') {
      const hsl = rgbToHsl(rgb)
      setDisplayValue(`${hsl.h}, ${hsl.s}%, ${hsl.l}%`)
    } else if (format === 'cmyk') {
      const cmyk = rgbToCmyk(rgb)
      setDisplayValue(`${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`)
    } else setDisplayValue(value.toUpperCase())
  }, [value, format])

  const handleCopy = () => {
    navigator.clipboard.writeText(displayValue)
      .then(() => showToast('Cor copiada para a área de transferência!'))
      .catch(() => showToast('Erro ao copiar a cor'))
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-400">{label}</label>
      <input
        type="text"
        id={id}
        value={displayValue}
        readOnly
        onClick={handleCopy}
        className={`border border-gray-700 rounded-md p-2 ${width} bg-[#191c1f] text-sm text-center text-white font-mono cursor-pointer`}
      />
    </div>
  )
}

export default InputColors
