<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import { useAuthStore } from '@/stores/auth'
import { itemLinePrice } from '@/lib/pricing'

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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">Votre panier</h1>
          <p class="text-sm mt-1" style="color:#7A7167;" v-if="cart.items.length > 0">
            {{ cart.itemCount }} article{{ cart.itemCount > 1 ? 's' : '' }} sélectionné{{ cart.itemCount > 1 ? 's' : '' }}
          </p>
        </div>
        <RouterLink to="/catalogue" class="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:underline" style="color:#6B4226;">
          <ArrowLeft class="w-4 h-4" /> Continuer mes achats
        </RouterLink>
      </div>

      <!-- Empty state -->
      <div v-if="cart.items.length === 0" class="text-center py-24 bg-white rounded-2xl border" style="border-color:#E2DCD1;">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style="background:#E8D4A8;">
          <ShoppingCart class="w-8 h-8" style="color:#6B4226;" />
        </div>
        <h2 class="font-display text-xl font-semibold mb-2" style="color:#4A2C1A;">Votre panier est vide</h2>
        <p class="text-sm mb-6" style="color:#7A7167;">Ajoutez des produits pour commencer votre commande</p>
        <RouterLink to="/catalogue"
          class="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          style="background:#B23A2E;"
          onmouseover="this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
          Parcourir le catalogue <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <!-- Cart content -->
      <div v-else class="grid lg:grid-cols-3 gap-8">

        <!-- Items list -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Header row -->
          <div class="hidden sm:grid grid-cols-12 gap-4 px-4 pb-2 text-xs font-semibold uppercase tracking-wider" style="color:#7A7167;">
            <span class="col-span-6">Produit</span>
            <span class="col-span-3 text-center">Quantité</span>
            <span class="col-span-3 text-right">Sous-total</span>
          </div>

          <div v-for="item in cart.items" :key="item.product.id"
            class="bg-white rounded-xl border p-4 sm:p-5 grid grid-cols-12 gap-4 items-center"
            style="border-color:#E2DCD1; box-shadow:0 1px 4px rgba(43,36,32,0.06);">

            <!-- Image + info -->
            <div class="col-span-12 sm:col-span-6 flex gap-4 items-start">
              <RouterLink :to="`/produits/${item.product.slug}`">
                <img :src="item.product.images[0]" :alt="item.product.name" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              </RouterLink>
              <div class="flex-1 min-w-0">
                <RouterLink :to="`/produits/${item.product.slug}`">
                  <h3 class="font-semibold text-sm leading-snug" style="color:#4A2C1A;">{{ item.product.name }}</h3>
                </RouterLink>
                <span class="inline-block text-xs px-2 py-0.5 rounded mt-1" style="background:#E8D4A8; color:#6B4226;">{{ item.product.essence }}</span>
                <div v-if="Object.keys(item.customization).length > 0" class="flex flex-wrap gap-1.5 mt-1.5">
                  <span v-for="(val, key) in item.customization" :key="String(key)"
                    class="text-xs px-2 py-0.5 rounded" style="background:#FAF7F2; color:#7A7167;">{{ key }}: {{ val }}</span>
                </div>
                <p class="text-xs mt-1.5 font-semibold sm:hidden" style="color:#4A2C1A;">
                  {{ currency.formatPrice(itemLinePrice(item).eur / item.quantity, itemLinePrice(item).usd / item.quantity, itemLinePrice(item).fcfa / item.quantity) }} / unité
                </p>
              </div>
            </div>

            <!-- Quantity -->
            <div class="col-span-7 sm:col-span-3 flex items-center gap-2 sm:justify-center">
              <div class="flex items-center rounded-lg overflow-hidden" style="border:1px solid #E2DCD1;">
                <button @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
                  class="p-2 transition-colors hover:bg-wood-50" style="color:#6B4226;">
                  <Minus class="w-3.5 h-3.5" />
                </button>
                <span class="w-10 text-center text-sm font-semibold" style="color:#4A2C1A;">{{ item.quantity }}</span>
                <button @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                  class="p-2 transition-colors hover:bg-wood-50" style="color:#6B4226;">
                  <Plus class="w-3.5 h-3.5" />
                </button>
              </div>
              <button @click="cart.removeItem(item.product.id)"
                class="p-1.5 rounded-lg transition-colors hover:bg-red-50" style="color:#E2DCD1;"
                onmouseover="this.style.color='#B23A2E'" onmouseout="this.style.color='#E2DCD1'"
                aria-label="Supprimer">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <!-- Subtotal -->
            <div class="col-span-5 sm:col-span-3 text-right">
              <span class="font-bold text-base" style="color:#4A2C1A;">
                {{ currency.formatPrice(itemLinePrice(item).eur, itemLinePrice(item).usd, itemLinePrice(item).fcfa) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="bg-white rounded-xl border p-6 h-fit sticky top-20" style="border-color:#E2DCD1; box-shadow:0 2px 8px rgba(43,36,32,0.06);">
          <h2 class="font-display text-lg font-semibold mb-5" style="color:#4A2C1A;">Récapitulatif</h2>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span style="color:#7A7167;">Sous-total</span>
              <span class="font-semibold" style="color:#4A2C1A;">{{ currency.formatPrice(cart.subtotal, cart.subtotalUsd, cart.subtotalFcfa) }}</span>
            </div>
            <div class="flex justify-between">
              <span style="color:#7A7167;">Livraison</span>
              <span style="color:#7A7167;">Calculée à l'étape suivante</span>
            </div>
          </div>

          <div class="my-5" style="border-top:1px solid #E2DCD1;"></div>

          <div class="flex justify-between items-center mb-6">
            <span class="font-semibold text-base" style="color:#4A2C1A;">Total estimé</span>
            <span class="text-2xl font-bold" style="color:#4A2C1A;">{{ currency.formatPrice(cart.subtotal, cart.subtotalUsd, cart.subtotalFcfa) }}</span>
          </div>

          <button @click="checkout"
            class="w-full text-white py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            style="background:#B23A2E; box-shadow:0 4px 12px rgba(178,58,46,0.25);"
            onmouseover="this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
            Passer commande <ArrowRight class="w-4 h-4" />
          </button>

          <!-- Reassurance -->
          <div class="mt-5 space-y-2.5 pt-5" style="border-top:1px solid #E2DCD1;">
            <div class="flex items-center gap-2 text-xs" style="color:#7A7167;">
              <Shield class="w-4 h-4 flex-shrink-0" style="color:#6B4226;" />
              Paiement 100% sécurisé
            </div>
            <div class="flex items-center gap-2 text-xs" style="color:#7A7167;">
              <Truck class="w-4 h-4 flex-shrink-0" style="color:#6B4226;" />
              Livraison en Europe
            </div>
            <div class="flex items-center gap-2 text-xs" style="color:#7A7167;">
              <RotateCcw class="w-4 h-4 flex-shrink-0" style="color:#6B4226;" />
              Retours facilités sous 14 jours
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
