<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShoppingCart, Star } from 'lucide-vue-next'
import type { ProductDto } from '@/lib/api'
import { useCurrencyStore } from '@/stores/currency'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{ product: ProductDto }>()
const currency = useCurrencyStore()
const cart = useCartStore()

function quickAdd() { cart.addItem(props.product, 1); cart.toggleCart() }
</script>

<template>
  <div class="group bg-white rounded-xl border overflow-hidden transition-all duration-300"
    style="border-color:#E2DCD1; box-shadow: 0 2px 8px rgba(43,36,32,0.06);"
    onmouseover="this.style.boxShadow='0 8px 24px rgba(43,36,32,0.12)'; this.style.transform='translateY(-4px)'"
    onmouseout="this.style.boxShadow='0 2px 8px rgba(43,36,32,0.06)'; this.style.transform='translateY(0)'">

    <!-- Image -->
    <RouterLink :to="`/produits/${product.slug}`" class="block relative overflow-hidden" style="aspect-ratio:4/3; background:#FAF7F2;">
      <img :src="product.images[0]" :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy" />
      <!-- Essence badge -->
      <span class="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded text-white uppercase tracking-wider"
        style="background:#6B4226; letter-spacing:0.04em;">{{ product.essence }}</span>
      <!-- Out of stock overlay -->
      <div v-if="product.stock === 0" class="absolute inset-0 flex items-center justify-center" style="background:rgba(250,247,242,0.75);">
        <span class="text-xs font-semibold px-3 py-1 rounded" style="color:#7A7167; background:#F0EDE7; border:1px solid #E2DCD1;">Rupture de stock</span>
      </div>
      <!-- Low stock -->
      <span v-else-if="product.stock <= 5 && product.stock > 0"
        class="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded"
        style="background:#FBF0DA; color:#8A6115;">
        Plus que {{ product.stock }} en stock
      </span>
    </RouterLink>

    <!-- Body -->
    <div class="p-4">
      <RouterLink :to="`/produits/${product.slug}`">
        <h3 class="font-display text-base font-semibold leading-snug line-clamp-1 transition-colors group-hover:opacity-80"
          style="color:#4A2C1A;">{{ product.name }}</h3>
      </RouterLink>
      <p class="text-sm mt-1.5 line-clamp-2 leading-relaxed" style="color:#7A7167;">{{ product.description }}</p>

      <!-- Stars -->
      <div class="flex items-center gap-1 mt-2.5">
        <Star v-for="n in 4" :key="n" class="w-3.5 h-3.5" style="color:#C89B5D; fill:#C89B5D;" />
        <Star class="w-3.5 h-3.5" style="color:#E2DCD1;" />
        <span class="text-xs ml-1" style="color:#7A7167;">(4.0)</span>
      </div>

      <!-- Price + CTA -->
      <div class="flex items-center justify-between mt-4">
        <span class="text-lg font-bold" style="color:#4A2C1A;">
          {{ currency.formatPrice(product.price_eur, product.price_usd, product.price_fcfa) }}
        </span>
        <button @click="quickAdd"
          :disabled="product.stock === 0"
          class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style="background:#B23A2E; box-shadow: 0 2px 6px rgba(178,58,46,0.2);"
          onmouseover="if(!this.disabled) this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'"
          aria-label="Ajouter au panier">
          <ShoppingCart class="w-3.5 h-3.5" />
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>
