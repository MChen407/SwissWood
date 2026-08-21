<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { CheckCircle, Mail, Download, ArrowRight } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { api, type OrderDetailDto } from '@/lib/api'
import { useCurrencyStore } from '@/stores/currency'

const { t } = useI18n()
const route = useRoute()
const currency = useCurrencyStore()
const order = ref<OrderDetailDto | null>(null)
const loading = ref(true)
const isTransfer = route.query.method === 'transfer'

const orderTotals = computed(() => {
  const o = order.value
  if (!o) return { eur: 0, usd: 0, fcfa: 0 }
  const usd = o.items.reduce((s, i) => s + (i.unit_price_usd ?? 0) * Number(i.quantity), 0)
  const fcfa = o.items.reduce((s, i) => s + (i.unit_price_fcfa ?? 0) * Number(i.quantity), 0)
  return { eur: o.total_eur, usd, fcfa }
})

onMounted(async () => {
  const orderId = route.query.order as string
  if (!orderId) { loading.value = false; return }
  try {
    order.value = await api.orders.getMine(orderId)
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="loading" class="text-center py-20"><p class="text-wood-400">{{ t('common.loading') }}</p></div>

      <div v-else-if="order" class="text-center">
        <div class="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6"><CheckCircle class="w-10 h-10 text-success-500" /></div>
        <h1 class="font-display text-3xl font-medium text-primary-500">{{ isTransfer ? t('confirmation.pendingTitle') : t('confirmation.paymentConfirmed') }}</h1>
        <p class="text-wood-500 mt-3">{{ isTransfer ? t('confirmation.pendingText') : t('confirmation.confirmedText') }}</p>

        <div class="bg-white rounded-xl border border-wood-200 p-6 mt-8 text-left">
          <div class="flex items-center justify-between mb-4">
            <div><p class="text-xs text-wood-400">{{ t('confirmation.orderNumber') }}</p><p class="font-medium text-primary-500">{{ order.order_number }}</p></div>
            <div class="text-right"><p class="text-xs text-wood-400">{{ t('confirmation.status') }}</p><p class="font-medium" :class="isTransfer ? 'text-warning-500' : 'text-success-500'">{{ isTransfer ? t('confirmation.pending') : t('confirmation.confirmed') }}</p></div>
          </div>
          <div class="border-t border-wood-100 pt-4 space-y-2">
            <div v-for="item in order.items" :key="item.id" class="flex justify-between text-sm">
              <span class="text-wood-500">{{ item.quantity }} × {{ currency.formatPriceWithFallback(item.unit_price_eur, item.unit_price_usd ?? 0, item.unit_price_fcfa ?? 0) }}</span>
              <span class="font-medium">{{ currency.formatPriceWithFallback(item.unit_price_eur * Number(item.quantity), (item.unit_price_usd ?? 0) * Number(item.quantity), (item.unit_price_fcfa ?? 0) * Number(item.quantity)) }}</span>
            </div>
          </div>
          <div class="border-t border-wood-200 mt-4 pt-4 flex justify-between">
            <span class="font-medium text-primary-500">{{ t('confirmation.total') }}</span>
            <span class="text-xl font-semibold text-primary-500">{{ currency.formatPriceWithFallback(orderTotals.eur, orderTotals.usd, orderTotals.fcfa) }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-6">
          <div class="flex items-center justify-center gap-2 text-sm text-wood-500 bg-wood-100 rounded-lg p-3"><Mail class="w-4 h-4" /> {{ t('confirmation.emailSent') }}</div>
          <button class="flex items-center justify-center gap-2 text-sm text-primary-500 border border-wood-200 rounded-lg p-3 hover:bg-wood-100 transition-colors"><Download class="w-4 h-4" /> {{ t('confirmation.downloadInvoice') }}</button>
        </div>

        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/mon-compte/commandes" class="text-primary-500 hover:underline text-sm">{{ t('confirmation.viewOrders') }}</RouterLink>
          <RouterLink to="/catalogue" class="inline-flex items-center gap-1 text-primary-500 hover:underline text-sm">{{ t('confirmation.continueShopping') }} <ArrowRight class="w-4 h-4" /></RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
