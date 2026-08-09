<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api, type AdminPaymentDto } from '@/lib/api'

const payments = ref<AdminPaymentDto[]>([])
const loading = ref(true)

onMounted(async () => {
  payments.value = await api.admin.payments()
  loading.value = false
})
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Gestion des paiements</h1>
    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">Chargement...</div>
      <div v-else-if="payments.length === 0" class="p-10 text-center text-wood-400">Aucune transaction</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-wood-100 text-wood-500 text-left">
          <tr><th class="px-4 py-3 font-medium">Référence</th><th class="px-4 py-3 font-medium">Commande</th><th class="px-4 py-3 font-medium">Méthode</th><th class="px-4 py-3 font-medium">Montant</th><th class="px-4 py-3 font-medium">Statut</th><th class="px-4 py-3 font-medium">Date</th></tr>
        </thead>
        <tbody class="divide-y divide-wood-100">
          <tr v-for="p in payments" :key="p.id" class="hover:bg-wood-50">
            <td class="px-4 py-3 font-medium text-primary-500">{{ p.reference || '—' }}</td>
            <td class="px-4 py-3 text-wood-500">{{ p.order_number || '—' }}</td>
            <td class="px-4 py-3 text-wood-500">{{ p.method === 'card' ? 'Carte' : 'Virement' }}</td>
            <td class="px-4 py-3 font-medium">{{ (p.amount_eur / 100).toFixed(2) }} €</td>
            <td class="px-4 py-3"><span class="text-xs px-2 py-1 rounded-full capitalize" :class="{
              'bg-success-100 text-success-500': p.status === 'completed',
              'bg-warning-100 text-warning-500': p.status === 'pending' || p.status === 'processing',
              'bg-error-100 text-error-500': p.status === 'failed',
            }">{{ p.status }}</span></td>
            <td class="px-4 py-3 text-wood-500">{{ new Date(p.created_at).toLocaleDateString('fr-FR') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
