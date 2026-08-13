// Détection des produits dont les images sont des URLs relatives cassées
// (ex. "/uploads/...", "/api/media/..." résolues contre le mauvais domaine).
// Usage : node scripts/find-broken-images.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function isBroken(url) {
  if (typeof url !== 'string' || url.length === 0) return true
  if (url.startsWith('/uploads/')) return true
  if (url.startsWith('http://') || url.startsWith('https://')) return false
  return true
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, slug: true, images: true } })

  const broken = products
    .filter((p) => Array.isArray(p.images) && p.images.some((img) => isBroken(img)))
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brokenImages: Array.isArray(p.images)
        ? (p.images).filter((img) => isBroken(img))
        : [],
    }))

  if (broken.length === 0) {
    console.log('✅ Aucun produit avec des images cassées détecté.')
  } else {
    console.log(`⚠️  ${broken.length} produit(s) avec des images potentielles cassées :`)
    for (const p of broken) {
      console.log(`\n- ${p.name} (slug: ${p.slug}, id: ${p.id})`)
      for (const img of p.brokenImages) console.log(`    ${img}`)
    }
  }
}

main()
  .catch((error) => {
    console.error('❌ Erreur pendant la détection :', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })