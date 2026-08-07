import { PrismaClient, ProductEssence } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Teck Premium',
    slug: 'teck-premium',
    essence: 'Teck' as ProductEssence,
    description:
      'Bois de teck de qualité supérieure, naturellement résistant aux intempéries et aux insectes. Idéal pour terrasses, ponts de bateaux et mobilier extérieur haut de gamme.',
    priceEur: 28500,
    priceUsd: 31000,
    priceFcfa: 18600000,
    stock: 150,
    dimensions: { length_mm: 4000, width_mm: 100, thickness_mm: 30, weight_kg_m3: 650 },
    images: ['https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    characteristics: {
      class_emploi: 'Classe 4',
      traitement: 'Naturel',
      certification: 'FSC',
      origine: 'Asie du Sud-Est',
      durete: 'Élevée',
      resistance_humidite: 'Excellente',
    },
  },
  {
    name: 'Iroko Massif',
    slug: 'iroko-massif',
    essence: 'Iroko' as ProductEssence,
    description:
      'Essence africaine robuste et durable, excellent substitut au teck à un prix plus accessible. Parfait pour menuiseries extérieures, charpentes et parquets.',
    priceEur: 18900,
    priceUsd: 20500,
    priceFcfa: 12300000,
    stock: 200,
    dimensions: { length_mm: 5000, width_mm: 150, thickness_mm: 40, weight_kg_m3: 640 },
    images: ['https://images.pexels.com/photos/172284/pexels-photo-172284.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    characteristics: {
      class_emploi: 'Classe 3',
      traitement: 'Naturel',
      certification: 'PEFC',
      origine: "Afrique de l'Ouest",
      durete: 'Élevée',
      resistance_humidite: 'Bonne',
    },
  },
  {
    name: 'Pin Sylvestre',
    slug: 'pin-sylvestre',
    essence: 'Pin' as ProductEssence,
    description:
      'Bois de pin résineux, léger et facile à travailler. Très utilisé en charpente, ossature bois et menuiserie intérieure. Disponible traité pour extérieur.',
    priceEur: 8500,
    priceUsd: 9200,
    priceFcfa: 5500000,
    stock: 500,
    dimensions: { length_mm: 4000, width_mm: 100, thickness_mm: 25, weight_kg_m3: 510 },
    images: ['https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    characteristics: {
      class_emploi: 'Classe 2',
      traitement: 'Autoclave possible',
      certification: 'PEFC',
      origine: 'Europe du Nord',
      durete: 'Moyenne',
      resistance_humidite: 'Moyenne',
    },
  },
  {
    name: 'Sapin Alpin',
    slug: 'sapin-alpin',
    essence: 'Sapin' as ProductEssence,
    description:
      "Sapin blanc d'altitude, bois tendre et homogène, idéal pour construction légère, charpente et fabrication de meubles. Grain fin et aspect esthétique naturel.",
    priceEur: 7200,
    priceUsd: 7800,
    priceFcfa: 4700000,
    stock: 450,
    dimensions: { length_mm: 4500, width_mm: 120, thickness_mm: 30, weight_kg_m3: 450 },
    images: ['https://images.pexels.com/photos/915984/pexels-photo-915984.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    characteristics: {
      class_emploi: 'Classe 2',
      traitement: 'Naturel',
      certification: 'FSC',
      origine: 'Alpes Françaises',
      durete: 'Faible',
      resistance_humidite: 'Faible',
    },
  },
]

const cmsContent = [
  { key: 'hero_title', value: "Des bois de construction d'excellence", type: 'text', label: 'Titre hero principal' },
  {
    key: 'hero_subtitle',
    value:
      'SwissWood sélectionne et livre les essences les plus résistantes pour vos projets professionnels et personnels à travers l’Europe.',
    type: 'text',
    label: 'Sous-titre hero',
  },
  {
    key: 'about_text',
    value:
      'Depuis plus de 20 ans, SwissWood fournit des bois certifiés aux professionnels du bâtiment, menuisiers, architectes et particuliers exigeants.',
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