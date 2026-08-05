<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, X, Save, Package } from 'lucide-vue-next'
import { supabase, type Product } from '@/lib/supabase'

const products = ref<Product[]>([])
const loading = ref(true)
const showForm = ref(false)
const editing = ref<Product | null>(null)

const emptyForm = {
  name: '', slug: '', essence: 'Teck' as Product['essence'], description: '',
  price_eur: 0, price_usd: 0, price_fcfa: 0, stock: 0,
  length_mm: 4000, width_mm: 100, thickness_mm: 30, weight_kg_m3: 500,
  images: '', certification: 'FSC', class_emploi: 'Classe 3', origine: '', traitement: 'Naturel', is_active: true,
}
const form = ref({ ...emptyForm })

onMounted(load)

async function load() {
  loading.value = true
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (data) products.value = data as Product[]
  loading.value = false
}

function openCreate() { editing.value = null; form.value = { ...emptyForm }; showForm.value = true }

function openEdit(p: Product) {
  editing.value = p
  form.value = {
    name: p.name, slug: p.slug, essence: p.essence, description: p.description,
    price_eur: p.price_eur, price_usd: p.price_usd, price_fcfa: p.price_fcfa, stock: p.stock,
    length_mm: p.dimensions.length_mm ?? 4000, width_mm: p.dimensions.width_mm ?? 100,
    thickness_mm: p.dimensions.thickness_mm ?? 30, weight_kg_m3: p.dimensions.weight_kg_m3 ?? 500,
    images: p.images.join(', '),
    certification: p.characteristics.certification || 'FSC', class_emploi: p.characteristics.class_emploi || 'Classe 3',
    origine: p.characteristics.origine || '', traitement: p.characteristics.traitement || 'Naturel', is_active: p.is_active,
  }
  showForm.value = true
}

async function save() {
  const payload = {
    name: form.value.name, slug: form.value.slug || form.value.name.toLowerCase().replace(/\s+/g, '-'),
    essence: form.value.essence, description: form.value.description,
    price_eur: Number(form.value.price_eur), price_usd: Number(form.value.price_usd), price_fcfa: Number(form.value.price_fcfa),
    stock: Number(form.value.stock),
    dimensions: { length_mm: Number(form.value.length_mm), width_mm: Number(form.value.width_mm), thickness_mm: Number(form.value.thickness_mm), weight_kg_m3: Number(form.value.weight_kg_m3) },
    images: form.value.images.split(',').map(s => s.trim()).filter(Boolean),
    characteristics: { certification: form.value.certification, class_emploi: form.value.class_emploi, origine: form.value.origine, traitement: form.value.traitement },
    is_active: form.value.is_active,
  }
  if (editing.value) await supabase.from('products').update(payload).eq('id', editing.value.id)
  else await supabase.from('products').insert(payload)
  showForm.value = false
  await load()
}

async function remove(id: string) {
  if (!confirm('Supprimer ce produit ?')) return
  await supabase.from('products').delete().eq('id', id)
  await load()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-medium text-primary-500">Gestion des produits</h1>
      <button @click="openCreate" class="bg-primary-500 text-wood-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center gap-2"><Plus class="w-4 h-4" /> Ajouter</button>
    </div>

    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">Chargement...</div>
      <div v-else-if="products.length === 0" class="p-10 text-center"><Package class="w-12 h-12 text-wood-300 mx-auto mb-2" /><p class="text-wood-400">Aucun produit</p></div>
      <table v-else class="w-full text-sm">
        <thead class="bg-wood-100 text-wood-500 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Produit</th><th class="px-4 py-3 font-medium">Essence</th>
            <th class="px-4 py-3 font-medium">Prix</th><th class="px-4 py-3 font-medium">Stock</th>
            <th class="px-4 py-3 font-medium">Statut</th><th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-wood-100">
          <tr v-for="p in products" :key="p.id" class="hover:bg-wood-50">
            <td class="px-4 py-3"><div class="flex items-center gap-3"><img v-if="p.images[0]" :src="p.images[0]" :alt="p.name" class="w-10 h-10 rounded-md object-cover" /><span class="font-medium text-primary-500">{{ p.name }}</span></div></td>
            <td class="px-4 py-3 text-wood-500">{{ p.essence }}</td>
            <td class="px-4 py-3 text-wood-500">{{ (p.price_eur / 100).toFixed(2) }} €</td>
            <td class="px-4 py-3 text-wood-500">{{ p.stock }}</td>
            <td class="px-4 py-3"><span :class="['text-xs px-2 py-1 rounded-full', p.is_active ? 'bg-success-100 text-success-500' : 'bg-wood-100 text-wood-400']">{{ p.is_active ? 'Actif' : 'Inactif' }}</span></td>
            <td class="px-4 py-3 text-right"><button @click="openEdit(p)" class="p-1.5 text-wood-500 hover:text-primary-500"><Edit class="w-4 h-4" /></button><button @click="remove(p.id)" class="p-1.5 text-wood-500 hover:text-error-500"><Trash2 class="w-4 h-4" /></button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" @click.self="showForm = false">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-5 border-b border-wood-200">
          <h2 class="font-medium text-primary-500">{{ editing ? 'Modifier' : 'Nouveau' }} produit</h2>
          <button @click="showForm = false" class="text-wood-300 hover:text-primary-500"><X class="w-5 h-5" /></button>
        </div>
        <div class="p-5 space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="text-sm text-wood-500">Nom</label><input v-model="form.name" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Slug</label><input v-model="form.slug" type="text" placeholder="auto-généré" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Essence</label><select v-model="form.essence" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm"><option>Teck</option><option>Iroko</option><option>Pin</option><option>Sapin</option></select></div>
            <div><label class="text-sm text-wood-500">Stock</label><input v-model.number="form.stock" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          </div>
          <div><label class="text-sm text-wood-500">Description</label><textarea v-model="form.description" rows="3" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"></textarea></div>
          <div class="grid sm:grid-cols-3 gap-4">
            <div><label class="text-sm text-wood-500">Prix EUR (centimes)</label><input v-model.number="form.price_eur" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Prix USD (centimes)</label><input v-model.number="form.price_usd" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Prix FCFA (centimes)</label><input v-model.number="form.price_fcfa" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          </div>
          <div class="grid sm:grid-cols-4 gap-4">
            <div><label class="text-sm text-wood-500">Longueur (mm)</label><input v-model.number="form.length_mm" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Largeur (mm)</label><input v-model.number="form.width_mm" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Épaisseur (mm)</label><input v-model.number="form.thickness_mm" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Densité (kg/m³)</label><input v-model.number="form.weight_kg_m3" type="number" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          </div>
          <div><label class="text-sm text-wood-500">Images (URLs séparées par virgules)</label><input v-model="form.images" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          <div class="grid sm:grid-cols-4 gap-4">
            <div><label class="text-sm text-wood-500">Certification</label><input v-model="form.certification" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Classe d'emploi</label><input v-model="form.class_emploi" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Origine</label><input v-model="form.origine" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Traitement</label><input v-model="form.traitement" type="text" class="w-full mt-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          </div>
          <label class="flex items-center gap-2 text-sm text-wood-500"><input v-model="form.is_active" type="checkbox" class="rounded" /> Produit actif</label>
        </div>
        <div class="flex justify-end gap-3 p-5 border-t border-wood-200">
          <button @click="showForm = false" class="px-4 py-2 text-sm text-wood-500 hover:text-primary-500">Annuler</button>
          <button @click="save" class="px-4 py-2 bg-primary-500 text-wood-100 rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center gap-2"><Save class="w-4 h-4" /> Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
</template>
