<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Check } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useCartStore } from '@/stores/cart'
import { useCurrencyStore } from '@/stores/currency'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const cart = useCartStore()
const currency = useCurrencyStore()
const auth = useAuthStore()
const router = useRouter()

const shipping = ref({
  address: auth.profile?.address || '',
  city: auth.profile?.city || '',
  country: auth.profile?.country || 'France',
  phone: auth.profile?.phone || '',
  notes: '',
})
const loading = ref(false)
const error = ref('')

async function placeOrder() {
  if (cart.items.length === 0) return
  error.value = ''; loading.value = true
  try {
    const subtotal = cart.subtotal
    const { data: order, error: err } = await supabase.from('orders').insert({
      user_id: auth.user!.id, status: 'pending', payment_method: 'card', payment_status: 'pending',
      subtotal_eur: subtotal, total_eur: subtotal, currency: currency.currency,
      shipping_address: { ...shipping.value }, notes: shipping.value.notes,
    }).select().maybeSingle()
    if (err) throw err
    if (!order) throw new Error('Échec de création de commande')

    const items = cart.items.map(i => ({
      order_id: order.id, product_id: i.product.id, quantity: i.quantity,
      unit: i.unit, unit_price_eur: i.product.price_eur, customization: i.customization,
    }))
    const { error: ie } = await supabase.from('order_items').insert(items)
    if (ie) throw ie

    cart.clear()
    router.push({ name: 'payment', query: { order: order.id } })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  } finally { loading.value = false }
}
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-3xl font-medium text-primary-500 mb-8">Finaliser ma commande</h1>

      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl border border-wood-200 p-6">
            <h2 class="font-medium text-primary-500 mb-4">Adresse de livraison</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2"><label class="text-sm text-wood-500">Adresse</label><input v-model="shipping.address" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" placeholder="123 Rue du Bois" /></div>
              <div><label class="text-sm text-wood-500">Ville</label><input v-model="shipping.city" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" placeholder="Paris" /></div>
              <div><label class="text-sm text-wood-500">Pays</label><select v-model="shipping.country" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"><option>France</option><option>Belgique</option><option>Suisse</option><option>Luxembourg</option><option>Allemagne</option><option>Espagne</option><option>Italie</option><option>Portugal</option><option>Pays-Bas</option><option>Royaume-Uni</option></select></div>
              <div><label class="text-sm text-wood-500">Téléphone</label><input v-model="shipping.phone" type="tel" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" placeholder="+33 6 12 34 56 78" /></div>
              <div class="sm:col-span-2"><label class="text-sm text-wood-500">Notes (optionnel)</label><textarea v-model="shipping.notes" rows="2" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" placeholder="Instructions de livraison..."></textarea></div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-wood-200 p-6">
            <h2 class="font-medium text-primary-500 mb-4">Articles</h2>
            <div class="space-y-3">
              <div v-for="item in cart.items" :key="item.product.id" class="flex items-center gap-3 pb-3 border-b border-wood-100 last:border-0">
                <img :src="item.product.images[0]" :alt="item.product.name" class="w-12 h-12 rounded-md object-cover" />
                <div class="flex-1"><p class="text-sm font-medium text-primary-500">{{ item.product.name }}</p><p class="text-xs text-wood-400">{{ item.quantity }} × {{ currency.formatPrice(item.product.price_eur, item.product.price_usd, item.product.price_fcfa) }}</p></div>
                <span class="text-sm font-semibold">{{ currency.formatPrice(item.product.price_eur * item.quantity, 0, 0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-wood-200 p-6 h-fit sticky top-20">
          <h2 class="font-medium text-primary-500 mb-4">Total</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-wood-500">Sous-total</span><span class="font-medium">{{ currency.formatPrice(cart.subtotal, 0, 0) }}</span></div>
            <div class="flex justify-between"><span class="text-wood-500">Livraison</span><span class="text-wood-400">À déterminer</span></div>
          </div>
          <div class="border-t border-wood-200 mt-4 pt-4 flex justify-between">
            <span class="font-medium text-primary-500">Total</span>
            <span class="text-xl font-semibold text-primary-500">{{ currency.formatPrice(cart.subtotal, 0, 0) }}</span>
          </div>
          <div v-if="error" class="mt-4 p-3 bg-error-100 text-error-500 text-sm rounded-lg">{{ error }}</div>
          <button @click="placeOrder" :disabled="loading" class="w-full mt-6 bg-primary-500 text-wood-100 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            <span v-if="loading">Traitement...</span><span v-else class="flex items-center gap-2">Continuer vers le paiement <ArrowRight class="w-4 h-4" /></span>
          </button>
          <div class="mt-4 flex items-center gap-2 text-xs text-wood-400"><Check class="w-3.5 h-3.5 text-success-500" /> Paiement sécurisé</div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
