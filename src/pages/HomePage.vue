<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, Shield, Leaf, Award, Truck, Flame, Check, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { api, type ProductDto, type LatestReviewDto } from '@/lib/api'

const products = ref<ProductDto[]>([])
const loading = ref(true)
const reviews = ref<LatestReviewDto[]>([])
const reviewsLoading = ref(true)
const reviewsTrack = ref<HTMLElement | null>(null)

function scrollReviews(direction: 1 | -1) {
  const track = reviewsTrack.value
  if (!track) return
  const card = track.querySelector<HTMLElement>('[data-review-card]')
  track.scrollBy({ left: direction * (card ? card.offsetWidth + 24 : 320), behavior: 'smooth' })
}

onMounted(async () => {
  const res = await api.products.list({ active: true, sort: 'price_desc' })
  products.value = res.items
  loading.value = false
  api.reviews.latest(5)
    .then((list) => { reviews.value = list })
    .finally(() => { reviewsLoading.value = false })
})

const trustItems = [
  { icon: Shield, title: 'Qualité certifiée', text: 'Bois certifiés FSC et PEFC' },
  { icon: Leaf, title: 'Durabilité', text: 'Essences respectueuses de l\'environnement' },
  { icon: Award, title: 'Excellence', text: '20 ans d\'expertise' },
  { icon: Truck, title: 'Livraison Europe', text: 'Expédition dans toute l\'Europe' },
]

const features = [
  'Essences nobles sélectionnées avec soin',
  'Taux d\'humidité contrôlé et certifié',
  'Traçabilité et certification garantie',
  'Service client disponible 6j/7',
]
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative overflow-hidden" style="background:#4A2C1A; min-height: 560px;">
      <div class="absolute inset-0">
        <img
          src="/wood2.webp"
          alt="Bois SwissWood"
          class="w-full h-full object-cover"
          style="opacity:0.22;"
        />
      </div>
      <div class="absolute inset-0" style="background: linear-gradient(105deg, #4A2C1A 45%, rgba(74,44,26,0.6) 80%, transparent 100%);"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm mb-6" style="background:rgba(200,155,93,0.18); color:#C89B5D;">
            <Flame class="w-4 h-4" /> Spécialiste bois de chauffage &amp; fourneaux
          </span>
          <h1 class="font-display leading-tight tracking-tight text-white" style="font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight:600;">
            La chaleur authentique<br />du bois suisse
          </h1>
          <p class="mt-6 text-lg leading-relaxed max-w-xl" style="color:#E8D4A8;">
            SwissWood sélectionne et livre les essences les plus résistantes pour chauffer votre foyer, saison après saison, à travers toute l'Europe.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4">
            <RouterLink to="/catalogue"
              class="inline-flex items-center justify-center gap-2 text-white px-7 py-3.5 rounded-lg font-semibold transition-all hover:shadow-lg"
              style="background:#B23A2E; box-shadow: 0 4px 12px rgba(178,58,46,0.25);"
              onmouseover="this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
              Découvrir le catalogue <ArrowRight class="w-4 h-4" />
            </RouterLink>
            <RouterLink to="/a-propos"
              class="inline-flex items-center justify-center px-7 py-3.5 rounded-lg font-medium transition-colors"
              style="border: 1.5px solid rgba(232,212,168,0.5); color:#E8D4A8;"
              onmouseover="this.style.background='rgba(232,212,168,0.1)'" onmouseout="this.style.background='transparent'">
              Notre savoir-faire
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust strip -->
    <section class="bg-white border-b" style="border-color:#E2DCD1;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="item in trustItems" :key="item.title" class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#E8D4A8;">
              <component :is="item.icon" class="w-5 h-5" style="color:#6B4226;" />
            </div>
            <div>
              <h3 class="text-sm font-semibold" style="color:#4A2C1A;">{{ item.title }}</h3>
              <p class="text-xs mt-0.5" style="color:#7A7167;">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="text-sm font-medium uppercase tracking-widest mb-2" style="color:#C89B5D;">Notre sélection</p>
          <h2 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">Nos essences de bois</h2>
          <p class="mt-2 text-sm" style="color:#7A7167;">Une sélection rigoureuse pour chaque usage</p>
        </div>
        <RouterLink to="/catalogue"
          class="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors hover:underline"
          style="color:#6B4226;">
          Voir tout <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="bg-white rounded-xl border overflow-hidden animate-pulse" style="border-color:#E2DCD1;">
          <div class="aspect-[4/3]" style="background:#E8D4A8;"></div>
          <div class="p-4 space-y-2">
            <div class="h-5 rounded w-3/4" style="background:#E8D4A8;"></div>
            <div class="h-4 rounded" style="background:#E8D4A8;"></div>
            <div class="h-4 rounded w-1/2" style="background:#E8D4A8;"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- Values section -->
    <section style="background:#E8D4A8;" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p class="text-sm font-medium uppercase tracking-widest mb-3" style="color:#6B4226;">Notre engagement</p>
            <h2 class="font-display text-3xl font-semibold mb-5" style="color:#4A2C1A;">Pourquoi choisir SwissWood ?</h2>
            <p class="leading-relaxed mb-6" style="color:#4A2C1A; font-size:15px;">
              Depuis plus de 20 ans, SwissWood accompagne les familles et professionnels exigeants. Nous sourçons nos bois auprès de fournisseurs certifiés, garantissant des essences durables, résistantes et de qualité premium.
            </p>
            <ul class="space-y-3">
              <li v-for="f in features" :key="f" class="flex items-center gap-3 text-sm" style="color:#4A2C1A;">
                <span class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style="background:#6B4226;">
                  <Check class="w-3 h-3 text-white" />
                </span>
                {{ f }}
              </li>
            </ul>
            <RouterLink to="/a-propos"
              class="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg font-semibold text-white transition-all"
              style="background:#6B4226;"
              onmouseover="this.style.background='#4A2C1A'" onmouseout="this.style.background='#6B4226'">
              En savoir plus <ArrowRight class="w-4 h-4" />
            </RouterLink>
          </div>
          <div class="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
            <img
              src="https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Atelier de bois SwissWood"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-white py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="p-6 rounded-xl" style="background:#FAF7F2; border: 1px solid #E2DCD1;">
            <p class="font-display text-4xl font-semibold" style="color:#4A2C1A;">20+</p>
            <p class="text-sm mt-2" style="color:#7A7167;">Années d'expérience</p>
          </div>
          <div class="p-6 rounded-xl" style="background:#FAF7F2; border: 1px solid #E2DCD1;">
            <p class="font-display text-4xl font-semibold" style="color:#4A2C1A;">10k+</p>
            <p class="text-sm mt-2" style="color:#7A7167;">Clients satisfaits</p>
          </div>
          <div class="p-6 rounded-xl" style="background:#FAF7F2; border: 1px solid #E2DCD1;">
            <p class="font-display text-4xl font-semibold" style="color:#4A2C1A;">15+</p>
            <p class="text-sm mt-2" style="color:#7A7167;">Pays desservis</p>
          </div>
          <div class="p-6 rounded-xl" style="background:#FAF7F2; border: 1px solid #E2DCD1;">
            <p class="font-display text-4xl font-semibold" style="color:#4A2C1A;">98%</p>
            <p class="text-sm mt-2" style="color:#7A7167;">Taux de satisfaction</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="rounded-2xl p-10 md:p-14 text-center relative overflow-hidden" style="background:#4A2C1A;">
        <div class="absolute inset-0 opacity-10">
          <img src="/wood3.webp" alt="" class="w-full h-full object-cover" />
        </div>
        <div class="relative">
          <p class="text-sm font-medium uppercase tracking-widest mb-3" style="color:#C89B5D;">Commencez maintenant</p>
          <h2 class="font-display text-3xl md:text-4xl font-semibold text-white">Prêt à réchauffer votre foyer ?</h2>
          <p class="mt-4 max-w-xl mx-auto text-base" style="color:#E8D4A8;">Explorez notre catalogue complet et trouvez l'essence parfaite pour passer un hiver au chaud.</p>
          <RouterLink to="/catalogue"
            class="inline-flex items-center gap-2 mt-8 text-white px-8 py-3.5 rounded-lg font-semibold transition-all"
            style="background:#B23A2E; box-shadow: 0 4px 12px rgba(178,58,46,0.3);"
            onmouseover="this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
            Parcourir le catalogue <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Client reviews carousel -->
    <section class="py-16" style="background:#FAF7F2; border-top:1px solid #E2DCD1;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="text-sm font-medium uppercase tracking-widest mb-2" style="color:#C89B5D;">Ils nous font confiance</p>
            <h2 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">Avis de nos clients</h2>
            <p class="mt-2 text-sm" style="color:#7A7167;">Les derniers avis publiés sur nos produits</p>
          </div>
          <div class="hidden sm:flex items-center gap-2">
            <button type="button" aria-label="Précédent" @click="scrollReviews(-1)"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style="background:#E8D4A8; color:#6B4226;" onmouseover="this.style.background='#D9BF8F'" onmouseout="this.style.background='#E8D4A8'">
              <ChevronLeft class="w-5 h-5" />
            </button>
            <button type="button" aria-label="Suivant" @click="scrollReviews(1)"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style="background:#E8D4A8; color:#6B4226;" onmouseover="this.style.background='#D9BF8F'" onmouseout="this.style.background='#E8D4A8'">
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-if="reviewsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 3" :key="n" class="bg-white rounded-xl border p-6 animate-pulse" style="border-color:#E2DCD1;">
            <div class="h-4 rounded w-1/3 mb-4" style="background:#E8D4A8;"></div>
            <div class="h-4 rounded mb-2" style="background:#E8D4A8;"></div>
            <div class="h-4 rounded w-2/3" style="background:#E8D4A8;"></div>
          </div>
        </div>

        <div v-else-if="reviews.length === 0" class="text-center py-10">
          <p class="text-sm" style="color:#7A7167;">Aucun avis publié pour le moment.</p>
        </div>

        <!-- Carousel track -->
        <div v-else ref="reviewsTrack"
          class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2"
          style="scrollbar-width:thin;">
          <RouterLink v-for="r in reviews" :key="r.id" :to="`/produits/${r.product.slug}`" data-review-card
            class="block bg-white rounded-xl border p-6 snap-start shrink-0 w-[85%] sm:w-[46%] lg:w-[30.5%] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style="border-color:#E2DCD1; box-shadow:0 2px 8px rgba(43,36,32,0.05);">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#E8D4A8;">
                <Quote class="w-5 h-5" style="color:#6B4226;" />
              </div>
              <div class="flex items-center gap-0.5">
                <Star v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= r.rating ? 'fill-wood-400 text-wood-400' : 'text-wood-200'" />
              </div>
            </div>
            <p class="text-sm leading-relaxed mb-5 line-clamp-4" style="color:#4A2C1A;">{{ r.comment }}</p>
            <div class="flex items-center justify-between pt-4 border-t" style="border-color:#E2DCD1;">
              <p class="text-sm font-semibold flex items-center gap-1.5" style="color:#6B4226;">
                {{ r.product.name }}
                <ArrowRight class="w-3.5 h-3.5" />
              </p>
              <p class="text-xs" style="color:#7A7167;">{{ new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
