<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, Trash2 } from 'lucide-vue-next'
import { supabase, type Product } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import ProductCard from '@/components/ui/ProductCard.vue'

const auth = useAuthStore()
const favorites = ref<Product[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('favorites').select('product_id, products(*)').eq('user_id', auth.user!.id)
  if (data) favorites.value = (data as unknown as { products: Product }[]).map(f => f.products)
  loading.value = false
})

async function remove(productId: string) {
  await supabase.from('favorites').delete().eq('product_id', productId).eq('user_id', auth.user!.id)
  favorites.value = favorites.value.filter(p => p.id !== productId)
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Mes favoris</h1>
    <div v-if="loading" class="text-center py-10"><p class="text-wood-400">Chargement...</p></div>
    <div v-else-if="favorites.length === 0" class="text-center py-20 bg-white rounded-xl border border-wood-200">
      <Heart class="w-12 h-12 text-wood-300 mx-auto mb-3" />
      <p class="text-wood-500">Aucun favori pour le moment</p>
      <RouterLink to="/catalogue" class="text-primary-500 hover:underline mt-2 inline-block">Découvrir le catalogue</RouterLink>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in favorites" :key="product.id" class="relative">
        <ProductCard :product="product" />
        <button @click="remove(product.id)" class="absolute top-3 right-3 p-2 bg-white rounded-full shadow text-error-500 hover:bg-error-100 transition-colors z-10"><Trash2 class="w-4 h-4" /></button>
      </div>
    </div>
  </div>
</template>
