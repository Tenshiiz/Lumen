'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useColorStore, useHex } from '@/stores/useColorStore'
import { IconeBaixar } from './Icones'

function rgbParaHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}

/**
 * Extrator de imagem com visualização em preenchimento total (cover, sem barras pretas),
 * zoom travado estritamente em >= 100%, arrasto direto por mouse ou tecla Espaço
 * (com preventDefault em capture para nunca descer a página web),
 * caixa ampliada verticalmente e lupa de joalheiro 10x com retículo em cruz.
 */
export default function ExtratorImagem() {
  const hexAtivo = useHex()
  const setFromHex = useColorStore((e) => e.setFromHex)
  const commitColor = useColorStore((e) => e.commitColor)

  const [imagemCarregada, setImagemCarregada] = useState(false)
  const [hexMira, setHexMira] = useState(hexAtivo)
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [modoEspaco, setModoEspaco] = useState(false)
  const [dominantes, setDominantes] = useState<string[]>([
    '#1A102F', '#79284D', '#E05A47', '#F6AD55', '#E59A3C', '#234E52',
  ])

  const viewportRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lupaRef = useRef<HTMLDivElement>(null)
  const lupaCanvasRef = useRef<HTMLCanvasElement>(null)
  const lupaTagCorRef = useRef<HTMLDivElement>(null)
  const lupaTagHexRef = useRef<HTMLSpanElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // Dimensões base calculadas no modo cover
  const baseSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })

  // Refs de estado dinâmico para garantir fluidez e consistência em eventos nativos
  const zoomRef = useRef<number>(1.0)
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const isPanningRef = useRef<boolean>(false)
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragStartRef = useRef<{ x: number; y: number; hasMoved: boolean }>({ x: 0, y: 0, hasMoved: false })
  const modoEspacoRef = useRef<boolean>(false)
  const hexMiraRef = useRef<string>(hexAtivo)

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  useEffect(() => {
    panRef.current = pan
  }, [pan])

  useEffect(() => {
    modoEspacoRef.current = modoEspaco
  }, [modoEspaco])

  // Esconder a lupa com segurança
  const esconderLupa = useCallback(() => {
    if (lupaRef.current) {
      lupaRef.current.style.display = 'none'
    }
  }, [])

  // Extração das 6 cores dominantes da imagem
  const extrairDominantes = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const amostras: string[] = []
    const passoX = Math.max(1, Math.floor(w / 16))
    const passoY = Math.max(1, Math.floor(h / 16))

    for (let y = 0; y < h; y += passoY) {
      for (let x = 0; x < w; x += passoX) {
        const p = ctx.getImageData(x, y, 1, 1).data
        const soma = p[0] + p[1] + p[2]
        if (soma > 45 && soma < 710) {
          amostras.push(rgbParaHex(p[0], p[1], p[2]))
        }
      }
    }

    const unicos = Array.from(new Set(amostras)).slice(0, 6)
    if (unicos.length >= 3) {
      setDominantes(unicos)
    }
  }, [])

  /**
   * Limita o pan para que as bordas da imagem nunca entrem no viewport,
   * garantindo que a imagem cubra 100% da área e nunca exponha barras pretas.
   */
  const limitarPan = useCallback((novoX: number, novoY: number, z: number) => {
    const vp = viewportRef.current
    if (!vp) return { x: novoX, y: novoY }

    const vpW = vp.clientWidth
    const vpH = vp.clientHeight
    const baseW = baseSizeRef.current.w || vpW
    const baseH = baseSizeRef.current.h || vpH

    const renderW = baseW * z
    const renderH = baseH * z

    const maxPanX = Math.max(0, (renderW - vpW) / 2)
    const maxPanY = Math.max(0, (renderH - vpH) / 2)

    const clampedX = Math.max(-maxPanX, Math.min(maxPanX, novoX))
    const clampedY = Math.max(-maxPanY, Math.min(maxPanY, novoY))

    return { x: clampedX, y: clampedY }
  }, [])

  // Carrega nova imagem e reseta transformações
  const carregarImagem = useCallback((img: HTMLImageElement) => {
    imgRef.current = img
    setImagemCarregada(true)
    setZoom(1.0)
    zoomRef.current = 1.0
    setPan({ x: 0, y: 0 })
    panRef.current = { x: 0, y: 0 }
  }, [])

  // Ajusta dimensões do canvas no modo cover e desenha a imagem
  useEffect(() => {
    if (!imagemCarregada || !imgRef.current) return
    const img = imgRef.current
    const canvas = canvasRef.current
    const vp = viewportRef.current
    if (!canvas || !vp) return

    const ajustarCanvas = () => {
      const vpW = vp.clientWidth
      const vpH = vp.clientHeight
      if (!vpW || !vpH) return

      const imgW = img.naturalWidth || img.width
      const imgH = img.naturalHeight || img.height
      if (!imgW || !imgH) return

      // Escala cover: cobre toda a área do container sem bordas pretas
      const scale = Math.max(vpW / imgW, vpH / imgH)
      const targetW = Math.round(imgW * scale)
      const targetH = Math.round(imgH * scale)

      baseSizeRef.current = { w: targetW, h: targetH }

      canvas.width = imgW
      canvas.height = imgH
      canvas.style.width = `${targetW}px`
      canvas.style.height = `${targetH}px`

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        extrairDominantes(canvas)
      }

      // Re-limita o pan atual para as novas dimensões
      setPan((p) => {
        const reClamped = limitarPan(p.x, p.y, zoomRef.current)
        panRef.current = reClamped
        return reClamped
      })
    }

    ajustarCanvas()

    const ro = new ResizeObserver(() => {
      ajustarCanvas()
    })
    ro.observe(vp)

    return () => {
      ro.disconnect()
    }
  }, [imagemCarregada, extrairDominantes, limitarPan])

  const processarArquivo = useCallback(
    (file: File) => {
      if (!file || !file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        carregarImagem(img)
        URL.revokeObjectURL(url)
      }
      img.src = url
    },
    [carregarImagem]
  )

  // Zoom não-passivo com trava estrita em 100% mínimo (nunca desce para 88% ou menor)
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp || !imagemCarregada) return

    const aoRolarNativo = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!imgRef.current) return

      const fator = e.deltaY < 0 ? 1.14 : 0.88
      setZoom((zAtual) => {
        // Trava estritamente no mínimo em 1.0 (100%) e máximo em 3.5 (350%)
        const proximo = Math.min(3.5, Math.max(1.0, Math.round(zAtual * fator * 100) / 100))
        zoomRef.current = proximo

        // Re-limita o pan para o novo nível de zoom
        setPan((pAtual) => {
          const reClamped = limitarPan(pAtual.x, pAtual.y, proximo)
          panRef.current = reClamped
          return reClamped
        })

        return proximo
      })
    }

    vp.addEventListener('wheel', aoRolarNativo, { passive: false })
    return () => {
      vp.removeEventListener('wheel', aoRolarNativo)
    }
  }, [imagemCarregada, limitarPan])

  // Teclado: Espaço com preventDefault em capture para nunca descer a página web
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        if (!e.repeat) {
          setModoEspaco(true)
          modoEspacoRef.current = true
          esconderLupa()
        }
      }
    }

    function aoSoltar(e: KeyboardEvent) {
      if (e.code === 'Space' || e.key === ' ') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
        e.preventDefault()
        e.stopPropagation()
        setModoEspaco(false)
        modoEspacoRef.current = false
        isPanningRef.current = false
      }
    }

    function aoColar(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile()
          if (file) processarArquivo(file)
          break
        }
      }
    }

    function aoSoltarMouseGlobal() {
      if (isPanningRef.current) {
        isPanningRef.current = false
      }
    }

    window.addEventListener('keydown', aoTeclar, { capture: true })
    window.addEventListener('keyup', aoSoltar, { capture: true })
    window.addEventListener('paste', aoColar)
    window.addEventListener('mouseup', aoSoltarMouseGlobal)

    return () => {
      window.removeEventListener('keydown', aoTeclar, { capture: true })
      window.removeEventListener('keyup', aoSoltar, { capture: true })
      window.removeEventListener('paste', aoColar)
      window.removeEventListener('mouseup', aoSoltarMouseGlobal)
    }
  }, [processarArquivo, esconderLupa])

  /**
   * Amostra a cor do pixel sob as coordenadas de tela clientX/clientY
   */
  const amostrarCorNoPonto = useCallback((clientX: number, clientY: number): { hex: string; imgX: number; imgY: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const canvasRect = canvas.getBoundingClientRect()
    if (
      clientX < canvasRect.left ||
      clientX >= canvasRect.right ||
      clientY < canvasRect.top ||
      clientY >= canvasRect.bottom
    ) {
      return null
    }

    const fracX = (clientX - canvasRect.left) / canvasRect.width
    const fracY = (clientY - canvasRect.top) / canvasRect.height

    const imgX = Math.floor(fracX * canvas.width)
    const imgY = Math.floor(fracY * canvas.height)

    if (imgX < 0 || imgY < 0 || imgX >= canvas.width || imgY >= canvas.height) {
      return null
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    const p = ctx.getImageData(imgX, imgY, 1, 1).data
    return { hex: rgbParaHex(p[0], p[1], p[2]), imgX, imgY }
  }, [])

  // Início de interação: registra ponto de partida para diferenciar clique de arrasto
  function aoAbaixarMouse(e: React.MouseEvent) {
    if (!imgRef.current) return
    isPanningRef.current = true
    startPanRef.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y }
    dragStartRef.current = { x: e.clientX, y: e.clientY, hasMoved: false }
  }

  // Movimento de mouse: se arrastado move a imagem com clamping; se apenas movendo exibe a Lupa 10x
  function aoMoverMouse(e: React.MouseEvent) {
    if (!imgRef.current) return

    // Se estiver com botão pressionado, verifica se está arrastando
    if (isPanningRef.current && e.buttons === 1) {
      const dist = Math.hypot(e.clientX - dragStartRef.current.x, e.clientY - dragStartRef.current.y)
      if (dist > 3) {
        dragStartRef.current.hasMoved = true
        esconderLupa()
        const rawX = e.clientX - startPanRef.current.x
        const rawY = e.clientY - startPanRef.current.y
        const clamped = limitarPan(rawX, rawY, zoomRef.current)
        panRef.current = clamped
        setPan(clamped)
        return
      }
    }

    if (modoEspacoRef.current) {
      esconderLupa()
      return
    }

    const vp = viewportRef.current
    const canvas = canvasRef.current
    const lupa = lupaRef.current
    const lupaCanvas = lupaCanvasRef.current
    if (!vp || !canvas || !lupa || !lupaCanvas) return

    const vpRect = vp.getBoundingClientRect()
    const mouseVpX = e.clientX - vpRect.left
    const mouseVpY = e.clientY - vpRect.top

    const amostra = amostrarCorNoPonto(e.clientX, e.clientY)
    if (!amostra) {
      esconderLupa()
      return
    }

    const { hex, imgX, imgY } = amostra

    // Posiciona a lupa centrada sob o cursor no viewport
    lupa.style.display = 'block'
    lupa.style.left = `${mouseVpX}px`
    lupa.style.top = `${mouseVpY}px`

    const ctxLupa = lupaCanvas.getContext('2d')
    if (ctxLupa) {
      ctxLupa.imageSmoothingEnabled = false
      ctxLupa.clearRect(0, 0, 110, 110)
      ctxLupa.drawImage(canvas, imgX - 5, imgY - 5, 11, 11, 0, 0, 110, 110)
    }

    if (lupaTagCorRef.current) lupaTagCorRef.current.style.backgroundColor = hex
    if (lupaTagHexRef.current) lupaTagHexRef.current.textContent = hex

    if (hexMiraRef.current !== hex) {
      hexMiraRef.current = hex
      setHexMira(hex)
    }
  }

  // Soltar clique: se não houve arrasto, é um clique direto para pinçar a cor!
  function aoLevantarMouse(e: React.MouseEvent<HTMLDivElement>) {
    isPanningRef.current = false

    // Se houve arrasto, não executa o pinçamento
    if (dragStartRef.current.hasMoved || !imgRef.current) return

    const vp = viewportRef.current
    if (!vp) return

    const vpRect = vp.getBoundingClientRect()
    const clickX = e.clientX - vpRect.left
    const clickY = e.clientY - vpRect.top

    // Coleta a cor exatamente no ponto do clique
    const amostra = amostrarCorNoPonto(e.clientX, e.clientY)
    const corFinal = amostra?.hex || hexMiraRef.current || hexMira

    // Onda de choque luminosa
    const onda = document.createElement('div')
    onda.className = 'onda-choque'
    onda.style.left = `${clickX}px`
    onda.style.top = `${clickY}px`
    onda.style.borderColor = corFinal
    onda.style.color = corFinal
    vp.appendChild(onda)
    setTimeout(() => onda.remove(), 520)

    // Sincroniza a cor ativa estritamente no clique
    setFromHex(corFinal)
    commitColor()
  }

  return (
    <div className="flex flex-col gap-2.5">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) processarArquivo(e.target.files[0])
        }}
      />

      {/* Toolbar superior com ações e status de zoom */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-[var(--raio-pilula)] bg-[rgba(var(--tinta-rgb),0.07)] hover:bg-[rgba(var(--tinta-rgb),0.13)] text-[12px] font-medium text-[var(--tinta)] transition-colors cursor-pointer border border-[rgba(var(--tinta-rgb),0.08)]"
          >
            <IconeBaixar className="rotate-180" />
            <span>{imagemCarregada ? 'Trocar Imagem' : 'Carregar Imagem'}</span>
          </button>

          {imagemCarregada && (
            <button
              type="button"
              onClick={() => {
                imgRef.current = null
                setImagemCarregada(false)
                esconderLupa()
              }}
              className="py-1 px-2 rounded-[var(--raio-pilula)] text-[11px] font-medium text-[var(--tinta-fraca)] hover:text-[var(--tinta)] hover:bg-[rgba(var(--tinta-rgb),0.05)] transition-colors cursor-pointer"
            >
              Remover
            </button>
          )}
        </div>

        {imagemCarregada && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--tinta-fraca)]">
              Zoom {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => {
                setZoom(1.0)
                zoomRef.current = 1.0
                setPan({ x: 0, y: 0 })
                panRef.current = { x: 0, y: 0 }
              }}
              className="py-1 px-2 rounded-[var(--raio-pilula)] text-[11px] font-medium text-[var(--tinta-media)] hover:text-[var(--tinta)] bg-[rgba(var(--tinta-rgb),0.05)] transition-colors cursor-pointer"
              title="Resetar visualização para 100%"
            >
              100%
            </button>
          </div>
        )}
      </div>

      {/* Viewport da Imagem (com altura generosa ampliada para baixo) */}
      {!imagemCarregada ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDraggingFile(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDraggingFile(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            setIsDraggingFile(false)
            if (e.dataTransfer.files?.[0]) processarArquivo(e.dataTransfer.files[0])
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full h-[clamp(340px,44vh,460px)] rounded-[18px] border-2 border-dashed transition-all duration-[var(--t-curto)] flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none ${
            isDraggingFile
              ? 'border-[var(--cor-atual)] bg-[rgba(var(--luz-rgb),0.08)] shadow-[0_0_24px_rgba(var(--luz-rgb),0.2)]'
              : 'border-[rgba(var(--tinta-rgb),0.14)] hover:border-[rgba(var(--tinta-rgb),0.28)] bg-[rgba(var(--escuro-rgb),0.45)] hover:bg-[rgba(var(--escuro-rgb),0.65)]'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[rgba(var(--tinta-rgb),0.05)] border border-[rgba(var(--tinta-rgb),0.1)] flex items-center justify-center mb-3 shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--tinta-media)]">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>

          <h4 className="text-[14px] font-semibold text-[var(--tinta)] tracking-[-0.01em]">
            Carregar Imagem
          </h4>
          <p className="text-[12px] text-[var(--tinta-fraca)] mt-1 max-w-[260px] leading-relaxed">
            Arraste e solte aqui, cole da área de transferência com <span className="font-mono text-[var(--tinta-media)] font-medium">Ctrl + V</span> ou clique para navegar.
          </p>

          <span className="mt-3.5 inline-flex items-center gap-1.5 py-1 px-3 rounded-[var(--raio-pilula)] bg-[rgba(var(--tinta-rgb),0.08)] text-[11px] font-medium text-[var(--tinta-media)]">
            PNG · JPG · WebP · SVG
          </span>
        </div>
      ) : (
        <div
          ref={viewportRef}
          onMouseDown={aoAbaixarMouse}
          onMouseMove={aoMoverMouse}
          onMouseUp={aoLevantarMouse}
          onMouseLeave={esconderLupa}
          className={`relative w-full h-[clamp(340px,44vh,460px)] rounded-[18px] overflow-hidden bg-[#040508] border border-[rgba(var(--tinta-rgb),0.09)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)] flex items-center justify-center select-none ${
            modoEspaco
              ? isPanningRef.current
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : dragStartRef.current.hasMoved
              ? 'cursor-grabbing'
              : 'cursor-crosshair'
          }`}
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isPanningRef.current ? 'none' : 'transform 60ms linear',
              display: 'block',
              boxShadow: '0 16px 36px rgba(0,0,0,0.7)',
            }}
          />

          {/* Lupa de Joalheiro (10x com retículo em cruz) */}
          <div
            ref={lupaRef}
            className="absolute pointer-events-none rounded-full overflow-hidden z-20 border-[3px] border-white/90 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.5),0_18px_36px_rgba(0,0,0,0.95)] -translate-x-1/2 -translate-y-1/2 bg-black"
            style={{
              display: 'none',
              width: '110px',
              height: '110px',
            }}
          >
            <canvas ref={lupaCanvasRef} width={110} height={110} />
            {/* Retículo em cruz suave */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-[1px] bg-white/70 absolute" />
              <div className="h-6 w-[1px] bg-white/70 absolute" />
            </div>
            {/* Tag HEX flutuante */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-[5px] bg-[#08090d]/90 text-[10px] font-mono font-semibold text-[var(--tinta)] tracking-wider flex items-center gap-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
              <div
                ref={lupaTagCorRef}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: hexMira }}
              />
              <span ref={lupaTagHexRef}>{hexMira}</span>
            </div>
          </div>
        </div>
      )}

      {/* Faixa de Pré-Visualização Comparativa */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[14px] bg-[rgba(var(--tinta-rgb),0.025)] border border-[rgba(var(--tinta-rgb),0.06)]">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-[6px] border border-white/20 shadow-sm shrink-0"
            style={{ backgroundColor: hexAtivo }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-[var(--tinta-fraca)] uppercase tracking-wider font-semibold">
              Fixada
            </span>
            <span className="font-mono text-[12px] font-medium text-[var(--tinta)]">
              {hexAtivo}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-l border-[rgba(var(--tinta-rgb),0.08)] pl-2">
          <div
            className="w-5 h-5 rounded-[6px] border border-white/20 shadow-sm shrink-0"
            style={{ backgroundColor: hexMira }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-[var(--tinta-fraca)] uppercase tracking-wider font-semibold">
              Sob a Mira
            </span>
            <span className="font-mono text-[12px] font-medium text-[var(--tinta)]">
              {hexMira}
            </span>
          </div>
        </div>
      </div>

      {/* Fita Contínua de Tons Dominantes */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--tinta-media)] uppercase tracking-[0.08em]">
          <span>Tons Dominantes</span>
          <span className="text-[9px] text-[var(--tinta-fraca)]">Clique p/ aplicar</span>
        </div>

        <div className="flex h-9 rounded-[10px] overflow-hidden border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
          {dominantes.map((cor, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setFromHex(cor)
                commitColor()
              }}
              onMouseEnter={() => setHexMira(cor)}
              className="flex-1 border-0 cursor-pointer relative group transition-all duration-[var(--t-curto)] hover:flex-[1.6]"
              style={{ backgroundColor: cor }}
              title={`Aplicar tom dominante ${cor}`}
              aria-label={`Aplicar tom dominante ${cor}`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-semibold text-white opacity-0 group-hover:opacity-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-opacity">
                {cor}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dicas de Atalho */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--tinta-fraca)] px-1 pt-1">
        <span><strong className="text-[var(--tinta-media)]">Clique</strong> Pinçar</span>
        <span><strong className="text-[var(--tinta-media)]">Arrastar</strong> Mover</span>
        <span><strong className="text-[var(--tinta-media)]">Scroll</strong> Zoom (100%+)</span>
        <span><strong className="text-[var(--tinta-media)]">Ctrl+V</strong> Colar</span>
      </div>
    </div>
  )
}
