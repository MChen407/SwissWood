<script setup lang="ts">
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import { itemLinePrice } from '@/lib/pricing'
import { resolveImageUrl } from '@/lib/api'

const { t } = useI18n()
const cart = useCartStore()
const currency = useCurrencyStore()
const router = useRouter()

function goToCart() { cart.toggleCart(); router.push('/panier') }
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="cart.isOpen" class="fixed inset-0 z-50 bg-black/40" @click="cart.toggleCart()"></div>
    </Transition>
    <Transition name="slide">
      <aside v-if="cart.isOpen" class="fixed right-0 top-0 h-full w-full max-w-md bg-wood-100 shadow-2xl z-50 flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-wood-200">
          <h2 class="font-display text-xl font-semibold text-primary-500 flex items-center gap-2"><ShoppingCart class="w-5 h-5" /> {{ t('cart.title') }}</h2>
          <button @click="cart.toggleCart()" class="p-2 text-wood-500 hover:text-primary-500"><X class="w-5 h-5" /></button>
        </div>

        <div v-if="cart.items.length === 0" class="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <ShoppingCart class="w-12 h-12 text-wood-300 mb-3" />
          <p class="text-wood-500 text-sm">{{ t('cart.empty') }}</p>
          <button @click="cart.toggleCart(); router.push('/catalogue')" class="mt-4 text-sm text-primary-500 hover:underline">{{ t('cart.browse') }}</button>
        </div>

        <div v-else class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="item in cart.items" :key="item.product.id" class="flex gap-3 bg-white rounded-lg p-3 border border-wood-200">
            <img :src="resolveImageUrl(item.product.images[0])" :alt="item.product.name" class="w-16 h-16 rounded-md object-cover" />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-primary-500 truncate">{{ item.product.name }}</h3>
              <p class="text-xs text-wood-500">{{ t(`essences.${item.product.essence}`) }}</p>
              <div v-if="Object.keys(item.customization).length > 0" class="text-xs text-wood-400 mt-1">
                <span v-for="(val, key) in item.customization" :key="String(key)" class="inline-block mr-2">{{ key }}: {{ val }}</span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-2">
                  <button @click="cart.updateQuantity(item.product.id, item.quantity - 1)" class="p-1 text-wood-500 hover:text-primary-500"><Minus class="w-3.5 h-3.5" /></button>
                  <span class="text-sm font-medium w-6 text-center">{{ item.quantity }}</span>
                  <button @click="cart.updateQuantity(item.product.id, item.quantity + 1)" class="p-1 text-wood-500 hover:text-primary-500"><Plus class="w-3.5 h-3.5" /></button>
                </div>
                <span class="text-sm font-semibold text-primary-500">{{ currency.formatPrice(itemLinePrice(item).eur, itemLinePrice(item).usd, itemLinePrice(item).fcfa) }}</span>
              </div>
            </div>
            <button @click="cart.removeItem(item.product.id)" class="p-1 text-wood-400 hover:text-error-500 self-start"><Trash2 class="w-4 h-4" /></button>
          </div>
        </div>

        <div v-if="cart.items.length > 0" class="border-t border-wood-200 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-wood-600">{{ t('cart.subtotal') }}</span>
            <span class="text-lg font-semibold text-primary-500">{{ currency.formatPrice(cart.subtotal, cart.subtotalUsd, cart.subtotalFcfa) }}</span>
          </div>
          <button @click="goToCart" class="w-full bg-primary-500 text-wood-100 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors">{{ t('cart.viewCart') }}</button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .2s}
.fade-enter-from,.fade-leave-to{opacity:0}
.slide-enter-active,.slide-leave-active{transition:transform .3s ease}
.slide-enter-from,.slide-leave-to{transform:translateX(100%)}
</style>
