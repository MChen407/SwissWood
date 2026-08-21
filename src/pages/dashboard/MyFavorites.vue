<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Heart, Trash2 } from 'lucide-vue-next'
import { api, type ProductDto } from '@/lib/api'
import ProductCard from '@/components/ui/ProductCard.vue'

const { t } = useI18n()
const favorites = ref<ProductDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const favs = await api.favorites.list()
  favorites.value = favs.map(f => f.product)
  loading.value = false
})

async function remove(productId: string) {
  await api.favorites.remove(productId)
  favorites.value = favorites.value.filter(p => p.id !== productId)
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">{{ t('dashboard.favorites') }}</h1>
    <div v-if="loading" class="text-center py-10"><p class="text-wood-400">{{ t('common.loading') }}</p></div>
    <div v-else-if="favorites.length === 0" class="text-center py-20 bg-white rounded-xl border border-wood-200">
      <Heart class="w-12 h-12 text-wood-300 mx-auto mb-3" />
      <p class="text-wood-500">{{ t('dashboard.noFavoritesYet') }}</p>
      <RouterLink to="/catalogue" class="text-primary-500 hover:underline mt-2 inline-block">{{ t('dashboard.discoverCatalogue') }}</RouterLink>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in favorites" :key="product.id" class="relative">
        <ProductCard :product="product" />
        <button @click="remove(product.id)" :aria-label="t('cart.remove')" class="absolute top-3 right-3 p-2 bg-white rounded-full shadow text-error-500 hover:bg-error-100 transition-colors z-10"><Trash2 class="w-4 h-4" /></button>
      </div>
    </div>
  </div>
</template>
