// Correction en une passe des URLs de médias pointant vers le front (Vercel),
// qui ne dispose d'aucune route /api/media (404).
// Les URLs sont réécrites vers le domaine du backend réel.
// Usage : node scripts/fix-media-urls.mjs  (avec DATABASE_URL de production)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WRONG_HOST = 'https://swiss-wood.vercel.app/api/media/'
const RIGHT_HOST = 'https://swisswood-production.up.railway.app/api/media/'

function rewriteImage(url) {
  if (typeof url !== 'string') return url
  if (url.startsWith(WRONG_HOST)) return RIGHT_HOST + url.slice(WRONG_HOST.length)
  return url
}

async function fixProducts() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, images: true } })
  let updated = 0
  let broken = 0

  for (const p of products) {
    const images = Array.isArray(p.images) ? p.images : []
    const newImages = images.map(rewriteImage)
    if (newImages.some((img, i) => img !== images[i])) {
      await prisma.product.update({ where: { id: p.id }, data: { images: newImages } })
      updated += 1
      const affected = images.filter((img, i) => newImages[i] !== img)
      console.log(`  - ${p.name} (${p.id})`)
      for (const img of affected) console.log(`      ${img}  →  ${newImages[images.indexOf(img)]}`)
    }
    if (images.some((img) => typeof img === 'string' && img.startsWith(WRONG_HOST))) {
      broken += images.filter((img) => img.startsWith(WRONG_HOST)).length
    }
  }

  console.log(`\nProduits : ${updated} corrigé(s), ${broken} URL(s) cassée(s) trouvée(s).`)
}

async function fixAvatars() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, avatarUrl: true } })
  let updated = 0

  for (const u of users) {
    if (typeof u.avatarUrl === 'string' && u.avatarUrl.startsWith(WRONG_HOST)) {
      await prisma.user.update({ where: { id: u.id }, data: { avatarUrl: RIGHT_HOST + u.avatarUrl.slice(WRONG_HOST.length) } })
      updated += 1
      console.log(`  - avatar ${u.email} (${u.id})`)
    }
  }

  console.log(`\nAvatars : ${updated} corrigé(s).`)
}

async function main() {
  console.log('=== Fix des URLs de médias ===\n')
  await fixProducts()
  await fixAvatars()
}

main()
  .catch((error) => {
    console.error('❌ Erreur pendant la correction :', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })