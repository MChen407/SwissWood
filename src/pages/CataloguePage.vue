<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import { api, ESSENCE_GROUPS, type ProductDto, type ProductEssence } from '@/lib/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const products = ref<ProductDto[]>([])
const loading = ref(true)
const search = ref('')
const selectedEssence = ref('')
const selectedGroup = ref('')
const sortBy = ref<'price-asc' | 'price-desc' | 'name'>('price-asc')

const page = ref(1)
const pageSize = 12
const total = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
let searchTimer: ReturnType<typeof setTimeout> | null = null

const essences = ESSENCE_GROUPS

const activeGroup = computed(() => essences.find((g) => g.id === selectedGroup.value) ?? null)

onMounted(async () => {
  if (route.query.essence) selectedEssence.value = route.query.essence as string
  if (route.query.group) selectedGroup.value = route.query.group as string
  await load()
})

watch(search, () => {
  if (page.value !== 1) page.value = 1
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(), 350)
})
watch([selectedEssence, selectedGroup, sortBy], () => {
  if (searchTimer) clearTimeout(searchTimer)
  if (page.value !== 1) page.value = 1
  else load()
})
watch(page, () => load())
watch([selectedEssence, selectedGroup], () => {
  const query: Record<string, string> = { ...(route.query as Record<string, string>) }
  if (selectedEssence.value) {
    query.essence = selectedEssence.value
    delete query.group
  } else if (selectedGroup.value) {
    query.group = selectedGroup.value
    delete query.essence
  } else {
    delete query.essence
    delete query.group
  }
  router.replace({ query })
})

async function load() {
  loading.value = true
  const res = await api.products.list({
    active: true,
    essence: selectedEssence.value ? (selectedEssence.value as ProductEssence) : undefined,
    group: selectedGroup.value || undefined,
    search: search.value || undefined,
    sort: sortBy.value === 'price-asc' ? 'price_asc' : sortBy.value === 'price-desc' ? 'price_desc' : 'name',
    limit: pageSize,
    offset: (page.value - 1) * pageSize,
  })
  products.value = res.items
  total.value = res.total
  loading.value = false
}

function selectGroup(id: string) {
  selectedEssence.value = ''
  selectedGroup.value = selectedGroup.value === id ? '' : id
}

function selectEssence(e: string) {
  selectedEssence.value = selectedEssence.value === e ? '' : e
}

function clearFilters() {
  search.value = ''; selectedEssence.value = ''; selectedGroup.value = ''; sortBy.value = 'price-asc'
}
const hasFilters = computed(() => !!search.value || !!selectedEssence.value || !!selectedGroup.value)
</script>

<template>
  <DefaultLayout>
    <div class="py-14 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-sm font-medium uppercase tracking-widest mb-2" style="color:#C89B5D;">{{ t('home.selectionLabel') }}</p>
        <h1 class="font-display text-4xl font-semibold">SwissWood {{ t('catalogue.title') }}</h1>
        <p class="mt-2" style="color:#E8D4A8;">{{ t('catalogue.subtitle') }}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row gap-6">
        <aside class="md:w-64 flex-shrink-0">
          <div class="bg-white rounded-xl border p-5 sticky top-20" style="border-color:#E2DCD1;">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-semibold text-sm flex items-center gap-2" style="color:#4A2C1A;"><SlidersHorizontal class="w-4 h-4" style="color:#6B4226;" /> {{ t('catalogue.filters') }}</h2>
              <button v-if="hasFilters" @click="clearFilters" class="text-xs flex items-center gap-1 hover:underline" style="color:#B23A2E;"><X class="w-3 h-3" /> {{ t('catalogue.clear') }}</button>
            </div>
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-widest mb-2" style="color:#C89B5D;">{{ t('catalogue.category') }}</p>
              <button @click="clearFilters()"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                :style="!selectedGroup && !selectedEssence ? 'background:#6B4226; color:#fff;' : 'color:#6B4226;'"
                :class="!selectedGroup && !selectedEssence ? '' : 'hover:bg-wood-50'">{{ t('catalogue.allEssences') }}</button>

              <button v-for="group in essences" :key="group.id" @click="selectGroup(group.id)"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                :style="selectedGroup === group.id ? 'background:#6B4226; color:#fff;' : 'color:#6B4226;'"
                :class="selectedGroup === group.id ? '' : 'hover:bg-wood-50'">
                <span>{{ t(`essences.${group.labelKey}`) }}</span>
                <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': selectedGroup === group.id }" />
              </button>

              <div v-if="activeGroup" class="ml-3 mt-1 space-y-1">
                <button v-for="e in activeGroup.essences" :key="e" @click="selectEssence(e)"
                  class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                  :style="selectedEssence === e ? 'background:#6B4226; color:#fff;' : 'color:#6B4226;'"
                  :class="selectedEssence === e ? '' : 'hover:bg-wood-50'">{{ t(`essences.${e}`) }}</button>
              </div>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#C89B5D;" />
              <input v-model="search" type="text" :placeholder="t('catalogue.searchPlaceholder')"
                class="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg text-sm"
                style="border:1px solid #E2DCD1; color:#2B2420; outline:none;"
                onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
            </div>
            <SearchableSelect
              v-model="sortBy"
              className="sm:w-64"
              :options="[
                { value: 'price-asc', label: t('catalogue.sortPriceAsc') },
                { value: 'price-desc', label: t('catalogue.sortPriceDesc') },
                { value: 'name', label: t('catalogue.sortName') },
              ]"
            />
          </div>

          <p class="text-sm mb-4" style="color:#7A7167;">{{ total }} {{ t('catalogue.results') }}</p>

          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-white rounded-xl border overflow-hidden animate-pulse" style="border-color:#E2DCD1;">
              <div class="aspect-[4/3]" style="background:#E8D4A8;"></div>
              <div class="p-4 space-y-2"><div class="h-5 rounded w-3/4" style="background:#E8D4A8;"></div><div class="h-4 rounded" style="background:#E8D4A8;"></div></div>
            </div>
          </div>

          <div v-else-if="products.length === 0" class="text-center py-20 bg-white rounded-xl border" style="border-color:#E2DCD1;">
            <p style="color:#7A7167;">{{ t('catalogue.empty') }}</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="p in products" :key="p.id" :product="p" />
          </div>

          <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10 flex-wrap">
            <button type="button" @click="page = Math.max(1, page - 1)" :disabled="page === 1"
              class="px-3 py-2 rounded-lg text-sm border transition-colors"
              :class="page === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-wood-50'"
              style="border-color:#E2DCD1; color:#6B4226;">{{ t('catalogue.prev') }}</button>
            <button type="button" v-for="p in totalPages" :key="p" @click="page = p"
              class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
              :class="page === p ? 'text-wood-100' : 'border hover:bg-wood-50'"
              :style="page === p ? 'background:#6B4226;' : 'border-color:#E2DCD1; color:#6B4226;'">{{ p }}</button>
            <button type="button" @click="page = Math.min(totalPages, page + 1)" :disabled="page === totalPages"
              class="px-3 py-2 rounded-lg text-sm border transition-colors"
              :class="page === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-wood-50'"
              style="border-color:#E2DCD1; color:#6B4226;">{{ t('catalogue.next') }}</button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
