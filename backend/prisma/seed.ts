import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { ESSENCE_DATA } from '../src/constants/essences.js'
import type { ProductEssence } from '../src/constants/index.js'

const prisma = new PrismaClient()

const WOOD_IMAGES = [
  'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/172284/pexels-photo-172284.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/915984/pexels-photo-915984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
]

interface SeedProduct {
  essence: ProductEssence
  description: string
  priceEur: number
  priceUsd: number
  priceFcfa: number
  stock: number
  characteristics: Record<string, string>
}

const seedProducts: SeedProduct[] = [
  // ── Groupe 1 — Feuillus durs ─────────────────────────────────────────
  {
    essence: 'Chene',
    description:
      'Le chêne est un classique du chauffage : bois dense, feu très long et chaleur soutenue. Nécessite un séchage de deux ans pour une combustion optimale.',
    priceEur: 8600,
    priceUsd: 9300,
    priceFcfa: 5600000,
    stock: 200,
    characteristics: { durete: 'Très élevée', flamme: 'Longue', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Charme',
    description:
      'Le charme est la référence absolue en bois de chauffage : très dense, long feu et excellent pouvoir calorifique. Idéal pour les poêles à rendement élevé.',
    priceEur: 8500,
    priceUsd: 9200,
    priceFcfa: 5500000,
    stock: 120,
    characteristics: { durete: 'Très élevée', flamme: 'Longue et régulière', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Hetre',
    description:
      'Le hêtre offre une combustion vive et régulière avec un pouvoir calorifique remarquable. Facile à fendre, il est très apprécié pour le chauffage domestique.',
    priceEur: 8000,
    priceUsd: 8700,
    priceFcfa: 5200000,
    stock: 150,
    characteristics: { durete: 'Élevée', flamme: 'Vive', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Frene',
    description:
      'Le frêne se consume facilement, même légèrement humide, avec un bon pouvoir calorifique. Très apprécié pour son feu vif et son faible taux de cendre.',
    priceEur: 7800,
    priceUsd: 8500,
    priceFcfa: 5100000,
    stock: 160,
    characteristics: { durete: 'Élevée', flamme: 'Vive', rendement: 'Très bon', type: 'Bûches' },
  },
  {
    essence: 'Orme',
    description:
      "L'orme brûle longtemps et chauffe fort, avec un pouvoir calorifique comparable au chêne. Son bois dense convient parfaitement aux hivers rigoureux.",
    priceEur: 7900,
    priceUsd: 8600,
    priceFcfa: 5150000,
    stock: 80,
    characteristics: { durete: 'Très élevée', flamme: 'Longue', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Erable',
    description:
      "L'érable produit une flamme stable et une chaleur agréable avec un pouvoir calorifique correct. C'est un bon compromis pour le chauffage quotidien.",
    priceEur: 7000,
    priceUsd: 7600,
    priceFcfa: 4550000,
    stock: 100,
    characteristics: { durete: 'Élevée', flamme: 'Stable', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Noyer',
    description:
      'Le noyer est un feuillu dense au feu soutenu et homogène. Un très bon compromis entre longévité de la braise et belle flamme.',
    priceEur: 7400,
    priceUsd: 8000,
    priceFcfa: 4800000,
    stock: 70,
    characteristics: { durete: 'Élevée', flamme: 'Soutenue', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Olivier',
    description:
      "L'olivier est un bois extrêmement dense offrant une chaleur puissante et durable. Rare et précieux, il se consume très lentement.",
    priceEur: 8800,
    priceUsd: 9500,
    priceFcfa: 5750000,
    stock: 60,
    characteristics: { durete: 'Très élevée', flamme: 'Forte', rendement: 'Excellent', type: 'Bûches' },
  },

  // ── Groupe 2 — Feuillus mi-durs / intermédiaires ────────────────────
  {
    essence: 'Chataignier',
    description:
      'Le châtaignier offre un feu vif et régulier avec un bon pouvoir calorifique. Attention aux projections : idéal pour les cheminées fermées et poêles.',
    priceEur: 7400,
    priceUsd: 8000,
    priceFcfa: 4800000,
    stock: 110,
    characteristics: { durete: 'Élevée', flamme: 'Régulière', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Acacia',
    description:
      "L'acacia, également appelé faux-acacia, produit un bois charnu au feu long et chaud. Son pouvoir calorifique se rapproche des feuillus durs.",
    priceEur: 8100,
    priceUsd: 8800,
    priceFcfa: 5300000,
    stock: 85,
    characteristics: { durete: 'Très élevée', flamme: 'Longue', rendement: 'Excellent', type: 'Bûches' },
  },
  {
    essence: 'Bouleau',
    description:
      'Le bouleau s\'allume facilement et produit une belle flamme vive, idéale pour démarrer le feu. Son écorce constitue un excellent allume-feu naturel.',
    priceEur: 7200,
    priceUsd: 7800,
    priceFcfa: 4700000,
    stock: 180,
    characteristics: { durete: 'Moyenne', flamme: 'Vive et lumineuse', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Merisier',
    description:
      'Le merisier offre une flamme agréable et régulière avec un pouvoir calorifique modéré. Léger, il est facile à fendre et à allumer.',
    priceEur: 6900,
    priceUsd: 7500,
    priceFcfa: 4500000,
    stock: 75,
    characteristics: { durete: 'Moyenne', flamme: 'Régulière', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'ArbresFruitiers',
    description:
      'Les bois fruitiers regroupent pommiers, cerisiers et autres essences de vergers : des bûches denses au feu odorant et soutenu.',
    priceEur: 7100,
    priceUsd: 7700,
    priceFcfa: 4620000,
    stock: 95,
    characteristics: { durete: 'Élevée', flamme: 'Odorante', rendement: 'Bon', type: 'Bûches' },
  },
  {
    essence: 'Robinier',
    description:
      'Le robinier produit un bois très dense et un feu extrêmement chaud. Il doit être bien sec avant combustion pour un rendement optimal.',
    priceEur: 8200,
    priceUsd: 8900,
    priceFcfa: 5350000,
    stock: 90,
    characteristics: { durete: 'Très élevée', flamme: 'Forte', rendement: 'Excellent', type: 'Bûches' },
  },

  // ── Groupe 3 — Résineux & feuillus tendres ──────────────────────────
  {
    essence: 'Peuplier',
    description:
      "Le peuplier s'allume facilement mais se consume rapidement. Son faible pouvoir calorifique le destine aux feux de cheminée d'agrément ou en complément.",
    priceEur: 5200,
    priceUsd: 5700,
    priceFcfa: 3400000,
    stock: 140,
    characteristics: { durete: 'Faible', flamme: 'Rapide', rendement: 'Faible', type: 'Bûches' },
  },
  {
    essence: 'Aulne',
    description:
      "L'aulne s'allume aisément et brûle sans produire d'étincelles, ce qui le rend agréable en foyer ouvert. Idéal en complément d'une essence dense.",
    priceEur: 6800,
    priceUsd: 7400,
    priceFcfa: 4400000,
    stock: 85,
    characteristics: { durete: 'Faible', flamme: 'Sans étincelles', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Tilleul',
    description:
      'Le tilleul brûle rapidement avec peu d\'étincelles. Sa flamme douce convient aux cheminées ouvertes, mais son pouvoir calorifique reste modéré.',
    priceEur: 6500,
    priceUsd: 7100,
    priceFcfa: 4200000,
    stock: 95,
    characteristics: { durete: 'Faible', flamme: 'Douce', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Saule',
    description:
      "Le saule brûle facilement avec un pouvoir calorifique modéré. Léger et facile à fendre, il constitue un appoint économique pour le chauffage.",
    priceEur: 5600,
    priceUsd: 6100,
    priceFcfa: 3650000,
    stock: 130,
    characteristics: { durete: 'Faible', flamme: 'Facile', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Platane',
    description:
      'Le platane brûle sans projeter d\'étincelles avec un pouvoir calorifique convenable. Très apprécié pour un usage en cheminée ouverte.',
    priceEur: 6300,
    priceUsd: 6900,
    priceFcfa: 4100000,
    stock: 100,
    characteristics: { durete: 'Moyenne', flamme: 'Sans étincelles', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Pin',
    description:
      'Le pin s\'allume rapidement et produit une belle flamme vive grâce à sa résine. Il se consume assez vite et peut produire des projections.',
    priceEur: 5500,
    priceUsd: 6000,
    priceFcfa: 3600000,
    stock: 170,
    characteristics: { durete: 'Faible', flamme: 'Vive et résineuse', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Sapin',
    description:
      'Le sapin s\'allume très facilement avec une flamme claire et rapide. Densité faible, il sert principalement de bois d\'allumage.',
    priceEur: 5400,
    priceUsd: 5900,
    priceFcfa: 3500000,
    stock: 190,
    characteristics: { durete: 'Faible', flamme: 'Claire et rapide', rendement: 'Faible', type: 'Bûches' },
  },
  {
    essence: 'Epicea',
    description:
      "L'épicéa s'allume très rapidement et produit une flamme haute et claire, parfait pour démarrer un feu. Densité faible, il se consume vite.",
    priceEur: 5900,
    priceUsd: 6400,
    priceFcfa: 3800000,
    stock: 220,
    characteristics: { durete: 'Faible', flamme: 'Haute et claire', rendement: 'Moyen', type: 'Bûches' },
  },
  {
    essence: 'Meleze',
    description:
      'Le mélèze est le résineux le plus dense : un bon feu soutenu et assez durable, au léger parfum résineux.',
    priceEur: 6200,
    priceUsd: 6700,
    priceFcfa: 4050000,
    stock: 120,
    characteristics: { durete: 'Moyenne', flamme: 'Soutenue', rendement: 'Bon', type: 'Bûches' },
  },
]

const products = seedProducts.map((seed, index) => {
  const data = ESSENCE_DATA[seed.essence]
  return {
    name: `Bûches de ${data.label}`,
    slug: `buches-de-${seed.essence.toLowerCase()}`,
    essence: seed.essence,
    description: seed.description,
    priceEur: seed.priceEur,
    priceUsd: seed.priceUsd,
    priceFcfa: seed.priceFcfa,
    stock: seed.stock,
    dimensions: {
      length_mm: 250,
      width_mm: 100,
      thickness_mm: 100,
      weight_kg_m3: data.densite_sec_kg_m3,
    },
    images: [WOOD_IMAGES[index % WOOD_IMAGES.length]],
    characteristics: {
      densite_vert_kg_m3: data.densite_vert_kg_m3,
      densite_sec_kg_m3: data.densite_sec_kg_m3,
      pouvoir_calorifique: data.pouvoir_calorifique,
      sechage: '2 ans',
      origine: 'Suisse et Europe',
      certification: 'PEFC',
      ...seed.characteristics,
    },
  }
})

const cmsContent = [
  { key: 'hero_title', value: "Des bois de chauffage d'excellence", type: 'text', label: 'Titre hero principal' },
  {
    key: 'hero_subtitle',
    value:
      'SwissWood sélectionne et livre les essences les plus performantes pour chauffer votre foyer, saison après saison, à travers toute l’Europe.',
    type: 'text',
    label: 'Sous-titre hero',
  },
  {
    key: 'about_text',
    value:
      'Depuis plus de 20 ans, SwissWood fournit des bois de chauffage certifiés aux familles et professionnels exigeants, avec un pouvoir calorifique optimal et des essences durables.',
    type: 'text',
    label: 'Texte à propos',
  },
  { key: 'contact_email', value: 'contact@swisswood.ch', type: 'text', label: 'Email de contact' },
  { key: 'contact_phone', value: '+41 22 123 45 67', type: 'text', label: 'Téléphone' },
  { key: 'contact_address', value: 'Rue du Bois 12, 1201 Genève, Suisse', type: 'text', label: 'Adresse' },
]

async function main(): Promise<void> {
  console.log('🌱 Démarrage du seed...')

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
  console.log(`✅ ${products.length} produits insérés`)

  for (const entry of cmsContent) {
    await prisma.cmsContent.upsert({
      where: { key: entry.key },
      update: entry,
      create: entry,
    })
  }
  console.log(`✅ ${cmsContent.length} contenus CMS insérés`)

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@swisswood.ch'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      firstName: 'SwissWood',
      lastName: 'Admin',
      role: 'super_admin',
      emailVerified: true,
      country: 'Suisse',
    },
  })
  console.log(`✅ Admin initial : ${adminEmail}`)

  console.log('🎉 Seed terminé')
}

main()
  .catch((error) => {
    console.error('❌ Erreur pendant le seed :', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
