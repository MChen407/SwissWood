<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, Check } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

const contents = ref<{ id: string; key: string; value: string; label: string }[]>([])
const loading = ref(true)
const savedKey = ref<string | null>(null)

onMounted(async () => {
  const { data } = await supabase.from('cms_content').select('*').order('key')
  if (data) contents.value = data as typeof contents.value
  loading.value = false
})

async function save(item: { id: string; key: string; value: string }) {
  await supabase.from('cms_content').update({ value: item.value, updated_at: new Date().toISOString() }).eq('id', item.id)
  savedKey.value = item.key
  setTimeout(() => savedKey.value = null, 2000)
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Gestion du contenu</h1>
    <div v-if="loading" class="text-center py-10 text-wood-400">Chargement...</div>
    <div v-else class="space-y-4">
      <div v-for="item in contents" :key="item.id" class="bg-white rounded-xl border border-wood-200 p-5">
        <label class="text-sm font-medium text-primary-500">{{ item.label }}</label>
        <p class="text-xs text-wood-300 mb-2">Clé: {{ item.key }}</p>
        <div class="flex gap-2">
          <textarea v-model="item.value" rows="2" class="flex-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"></textarea>
          <button @click="save(item)" class="self-start p-2.5 bg-primary-500 text-wood-100 rounded-lg hover:bg-primary-600 transition-colors"><Save v-if="savedKey !== item.key" class="w-4 h-4" /><Check v-else class="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  </div>
</template>
