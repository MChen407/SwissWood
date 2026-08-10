const DEFAULT_LENGTH_MM = 4000
const DEFAULT_WIDTH_MM = 100
const DEFAULT_THICKNESS_MM = 30

interface RawDims {
  length_mm?: unknown
  width_mm?: unknown
  thickness_mm?: unknown
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

export function customDimensionMultiplier(
  baseDims: Record<string, unknown> | null | undefined,
  customization: Record<string, unknown> | null | undefined
): number {
  const base = (baseDims ?? {}) as RawDims
  const baseVolume =
    (toNumber(base.length_mm) ?? DEFAULT_LENGTH_MM) *
    (toNumber(base.width_mm) ?? DEFAULT_WIDTH_MM) *
    (toNumber(base.thickness_mm) ?? DEFAULT_THICKNESS_MM)
  if (!baseVolume || baseVolume <= 0) return 1

  const custom = customization ?? {}
  const length = toNumber(custom.longueur_mm) ?? DEFAULT_LENGTH_MM
  const width = toNumber(custom.largeur_mm) ?? DEFAULT_WIDTH_MM
  const thickness = toNumber(custom.epaisseur_mm) ?? DEFAULT_THICKNESS_MM
  const customVolume = length * width * thickness

  return Math.max(0.5, customVolume / baseVolume)
}