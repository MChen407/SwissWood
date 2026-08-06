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
    <div class="py-14 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-sm font-medium uppercase tracking-widest mb-2" style="color:#C89B5D;">Notre sélection</p>
        <h1 class="font-display text-4xl font-semibold">Catalogue SwissWood</h1>
        <p class="mt-2" style="color:#E8D4A8;">Bois de chauffage et fourneaux premium — certifiés FSC/PEFC, livrés en Europe</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row gap-6">
        <aside class="md:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl border p-5 sticky top-20" style="border-color:#E2DCD1;">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-sm flex items-center gap-2" style="color:#4A2C1A;"><SlidersHorizontal class="w-4 h-4" style="color:#6B4226;" /> Filtres</h2>
              <button v-if="hasFilters" @click="clearFilters" class="text-xs flex items-center gap-1 hover:underline" style="color:#B23A2E;"><X class="w-3 h-3" /> Effacer</button>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-widest mb-2" style="color:#C89B5D;">Essence</p>
              <button @click="selectedEssence = ''"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                :style="!selectedEssence ? 'background:#6B4226; color:#fff;' : 'color:#6B4226;'"
                :class="!selectedEssence ? '' : 'hover:bg-wood-50'">Toutes les essences</button>
              <button v-for="e in essences" :key="e" @click="selectedEssence = e"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                :style="selectedEssence === e ? 'background:#6B4226; color:#fff;' : 'color:#6B4226;'"
                :class="selectedEssence === e ? '' : 'hover:bg-wood-50'">{{ e }}</button>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#C89B5D;" />
              <input v-model="search" type="text" placeholder="Rechercher bois, essence..."
                class="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-sm"
                style="border:1px solid #E2DCD1; color:#2B2420; outline:none;"
                onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
            </div>
            <select v-model="sortBy" class="px-4 py-2.5 bg-white rounded-lg text-sm" style="border:1px solid #E2DCD1; color:#4A2C1A; outline:none;">
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom (A-Z)</option>
            </select>
          </div>

          <p class="text-sm mb-4" style="color:#7A7167;">{{ products.length }} produit(s)</p>

          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white rounded-xl border overflow-hidden animate-pulse" style="border-color:#E2DCD1;">
              <div class="aspect-[4/3]" style="background:#E8D4A8;"></div>
              <div class="p-4 space-y-2"><div class="h-5 rounded w-3/4" style="background:#E8D4A8;"></div><div class="h-4 rounded" style="background:#E8D4A8;"></div></div>
            </div>
          </div>

          <div v-else-if="products.length === 0" class="text-center py-20 bg-white rounded-xl border" style="border-color:#E2DCD1;">
            <p style="color:#7A7167;">Aucun produit trouvé. Essayez de modifier vos filtres.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="p in products" :key="p.id" :product="p" />
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
