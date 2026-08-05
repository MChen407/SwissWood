<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Check, X, Star } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

type Review = { id: string; rating: number; comment: string; is_approved: boolean; is_rejected: boolean; created_at: string; products?: { name: string } }

const reviews = ref<Review[]>([])
const loading = ref(true)
const filter = ref<'pending' | 'approved' | 'all'>('pending')

onMounted(load)

async function load() {
  loading.value = true
  let q = supabase.from('product_reviews').select('*, products(name)').order('created_at', { ascending: false })
  if (filter.value === 'pending') q = q.eq('is_approved', false).eq('is_rejected', false)
  else if (filter.value === 'approved') q = q.eq('is_approved', true)
  const { data } = await q
  if (data) reviews.value = data as Review[]
  loading.value = false
}

async function approve(id: string) { await supabase.from('product_reviews').update({ is_approved: true, is_rejected: false }).eq('id', id); await load() }
async function reject(id: string) { await supabase.from('product_reviews').update({ is_rejected: true, is_approved: false }).eq('id', id); await load() }
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Modération des avis</h1>
    <div class="flex gap-2 mb-4">
      <button @click="filter = 'pending'; load()" :class="['px-4 py-2 rounded-lg text-sm font-medium', filter === 'pending' ? 'bg-primary-500 text-wood-100' : 'bg-white text-wood-500 border border-wood-200']">En attente</button>
      <button @click="filter = 'approved'; load()" :class="['px-4 py-2 rounded-lg text-sm font-medium', filter === 'approved' ? 'bg-primary-500 text-wood-100' : 'bg-white text-wood-500 border border-wood-200']">Approuvés</button>
      <button @click="filter = 'all'; load()" :class="['px-4 py-2 rounded-lg text-sm font-medium', filter === 'all' ? 'bg-primary-500 text-wood-100' : 'bg-white text-wood-500 border border-wood-200']">Tous</button>
    </div>
    <div v-if="loading" class="text-center py-10 text-wood-400">Chargement...</div>
    <div v-else-if="reviews.length === 0" class="bg-white rounded-xl border border-wood-200 p-10 text-center text-wood-400">Aucun avis</div>
    <div v-else class="space-y-3">
      <div v-for="r in reviews" :key="r.id" class="bg-white rounded-xl border border-wood-200 p-5">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1"><Star v-for="n in 5" :key="n" class="w-4 h-4" :class="n <= r.rating ? 'text-wood-400 fill-wood-400' : 'text-wood-200'" /><span class="text-xs text-wood-400">{{ r.products?.name || 'Produit' }}</span></div>
            <p class="text-sm text-wood-600">{{ r.comment }}</p>
            <p class="text-xs text-wood-300 mt-2">{{ new Date(r.created_at).toLocaleDateString('fr-FR') }}</p>
          </div>
          <div v-if="!r.is_approved && !r.is_rejected" class="flex gap-2">
            <button @click="approve(r.id)" class="p-2 bg-success-100 text-success-500 rounded-lg hover:bg-success-500 hover:text-white transition-colors"><Check class="w-4 h-4" /></button>
            <button @click="reject(r.id)" class="p-2 bg-error-100 text-error-500 rounded-lg hover:bg-error-500 hover:text-white transition-colors"><X class="w-4 h-4" /></button>
          </div>
          <span v-else :class="['text-xs px-2 py-1 rounded-full', r.is_approved ? 'bg-success-100 text-success-500' : 'bg-error-100 text-error-500']">{{ r.is_approved ? 'Approuvé' : 'Rejeté' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
