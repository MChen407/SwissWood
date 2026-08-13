import type { PRODUCT_ESSENCES } from './index.js'

export type ProductEssence = (typeof PRODUCT_ESSENCES)[number]

export interface EssenceData {
  label: string
  densite_vert_kg_m3: number
  densite_sec_kg_m3: number
  pouvoir_calorifique: number
}

// 23 essences de bois de chauffage, réparties en 3 groupes.
// pouvoir_calorifique : valeur comparative, étalon charme = 100.
export const ESSENCE_GROUPS: { id: string; label: string; essences: ProductEssence[] }[] = [
  {
    id: 'feuillus_durs',
    label: 'Feuillus durs',
    essences: ['Chene', 'Charme', 'Hetre', 'Frene', 'Orme', 'Erable', 'Noyer', 'Olivier'],
  },
  {
    id: 'feuillus_mi_durs',
    label: 'Feuillus mi-durs / intermédiaires',
    essences: ['Chataignier', 'Acacia', 'Bouleau', 'Merisier', 'ArbresFruitiers', 'Robinier'],
  },
  {
    id: 'resineux_tendres',
    label: 'Résineux & feuillus tendres',
    essences: ['Peuplier', 'Aulne', 'Tilleul', 'Saule', 'Platane', 'Pin', 'Sapin', 'Epicea', 'Meleze'],
  },
]

export const ESSENCE_DATA: Record<ProductEssence, EssenceData> = {
  // Groupe 1 — Feuillus durs
  Chene: { label: 'Chêne', densite_vert_kg_m3: 1000, densite_sec_kg_m3: 690, pouvoir_calorifique: 87 },
  Charme: { label: 'Charme', densite_vert_kg_m3: 1000, densite_sec_kg_m3: 820, pouvoir_calorifique: 100 },
  Hetre: { label: 'Hêtre', densite_vert_kg_m3: 1000, densite_sec_kg_m3: 710, pouvoir_calorifique: 91 },
  Frene: { label: 'Frêne', densite_vert_kg_m3: 900, densite_sec_kg_m3: 690, pouvoir_calorifique: 88 },
  Orme: { label: 'Orme', densite_vert_kg_m3: 1050, densite_sec_kg_m3: 680, pouvoir_calorifique: 87 },
  Erable: { label: 'Érable', densite_vert_kg_m3: 950, densite_sec_kg_m3: 620, pouvoir_calorifique: 76 },
  Noyer: { label: 'Noyer', densite_vert_kg_m3: 950, densite_sec_kg_m3: 640, pouvoir_calorifique: 75 },
  Olivier: { label: 'Olivier', densite_vert_kg_m3: 1100, densite_sec_kg_m3: 900, pouvoir_calorifique: 90 },

  // Groupe 2 — Feuillus mi-durs / intermédiaires
  Chataignier: { label: 'Châtaignier', densite_vert_kg_m3: 1050, densite_sec_kg_m3: 620, pouvoir_calorifique: 81 },
  Acacia: { label: 'Acacia', densite_vert_kg_m3: 770, densite_sec_kg_m3: 660, pouvoir_calorifique: 85 },
  Bouleau: { label: 'Bouleau', densite_vert_kg_m3: 950, densite_sec_kg_m3: 650, pouvoir_calorifique: 85 },
  Merisier: { label: 'Merisier', densite_vert_kg_m3: 750, densite_sec_kg_m3: 560, pouvoir_calorifique: 70 },
  ArbresFruitiers: { label: 'Arbres fruitiers', densite_vert_kg_m3: 900, densite_sec_kg_m3: 600, pouvoir_calorifique: 75 },
  Robinier: { label: 'Robinier', densite_vert_kg_m3: 770, densite_sec_kg_m3: 660, pouvoir_calorifique: 88 },

  // Groupe 3 — Résineux & feuillus tendres
  Peuplier: { label: 'Peuplier', densite_vert_kg_m3: 800, densite_sec_kg_m3: 500, pouvoir_calorifique: 55 },
  Aulne: { label: 'Aulne', densite_vert_kg_m3: 950, densite_sec_kg_m3: 530, pouvoir_calorifique: 64 },
  Tilleul: { label: 'Tilleul', densite_vert_kg_m3: 770, densite_sec_kg_m3: 540, pouvoir_calorifique: 69 },
  Saule: { label: 'Saule', densite_vert_kg_m3: 820, densite_sec_kg_m3: 560, pouvoir_calorifique: 56 },
  Platane: { label: 'Platane', densite_vert_kg_m3: 900, densite_sec_kg_m3: 590, pouvoir_calorifique: 68 },
  Pin: { label: 'Pin', densite_vert_kg_m3: 700, densite_sec_kg_m3: 500, pouvoir_calorifique: 60 },
  Sapin: { label: 'Sapin', densite_vert_kg_m3: 640, densite_sec_kg_m3: 450, pouvoir_calorifique: 58 },
  Epicea: { label: 'Epicéa', densite_vert_kg_m3: 840, densite_sec_kg_m3: 470, pouvoir_calorifique: 62 },
  Meleze: { label: 'Mélèze', densite_vert_kg_m3: 800, densite_sec_kg_m3: 550, pouvoir_calorifique: 62 },
}