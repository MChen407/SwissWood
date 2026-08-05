<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { CheckCircle, Mail, Download, ArrowRight } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { supabase, type Order, type OrderItem } from '@/lib/supabase'
import { useCurrencyStore } from '@/stores/currency'

const route = useRoute()
const currency = useCurrencyStore()
const order = ref<Order | null>(null)
const items = ref<OrderItem[]>([])
const loading = ref(true)
const isTransfer = route.query.method === 'transfer'

onMounted(async () => {
  const orderId = route.query.order as string
  if (!orderId) return
  const { data: od } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle()
  if (od) order.value = od as Order
  const { data: it } = await supabase.from('order_items').select('*').eq('order_id', orderId)
  if (it) items.value = it as OrderItem[]
  loading.value = false
})
</script>

<template>
  <DefaultLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="text-center py-20"><p class="text-wood-400">Chargement...</p></div>

      <div v-else-if="order" class="text-center">
        <div class="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6"><CheckCircle class="w-10 h-10 text-success-500" /></div>
        <h1 class="font-display text-3xl font-medium text-primary-500">{{ isTransfer ? 'Commande en attente de réception des fonds' : 'Paiement confirmé !' }}</h1>
        <p class="text-wood-500 mt-3">{{ isTransfer ? 'Votre commande a été enregistrée. Elle sera validée dès réception de votre virement.' : 'Votre transaction a réussi. Votre commande est maintenant confirmée.' }}</p>

        <div class="bg-white rounded-xl border border-wood-200 p-6 mt-8 text-left">
          <div class="flex items-center justify-between mb-4">
            <div><p class="text-xs text-wood-400">Numéro de commande</p><p class="font-medium text-primary-500">{{ order.order_number }}</p></div>
            <div class="text-right"><p class="text-xs text-wood-400">Statut</p><p class="font-medium" :class="isTransfer ? 'text-warning-500' : 'text-success-500'">{{ isTransfer ? 'En attente' : 'Confirmée' }}</p></div>
          </div>
          <div class="border-t border-wood-100 pt-4 space-y-2">
            <div v-for="item in items" :key="item.id" class="flex justify-between text-sm">
              <span class="text-wood-500">{{ item.quantity }} × {{ (item.unit_price_eur / 100).toFixed(2) }} €</span>
              <span class="font-medium">{{ ((item.quantity as number) * item.unit_price_eur / 100).toFixed(2) }} €</span>
            </div>
          </div>
          <div class="border-t border-wood-200 mt-4 pt-4 flex justify-between">
            <span class="font-medium text-primary-500">Total</span>
            <span class="text-xl font-semibold text-primary-500">{{ currency.formatPrice(order.total_eur, 0, 0) }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-6">
          <div class="flex items-center justify-center gap-2 text-sm text-wood-500 bg-wood-100 rounded-lg p-3"><Mail class="w-4 h-4" /> Une confirmation a été envoyée par e-mail</div>
          <button class="flex items-center justify-center gap-2 text-sm text-primary-500 border border-wood-200 rounded-lg p-3 hover:bg-wood-100 transition-colors"><Download class="w-4 h-4" /> Télécharger la facture</button>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/mon-compte/commandes" class="text-primary-500 hover:underline text-sm">Voir mes commandes</RouterLink>
          <RouterLink to="/catalogue" class="inline-flex items-center gap-1 text-primary-500 hover:underline text-sm">Continuer mes achats <ArrowRight class="w-4 h-4" /></RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
