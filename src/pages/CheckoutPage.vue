<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import { useAuthStore } from '@/stores/auth'
import { itemLinePrice } from '@/lib/pricing'
import { COUNTRIES } from '@/lib/countries'
import { api } from '@/lib/api'

const cart = useCartStore()
const currency = useCurrencyStore()
const auth = useAuthStore()
const router = useRouter()

const shipping = ref({
  address: auth.profile?.address || '',
  city: auth.profile?.city || '',
  country: auth.profile?.country || 'Suisse',
  phone: auth.profile?.phone || '',
  notes: '',
})
const loading = ref(false)
const error = ref('')

async function placeOrder() {
  if (cart.items.length === 0) return
  error.value = ''; loading.value = true
  try {
    const order = await api.orders.create({
      items: cart.items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        unit: i.unit,
        customization: i.customization,
      })),
      currency: currency.currency as 'EUR' | 'USD' | 'FCFA',
      shipping_address: { ...shipping.value },
      notes: shipping.value.notes,
    })

    cart.clear()
    router.push({ name: 'payment', query: { order: order.id } })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  } finally { loading.value = false }
}
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Back + Steps -->
      <div class="flex items-center justify-between mb-8">
        <button @click="router.back()" class="flex items-center gap-2 text-sm font-medium transition-colors hover:underline" style="color:#6B4226;">
          <ArrowLeft class="w-4 h-4" /> Retour au panier
        </button>
        <!-- Progress bar -->
        <div class="hidden sm:flex items-center gap-2 text-xs font-medium">
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white" style="background:#6B4226;">
            <span class="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[10px]">1</span>
            Livraison
          </span>
          <div class="w-8 h-px" style="background:#E2DCD1;"></div>
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style="color:#7A7167; background:#FAF7F2; border:1px solid #E2DCD1;">
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style="border:1.5px solid #C89B5D;">2</span>
            Paiement
          </span>
          <div class="w-8 h-px" style="background:#E2DCD1;"></div>
          <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style="color:#7A7167; background:#FAF7F2; border:1px solid #E2DCD1;">
            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style="border:1.5px solid #C89B5D;">3</span>
            Confirmation
          </span>
        </div>
      </div>

      <h1 class="font-display text-3xl font-semibold mb-8" style="color:#4A2C1A;">Finaliser ma commande</h1>

      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">

          <!-- Shipping address -->
          <div class="bg-white rounded-xl border p-6" style="border-color:#E2DCD1;">
            <h2 class="font-semibold text-base mb-5" style="color:#4A2C1A;">Adresse de livraison</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">Adresse</label>
                <input v-model="shipping.address" type="text" placeholder="123 Rue du Bois"
                  class="w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">Ville</label>
                <input v-model="shipping.city" type="text" placeholder="Genève"
                  class="w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">Pays</label>
                <select v-model="shipping.country"
                  class="w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'">
                  <option v-for="c in COUNTRIES" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">Téléphone</label>
                <input v-model="shipping.phone" type="tel" placeholder="+41 79 123 45 67"
                  class="w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">Notes de livraison (optionnel)</label>
                <textarea v-model="shipping.notes" rows="2" placeholder="Instructions particulières..."
                  class="w-full px-3 py-2.5 rounded-lg text-sm transition-colors resize-none"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'"></textarea>
              </div>
            </div>
          </div>

          <!-- Cart items -->
          <div class="bg-white rounded-xl border p-6" style="border-color:#E2DCD1;">
            <h2 class="font-semibold text-base mb-4" style="color:#4A2C1A;">Articles commandés</h2>
            <div class="space-y-4">
              <div v-for="item in cart.items" :key="item.product.id"
                class="flex items-center gap-4 pb-4 last:pb-0 last:border-0" style="border-bottom:1px solid #FAF7F2;">
                <img :src="item.product.images[0]" :alt="item.product.name" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold truncate" style="color:#4A2C1A;">{{ item.product.name }}</p>
                  <p class="text-xs mt-0.5" style="color:#7A7167;">
                    {{ item.quantity }} × {{ currency.formatPrice(itemLinePrice(item).eur / item.quantity, itemLinePrice(item).usd / item.quantity, itemLinePrice(item).fcfa / item.quantity) }}
                  </p>
                </div>
                <span class="text-sm font-bold flex-shrink-0" style="color:#4A2C1A;">
                  {{ currency.formatPrice(itemLinePrice(item).eur, itemLinePrice(item).usd, itemLinePrice(item).fcfa) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-xl border p-6 h-fit sticky top-20" style="border-color:#E2DCD1; box-shadow:0 2px 8px rgba(43,36,32,0.06);">
          <h2 class="font-display text-lg font-semibold mb-5" style="color:#4A2C1A;">Résumé de commande</h2>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span style="color:#7A7167;">Sous-total</span>
              <span class="font-semibold" style="color:#4A2C1A;">{{ currency.formatPrice(cart.subtotal, cart.subtotalUsd, cart.subtotalFcfa) }}</span>
            </div>
            <div class="flex justify-between">
              <span style="color:#7A7167;">Livraison</span>
              <span style="color:#7A7167;">À déterminer</span>
            </div>
          </div>

          <div class="my-5" style="border-top:1px solid #E2DCD1;"></div>

          <div class="flex justify-between items-center mb-6">
            <span class="font-semibold" style="color:#4A2C1A;">Total</span>
            <span class="text-2xl font-bold" style="color:#4A2C1A;">{{ currency.formatPrice(cart.subtotal, cart.subtotalUsd, cart.subtotalFcfa) }}</span>
          </div>

          <div v-if="error" class="mb-4 p-3 rounded-lg text-sm" style="background:#fde8e6; color:#C0392B;">{{ error }}</div>

          <button @click="placeOrder" :disabled="loading"
            class="w-full text-white py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style="background:#B23A2E; box-shadow:0 4px 12px rgba(178,58,46,0.25);"
            onmouseover="if(!this.disabled) this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
            <span v-if="loading">Traitement en cours...</span>
            <span v-else class="flex items-center gap-2">Continuer vers le paiement <ArrowRight class="w-4 h-4" /></span>
          </button>

          <!-- Reassurance -->
          <div class="mt-5 space-y-2.5 pt-5" style="border-top:1px solid #E2DCD1;">
            <div class="flex items-center gap-2 text-xs" style="color:#7A7167;">
              <Shield class="w-4 h-4 flex-shrink-0" style="color:#6B4226;" /> Paiement 100% sécurisé
            </div>
            <div class="flex items-center gap-2 text-xs" style="color:#7A7167;">
              <Truck class="w-4 h-4 flex-shrink-0" style="color:#6B4226;" /> Livraison Europe
            </div>
            <div class="flex items-center gap-2 text-xs" style="color:#7A7167;">
              <RotateCcw class="w-4 h-4 flex-shrink-0" style="color:#6B4226;" /> Retours sous 14 jours
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
