<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api, type AdminPaymentDto } from '@/lib/api'
import { useLocaleStore } from '@/stores/locale'

const { t } = useI18n()
const localeStore = useLocaleStore()
const payments = ref<AdminPaymentDto[]>([])
const loading = ref(true)

onMounted(async () => {
  payments.value = await api.admin.payments()
  loading.value = false
})

function methodLabel(method: string) {
  return method === 'card' ? t('admin.cardMethod') : t('admin.transferMethod')
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">{{ t('admin.paymentsTitle') }}</h1>
    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">{{ t('common.loading') }}</div>
      <div v-else-if="payments.length === 0" class="p-10 text-center text-wood-400">{{ t('admin.noTransactions') }}</div>

      <div v-else>
        <!-- Mobile cards -->
        <div class="sm:hidden divide-y divide-wood-100">
          <div v-for="p in payments" :key="p.id" class="p-4 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-primary-500 text-sm break-all">{{ p.reference || '—' }}</p>
              <span class="text-xs px-2 py-1 rounded-full whitespace-nowrap" :class="{
                'bg-success-100 text-success-500': p.status === 'completed',
                'bg-warning-100 text-warning-500': p.status === 'pending' || p.status === 'processing',
                'bg-error-100 text-error-500': p.status === 'failed',
              }">{{ p.status }}</span>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <span class="text-wood-500">{{ p.order_number || '—' }} · {{ methodLabel(p.method) }}</span>
              <span class="font-semibold text-primary-500">{{ (p.amount_eur / 100).toFixed(2) }} €</span>
            </div>
            <p class="text-xs text-wood-400">{{ new Date(p.created_at).toLocaleDateString(localeStore.locale) }}</p>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-wood-100 text-wood-500 text-left">
              <tr><th class="px-4 py-3 font-medium">{{ t('admin.reference') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.order') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.method') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.amount') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.status') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.date') }}</th></tr>
            </thead>
            <tbody class="divide-y divide-wood-100">
              <tr v-for="p in payments" :key="p.id" class="hover:bg-wood-50">
                <td class="px-4 py-3 font-medium text-primary-500">{{ p.reference || '—' }}</td>
                <td class="px-4 py-3 text-wood-500">{{ p.order_number || '—' }}</td>
                <td class="px-4 py-3 text-wood-500">{{ methodLabel(p.method) }}</td>
                <td class="px-4 py-3 font-medium">{{ (p.amount_eur / 100).toFixed(2) }} €</td>
                <td class="px-4 py-3"><span class="text-xs px-2 py-1 rounded-full" :class="{
                  'bg-success-100 text-success-500': p.status === 'completed',
                  'bg-warning-100 text-warning-500': p.status === 'pending' || p.status === 'processing',
                  'bg-error-100 text-error-500': p.status === 'failed',
                }">{{ p.status }}</span></td>
                <td class="px-4 py-3 text-wood-500">{{ new Date(p.created_at).toLocaleDateString(localeStore.locale) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
