<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import { useAuthStore } from '@/stores/auth'

const cart = useCartStore()
const currency = useCurrencyStore()
const auth = useAuthStore()
const router = useRouter()

function checkout() {
  if (!auth.isAuthenticated) router.push({ name: 'login', query: { redirect: '/commande' } })
  else router.push('/commande')
}
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-3xl font-medium text-primary-500 mb-8">Votre panier</h1>

      <div v-if="cart.items.length === 0" class="text-center py-20">
        <ShoppingCart class="w-16 h-16 text-wood-300 mx-auto mb-4" />
        <p class="text-wood-500 mb-4">Votre panier est vide</p>
        <RouterLink to="/catalogue" class="inline-flex items-center gap-2 text-primary-500 hover:underline">Parcourir le catalogue <ArrowRight class="w-4 h-4" /></RouterLink>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cart.items" :key="item.product.id" class="bg-white rounded-xl border border-wood-200 p-4 flex gap-4">
            <img :src="item.product.images[0]" :alt="item.product.name" class="w-24 h-24 rounded-lg object-cover" />
            <div class="flex-1">
              <RouterLink :to="`/produits/${item.product.slug}`"><h3 class="font-medium text-primary-500">{{ item.product.name }}</h3></RouterLink>
              <p class="text-xs text-wood-400">{{ item.product.essence }}</p>
              <div v-if="Object.keys(item.customization).length > 0" class="flex flex-wrap gap-2 mt-2">
                <span v-for="(val, key) in item.customization" :key="String(key)" class="text-xs bg-wood-100 px-2 py-0.5 rounded text-wood-500">{{ key }}: {{ val }}</span>
              </div>
              <div class="flex items-center justify-between mt-3">
                <div class="flex items-center border border-wood-200 rounded-lg">
                  <button @click="cart.updateQuantity(item.product.id, item.quantity - 1)" class="p-1.5 text-wood-500 hover:text-primary-500"><Minus class="w-3.5 h-3.5" /></button>
                  <span class="w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <button @click="cart.updateQuantity(item.product.id, item.quantity + 1)" class="p-1.5 text-wood-500 hover:text-primary-500"><Plus class="w-3.5 h-3.5" /></button>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-semibold text-primary-500">{{ currency.formatPrice(item.product.price_eur * item.quantity, 0, 0) }}</span>
                  <button @click="cart.removeItem(item.product.id)" class="text-wood-300 hover:text-error-500"><Trash2 class="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-wood-200 p-6 h-fit sticky top-20">
          <h2 class="font-medium text-primary-500 mb-4">Récapitulatif</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-wood-500">Sous-total</span><span class="font-medium">{{ currency.formatPrice(cart.subtotal, 0, 0) }}</span></div>
            <div class="flex justify-between"><span class="text-wood-500">Livraison</span><span class="text-wood-400">Calculée à l'étape suivante</span></div>
          </div>
          <div class="border-t border-wood-200 mt-4 pt-4 flex justify-between">
            <span class="font-medium text-primary-500">Total</span>
            <span class="text-xl font-semibold text-primary-500">{{ currency.formatPrice(cart.subtotal, 0, 0) }}</span>
          </div>
          <button @click="checkout" class="w-full mt-6 bg-primary-500 text-wood-100 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">Passer commande <ArrowRight class="w-4 h-4" /></button>
          <RouterLink to="/catalogue" class="block text-center mt-3 text-sm text-wood-500 hover:text-primary-500">Continuer mes achats</RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
