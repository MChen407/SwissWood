<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { supabase, type Product } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()
const products = ref<Product[]>([])
const loading = ref(true)
const search = ref('')
const selectedEssence = ref('')
const sortBy = ref<'price-asc' | 'price-desc' | 'name'>('price-asc')

const essences = ['Teck', 'Iroko', 'Pin', 'Sapin']

onMounted(async () => {
  if (route.query.essence) selectedEssence.value = route.query.essence as string
  await load()
})

watch([search, selectedEssence, sortBy], load)
watch(selectedEssence, (v) => router.replace({ query: { ...route.query, essence: v || undefined } }))

async function load() {
  loading.value = true
  let q = supabase.from('products').select('*').eq('is_active', true)
  if (selectedEssence.value) q = q.eq('essence', selectedEssence.value)
  if (search.value) q = q.or(`name.ilike.%${search.value}%,description.ilike.%${search.value}%`)
  if (sortBy.value === 'price-asc') q = q.order('price_eur', { ascending: true })
  else if (sortBy.value === 'price-desc') q = q.order('price_eur', { ascending: false })
  else q = q.order('name', { ascending: true })
  const { data } = await q
  if (data) products.value = data as Product[]
  loading.value = false
}

function clearFilters() { search.value = ''; selectedEssence.value = ''; sortBy.value = 'price-asc' }
const hasFilters = computed(() => !!search.value || !!selectedEssence.value)
</script>

<template>
  <DefaultLayout>
    <div class="bg-primary-500 text-wood-100 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-medium">Catalogue</h1>
        <p class="mt-2 text-wood-200">Découvrez notre sélection de bois de construction premium</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row gap-6">
        <aside class="md:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl border border-wood-200 p-5 sticky top-20">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-medium text-primary-500 flex items-center gap-2"><SlidersHorizontal class="w-4 h-4" /> Filtres</h2>
              <button v-if="hasFilters" @click="clearFilters" class="text-xs text-wood-400 hover:text-error-500 flex items-center gap-1"><X class="w-3 h-3" /> Effacer</button>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-wider text-wood-400 mb-2">Essence</p>
              <button @click="selectedEssence = ''" :class="['w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', !selectedEssence ? 'bg-primary-500 text-wood-100' : 'text-wood-600 hover:bg-wood-100']">Toutes</button>
              <button v-for="e in essences" :key="e" @click="selectedEssence = e"
                :class="['w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', selectedEssence === e ? 'bg-primary-500 text-wood-100' : 'text-wood-600 hover:bg-wood-100']">{{ e }}</button>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wood-400" />
              <input v-model="search" type="text" placeholder="Rechercher un produit..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
            </div>
            <select v-model="sortBy" class="px-4 py-2.5 bg-white border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom (A-Z)</option>
            </select>
          </div>

          <p class="text-sm text-wood-500 mb-4">{{ products.length }} produit(s)</p>

          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white rounded-xl border border-wood-200 overflow-hidden animate-pulse">
              <div class="aspect-[4/3] bg-wood-200"></div>
              <div class="p-4 space-y-2"><div class="h-5 bg-wood-200 rounded w-3/4"></div><div class="h-4 bg-wood-200 rounded"></div></div>
            </div>
          </div>

          <div v-else-if="products.length === 0" class="text-center py-20"><p class="text-wood-400">Aucun produit trouvé. Essayez de modifier vos filtres.</p></div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="p in products" :key="p.id" :product="p" />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
