import type { CartItem, ProductDto } from './api'

const DEFAULT_LENGTH_MM = 4000
const DEFAULT_WIDTH_MM = 100
const DEFAULT_THICKNESS_MM = 30

function toNumber(value: string | number | undefined): number | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

export function dimensionMultiplier(
  product: Pick<ProductDto, 'dimensions'>,
  customization: Record<string, string | number> = {}
): number {
  const baseLength = product.dimensions.length_mm ?? DEFAULT_LENGTH_MM
  const baseWidth = product.dimensions.width_mm ?? DEFAULT_WIDTH_MM
  const baseThickness = product.dimensions.thickness_mm ?? DEFAULT_THICKNESS_MM
  const baseVolume = baseLength * baseWidth * baseThickness
  if (!baseVolume || baseVolume <= 0) return 1

  const length = toNumber(customization.longueur_mm) ?? baseLength
  const width = toNumber(customization.largeur_mm) ?? baseWidth
  const thickness = toNumber(customization.epaisseur_mm) ?? baseThickness
  const customVolume = length * width * thickness

  return Math.max(0.5, customVolume / baseVolume)
}

export interface LinePrice {
  eur: number
  usd: number
  fcfa: number
}

export function itemLinePrice(item: Pick<CartItem, 'product' | 'quantity' | 'customization'>): LinePrice {
  const multiplier = dimensionMultiplier(item.product, item.customization)
  return {
    eur: Math.round(item.product.price_eur * multiplier * item.quantity),
    usd: Math.round(item.product.price_usd * multiplier * item.quantity),
    fcfa: Math.round(item.product.price_fcfa * multiplier * item.quantity),
  }
}