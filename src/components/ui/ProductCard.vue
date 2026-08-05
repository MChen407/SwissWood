<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShoppingCart, Star } from 'lucide-vue-next'
import type { Product } from '@/lib/supabase'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{ product: Product }>()
const currency = useCurrencyStore()
const cart = useCartStore()

function quickAdd() { cart.addItem(props.product, 1); cart.toggleCart() }
</script>

<template>
  <div class="group bg-white rounded-xl border border-wood-200 overflow-hidden transition-all hover:shadow-lg hover:border-wood-300">
    <RouterLink :to="`/produits/${product.slug}`" class="block relative aspect-[4/3] overflow-hidden bg-wood-100">
      <img :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      <div class="absolute top-3 left-3 bg-primary-500/90 text-wood-100 text-xs font-medium px-2.5 py-1 rounded-md">{{ product.essence }}</div>
    </RouterLink>

    <div class="p-4">
      <RouterLink :to="`/produits/${product.slug}`">
        <h3 class="font-display text-lg font-medium text-primary-500 group-hover:text-wood-600 transition-colors line-clamp-1">{{ product.name }}</h3>
      </RouterLink>
      <p class="text-sm text-wood-500 mt-1 line-clamp-2 leading-relaxed">{{ product.description }}</p>

      <div class="flex items-center gap-1 mt-2">
        <Star v-for="n in 4" :key="n" class="w-3.5 h-3.5 text-wood-400 fill-wood-400" />
        <Star class="w-3.5 h-3.5 text-wood-200" />
        <span class="text-xs text-wood-400 ml-1">(4.0)</span>
      </div>

      <div class="flex items-center justify-between mt-3">
        <span class="text-lg font-semibold text-primary-500">{{ currency.formatPrice(product.price_eur, product.price_usd, product.price_fcfa) }}</span>
        <button @click="quickAdd" class="p-2 rounded-lg bg-wood-100 text-wood-600 hover:bg-primary-500 hover:text-wood-100 transition-all" aria-label="Ajouter au panier">
          <ShoppingCart class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
