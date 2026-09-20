import { extend } from 'colord'
import cmykPlugin from 'colord/plugins/cmyk'
import a11yPlugin from 'colord/plugins/a11y'

extend([cmykPlugin, a11yPlugin])

export { colord, type AnyColor, type HslColor, type HsvColor, type RgbColor } from 'colord'
