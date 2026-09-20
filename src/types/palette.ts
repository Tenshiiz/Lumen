export interface PaletteColor {
  hex: string
  name?: string
  position: number
}

export interface Palette {
  id: string
  name: string
  colors: PaletteColor[]
  createdAt: string
  updatedAt: string
}
