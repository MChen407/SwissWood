<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const clients = ref<{ id: string; first_name: string; last_name: string; phone: string; role: string; created_at: string }[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (data) clients.value = data as typeof clients.value
  loading.value = false
})
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Gestion des clients</h1>
    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">Chargement...</div>
      <div v-else-if="clients.length === 0" class="p-10 text-center text-wood-400">Aucun client</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-wood-100 text-wood-500 text-left">
          <tr><th class="px-4 py-3 font-medium">Nom</th><th class="px-4 py-3 font-medium">Téléphone</th><th class="px-4 py-3 font-medium">Rôle</th><th class="px-4 py-3 font-medium">Inscrit le</th></tr>
        </thead>
        <tbody class="divide-y divide-wood-100">
          <tr v-for="c in clients" :key="c.id" class="hover:bg-wood-50">
            <td class="px-4 py-3 font-medium text-primary-500">{{ c.first_name }} {{ c.last_name }}</td>
            <td class="px-4 py-3 text-wood-500">{{ c.phone || '—' }}</td>
            <td class="px-4 py-3"><span class="text-xs px-2 py-1 rounded-full capitalize" :class="{
              'bg-primary-100 text-primary-500': c.role === 'admin' || c.role === 'super_admin',
              'bg-wood-100 text-wood-500': c.role === 'customer',
            }">{{ c.role }}</span></td>
            <td class="px-4 py-3 text-wood-500">{{ new Date(c.created_at).toLocaleDateString('fr-FR') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
