<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Star, Heart, ShoppingCart, Minus, Plus, Check, Truck, Shield, ChevronRight, Ruler } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import { api, resolveImageUrl, type ProductDto, type ProductReviewDto, type ProductEssence } from '@/lib/api'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { dimensionMultiplier } from '@/lib/pricing'

const { t, locale } = useI18n()
const route = useRoute()
const currency = useCurrencyStore()
const cart = useCartStore()
const auth = useAuthStore()

const product = ref<ProductDto | null>(null)
const similar = ref<ProductDto[]>([])
const reviews = ref<ProductReviewDto[]>([])
const loading = ref(true)
const quantity = ref(1)
const selectedImage = ref(0)
const isFavorite = ref(false)
const activeTab = ref<'description' | 'specs' | 'reviews'>('description')

const customLength = ref(4000)
const customWidth = ref(100)
const customThickness = ref(30)
const customTreatment = ref('Naturel')

onMounted(loadProduct)
watch(() => route.params.slug, loadProduct)

async function loadProduct() {
  loading.value = true
  try {
    const data = await api.products.bySlug(route.params.slug as string)
    product.value = data
    customLength.value = data.dimensions.length_mm ?? 4000
    customWidth.value = data.dimensions.width_mm ?? 100
    customThickness.value = data.dimensions.thickness_mm ?? 30
    await Promise.all([loadSimilar(data.essence, data.id), loadReviews(data.id)])
    if (auth.isAuthenticated) await checkFavorite(data.id)
  } catch {
    product.value = null
  } finally {
    loading.value = false
  }
}

async function loadSimilar(essence: string, excludeId: string) {
  const res = await api.products.list({ essence: essence as ProductEssence, active: true, exclude: excludeId, limit: 3 })
  similar.value = res.items
}

async function loadReviews(productId: string) {
  reviews.value = await api.products.reviews(productId)
}

async function checkFavorite(productId: string) {
  const favorites = await api.favorites.list()
  isFavorite.value = favorites.some(f => f.product_id === productId)
}

async function toggleFavorite() {
  if (!auth.isAuthenticated || !product.value) return
  if (isFavorite.value) {
    await api.favorites.remove(product.value.id)
    isFavorite.value = false
  } else {
    await api.favorites.add(product.value.id)
    isFavorite.value = true
  }
}

function addToCart() {
  if (!product.value) return
  cart.addItem(product.value, quantity.value, 'pcs', {
    longueur_mm: customLength.value, largeur_mm: customWidth.value,
    epaisseur_mm: customThickness.value, traitement: customTreatment.value,
  })
  cart.toggleCart()
}

const avgRating = computed(() => reviews.value.length === 0 ? 0 : (reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length).toFixed(1))

const priceMultiplier = computed(() => {
  if (!product.value) return 1
  return dimensionMultiplier(product.value, {
    longueur_mm: customLength.value,
    largeur_mm: customWidth.value,
    epaisseur_mm: customThickness.value,
  })
})

const computedPrice = computed(() => {
  if (!product.value) return { eur: 0, usd: 0, fcfa: 0 }
  return {
    eur: Math.round(product.value.price_eur * priceMultiplier.value * quantity.value),
    usd: Math.round(product.value.price_usd * priceMultiplier.value * quantity.value),
    fcfa: Math.round(product.value.price_fcfa * priceMultiplier.value * quantity.value),
  }
})

const reviewRating = ref(5)
const reviewComment = ref('')
const reviewSubmitting = ref(false)
const reviewError = ref('')
const reviewSubmitted = ref(false)

async function submitReview() {
  if (!product.value || !auth.isAuthenticated) return
  reviewError.value = ''
  reviewSubmitting.value = true
  try {
    await api.reviews.create({ productId: product.value.id, rating: reviewRating.value, comment: reviewComment.value })
    reviewSubmitted.value = true
    reviewComment.value = ''
  } catch (e: unknown) {
    reviewError.value = e instanceof Error ? e.message : t('common.error')
  } finally {
    reviewSubmitting.value = false
  }
}
</script>

<template>
  <DefaultLayout>
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-20 text-center"><p class="text-wood-400">{{ t('common.loading') }}</p></div>

    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav class="flex items-center gap-1 text-sm text-wood-400 mb-6">
        <RouterLink to="/" class="hover:text-primary-500">{{ t('navlinks.home') }}</RouterLink>
        <ChevronRight class="w-3 h-3" />
        <RouterLink to="/catalogue" class="hover:text-primary-500">{{ t('navlinks.catalogue') }}</RouterLink>
        <ChevronRight class="w-3 h-3" />
        <span class="text-primary-500">{{ product.name }}</span>
      </nav>

      <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div class="aspect-square rounded-2xl overflow-hidden bg-wood-100 border border-wood-200">
            <img :src="resolveImageUrl(product.images[selectedImage])" :alt="product.name" class="w-full h-full object-cover" />
          </div>
          <div v-if="product.images.length > 1" class="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button v-for="(url, i) in product.images" :key="url" type="button" @click="selectedImage = i"
              :class="['relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors',
                selectedImage === i ? 'border-primary-500' : 'border-wood-200 hover:border-primary-300']">
              <img :src="resolveImageUrl(url)" :alt="`${product.name} ${i + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 bg-primary-100 text-primary-500 text-xs font-medium rounded-md">{{ t(`essences.${product.essence}`) }}</span>
            <div class="flex items-center gap-1">
              <Star v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= Math.round(Number(avgRating)) ? 'text-wood-400 fill-wood-400' : 'text-wood-200'" />
              <span class="text-sm text-wood-400 ml-1">({{ reviews.length }} {{ t('product.reviews') }})</span>
            </div>
          </div>

          <h1 class="font-display text-3xl font-medium text-primary-500">{{ product.name }}</h1>
          <p class="mt-3 text-wood-600 leading-relaxed">{{ product.description }}</p>

          <div class="mt-6 text-3xl font-semibold text-primary-500">{{ currency.formatPrice(computedPrice.eur, computedPrice.usd, computedPrice.fcfa) }}</div>

          <div class="mt-6 bg-white rounded-xl border border-wood-200 p-5">
            <h3 class="font-medium text-primary-500 flex items-center gap-2 mb-4"><Ruler class="w-4 h-4" /> {{ t('product.customization') }}</h3>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-xs text-wood-500">{{ t('product.length') }} (mm)</label><input v-model.number="customLength" type="number" min="100" step="100" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
              <div><label class="text-xs text-wood-500">{{ t('product.width') }} (mm)</label><input v-model.number="customWidth" type="number" min="10" step="10" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
              <div><label class="text-xs text-wood-500">{{ t('product.thickness') }} (mm)</label><input v-model.number="customThickness" type="number" min="5" step="5" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
              <div><label class="text-xs text-wood-500">{{ t('product.treatment') }}</label>
                <div class="mt-1"><SearchableSelect v-model="customTreatment" :options="['Naturel','Autoclave Classe 3','Autoclave Classe 4','Saturateur'].map(t => ({ value: t, label: t }))" /></div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-4">
            <div class="flex items-center border border-wood-200 rounded-lg">
              <button @click="quantity = Math.max(1, quantity - 1)" class="p-2.5 text-wood-500 hover:text-primary-500"><Minus class="w-4 h-4" /></button>
              <span class="w-12 text-center font-medium">{{ quantity }}</span>
              <button @click="quantity++" class="p-2.5 text-wood-500 hover:text-primary-500"><Plus class="w-4 h-4" /></button>
            </div>
            <button @click="addToCart" class="flex-1 bg-primary-500 text-wood-100 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"><ShoppingCart class="w-5 h-5" /> {{ t('product.addToCart') }}</button>
            <button @click="toggleFavorite" :aria-label="isFavorite ? t('product.removeFavorite') : t('product.addFavorite')" class="p-3 border border-wood-200 rounded-lg transition-colors" :class="isFavorite ? 'text-cta-500 border-cta-500' : 'text-wood-500 hover:text-cta-500'"><Heart class="w-5 h-5" :class="isFavorite ? 'fill-cta-500' : ''" /></button>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <div class="flex items-center gap-2 text-sm text-wood-500"><Check class="w-4 h-4 text-success-500" /> {{ t('product.stock') }}: {{ product.stock }}</div>
            <div class="flex items-center gap-2 text-sm text-wood-500"><Shield class="w-4 h-4 text-success-500" /> {{ product.characteristics.certification || 'FSC' }}</div>
            <div class="flex items-center gap-2 text-sm text-wood-500"><Truck class="w-4 h-4 text-success-500" /> {{ t('product.shipping48') }}</div>
            <div class="flex items-center gap-2 text-sm text-wood-500"><Check class="w-4 h-4 text-success-500" /> {{ product.characteristics.class_emploi }}</div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mt-12 border-t border-wood-200 pt-8">
        <div class="flex gap-6 border-b border-wood-200 mb-6 overflow-x-auto no-scrollbar">
          <button v-for="tab in (['description','specs','reviews'] as const)" :key="tab" @click="activeTab = tab"
            :class="['pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent text-wood-500 hover:text-primary-500']">
            {{ tab === 'description' ? t('product.description') : tab === 'specs' ? t('product.characteristics') : `${t('product.reviews')} (${reviews.length})` }}
          </button>
        </div>

        <div v-if="activeTab === 'description'"><p class="text-wood-600 leading-relaxed">{{ product.description }}</p></div>

        <div v-else-if="activeTab === 'specs'" class="grid md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-wood-200 p-5">
            <h3 class="font-medium text-primary-500 mb-3">{{ t('product.baseDimensions') }}</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between"><dt class="text-wood-500">{{ t('product.length') }}</dt><dd class="font-medium">{{ product.dimensions.length_mm }} mm</dd></div>
              <div class="flex justify-between"><dt class="text-wood-500">{{ t('product.width') }}</dt><dd class="font-medium">{{ product.dimensions.width_mm }} mm</dd></div>
              <div class="flex justify-between"><dt class="text-wood-500">{{ t('product.thickness') }}</dt><dd class="font-medium">{{ product.dimensions.thickness_mm }} mm</dd></div>
              <div v-if="product.essence_data" class="flex justify-between"><dt class="text-wood-500">{{ t('product.densityWet') }}</dt><dd class="font-medium">{{ product.essence_data.densite_vert_kg_m3 }} kg/m³</dd></div>
              <div v-if="product.essence_data" class="flex justify-between"><dt class="text-wood-500">{{ t('product.densityDry') }}</dt><dd class="font-medium">{{ product.essence_data.densite_sec_kg_m3 }} kg/m³</dd></div>
              <div v-if="product.essence_data" class="flex justify-between"><dt class="text-wood-500">{{ t('product.calorificValue') }}</dt><dd class="font-medium">{{ product.essence_data.pouvoir_calorifique }} <span class="text-wood-400">(base 100)</span></dd></div>
              <div v-if="!product.essence_data" class="flex justify-between"><dt class="text-wood-500">{{ t('product.density') }}</dt><dd class="font-medium">{{ product.dimensions.weight_kg_m3 }} kg/m³</dd></div>
            </dl>
          </div>
          <div class="bg-white rounded-xl border border-wood-200 p-5">
            <h3 class="font-medium text-primary-500 mb-3">{{ t('product.techCharacteristics') }}</h3>
            <dl class="space-y-2 text-sm">
              <div v-for="(val, key) in product.characteristics" :key="String(key)" class="flex justify-between">
                <dt class="text-wood-500 capitalize">{{ t(`product.char.${String(key)}`) }}</dt><dd class="font-medium">{{ val }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div v-else class="space-y-8">
          <div v-if="auth.isAuthenticated" class="bg-white rounded-xl border border-wood-200 p-5 max-w-2xl">
            <h3 class="font-medium text-primary-500 mb-3">{{ t('product.writeReview') }}</h3>
            <p v-if="reviewSubmitted" class="text-sm text-success-500 mb-2">{{ t('product.reviewThanks') }}</p>
            <template v-else>
              <div class="flex items-center gap-1 mb-3">
                <button v-for="n in 5" :key="n" type="button" @click="reviewRating = n" class="p-0.5">
                  <Star class="w-6 h-6 transition-colors" :class="n <= reviewRating ? 'text-wood-400 fill-wood-400' : 'text-wood-200'" />
                </button>
                <span class="ml-2 text-sm text-wood-500">{{ reviewRating }}/5</span>
              </div>
              <textarea v-model="reviewComment" rows="3" maxlength="1000" :placeholder="t('product.reviewPlaceholder')"
                class="w-full px-3 py-2.5 border border-wood-200 rounded-lg text-sm resize-none focus:outline-none focus:border-primary-500"></textarea>
              <p v-if="reviewError" class="text-sm text-error-500 mt-2">{{ reviewError }}</p>
              <div class="mt-3 flex items-center gap-3">
                <button @click="submitReview" :disabled="reviewSubmitting"
                  class="bg-primary-500 text-wood-100 px-5 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50">
                  {{ reviewSubmitting ? t('common.loading') : t('product.submitReview') }}
                </button>
                <p class="text-xs text-wood-400">{{ t('product.reviewModerated') }}</p>
              </div>
            </template>
          </div>
          <div v-else class="bg-white rounded-xl border border-wood-200 p-5 max-w-2xl">
            <p class="text-wood-600 text-sm">
              <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="text-primary-500 hover:underline font-medium">{{ t('product.loginToReview') }}</RouterLink>
              {{ t('product.loginToReviewHint') }}
            </p>
          </div>

          <div>
            <div v-if="reviews.length === 0" class="text-center py-10 text-wood-400"><p>{{ t('product.noReviews') }}</p></div>
            <div v-else class="space-y-4">
              <div v-for="r in reviews" :key="r.id" class="bg-white rounded-xl border border-wood-200 p-5">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-1"><Star v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= r.rating ? 'text-wood-400 fill-wood-400' : 'text-wood-200'" /></div>
                  <span class="text-xs text-wood-400">{{ new Date(r.created_at).toLocaleDateString(locale) }}</span>
                </div>
                <p class="text-wood-600 text-sm leading-relaxed">{{ r.comment }}</p>
                <p class="mt-2 text-xs font-medium" style="color:#6B4226;">{{ r.user ? `${r.user.first_name} ${r.user.last_name}`.trim() : t('home.clientSwissWood') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="similar.length > 0" class="mt-16">
        <h2 class="font-display text-2xl font-medium text-primary-500 mb-6">{{ t('product.similar') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><ProductCard v-for="p in similar" :key="p.id" :product="p" /></div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-20 text-center">
      <p class="text-wood-400">{{ t('product.notFound') }}</p>
      <RouterLink to="/catalogue" class="text-primary-500 hover:underline mt-2 inline-block">{{ t('product.backToCatalogue') }}</RouterLink>
    </div>
  </DefaultLayout>
</template>