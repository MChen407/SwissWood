<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, X, Save, Package, Upload } from 'lucide-vue-next'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { api, type ProductDto, type ProductEssence } from '@/lib/api'

const products = ref<ProductDto[]>([])
const loading = ref(true)
const showForm = ref(false)
const editing = ref<ProductDto | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const deleting = ref<ProductDto | null>(null)
const deletingPending = ref(false)
const deleteError = ref('')

const emptyForm = {
  name: '', slug: '', essence: 'Teck' as ProductEssence, description: '',
  price_eur: 0, price_usd: 0, price_fcfa: 0, stock: 0,
  length_mm: 4000, width_mm: 100, thickness_mm: 30, weight_kg_m3: 500,
  images: [] as string[], certification: 'FSC', class_emploi: 'Classe 3', origine: '', traitement: 'Naturel', is_active: true,
}
const form = ref({ ...emptyForm })

onMounted(load)

async function load() {
  loading.value = true
  products.value = await api.admin.listProducts()
  loading.value = false
}

function openCreate() { editing.value = null; form.value = { ...emptyForm }; uploadError.value = ''; showForm.value = true }

function openEdit(p: ProductDto) {
  editing.value = p
  form.value = {
    name: p.name, slug: p.slug, essence: p.essence, description: p.description,
    price_eur: p.price_eur, price_usd: p.price_usd, price_fcfa: p.price_fcfa, stock: p.stock,
    length_mm: p.dimensions.length_mm ?? 4000, width_mm: p.dimensions.width_mm ?? 100,
    thickness_mm: p.dimensions.thickness_mm ?? 30, weight_kg_m3: p.dimensions.weight_kg_m3 ?? 500,
    images: [...p.images],
    certification: p.characteristics.certification || 'FSC', class_emploi: p.characteristics.class_emploi || 'Classe 3',
    origine: p.characteristics.origine || '', traitement: p.characteristics.traitement || 'Naturel', is_active: p.is_active,
  }
  uploadError.value = ''
  showForm.value = true
}

async function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  if (files.length === 0) return
  uploadError.value = ''
  uploading.value = true
  try {
    const { urls } = await api.admin.uploadImages(files)
    form.value.images.push(...urls)
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : 'Échec de l\'upload des images'
  } finally {
    uploading.value = false
  }
}

function removeImage(url: string) {
  form.value.images = form.value.images.filter((u) => u !== url)
}

async function save() {
  const payload = {
    name: form.value.name, slug: form.value.slug || form.value.name.toLowerCase().replace(/\s+/g, '-'),
    essence: form.value.essence, description: form.value.description,
    price_eur: Number(form.value.price_eur), price_usd: Number(form.value.price_usd), price_fcfa: Number(form.value.price_fcfa),
    stock: Number(form.value.stock),
    dimensions: { length_mm: Number(form.value.length_mm), width_mm: Number(form.value.width_mm), thickness_mm: Number(form.value.thickness_mm), weight_kg_m3: Number(form.value.weight_kg_m3) },
    images: form.value.images,
    characteristics: { certification: form.value.certification, class_emploi: form.value.class_emploi, origine: form.value.origine, traitement: form.value.traitement },
    is_active: form.value.is_active,
  }
  if (editing.value) await api.admin.updateProduct(editing.value.id, payload)
  else await api.admin.createProduct(payload)
  showForm.value = false
  await load()
}

async function remove(id: string) {
  deletingPending.value = true
  deleteError.value = ''
  try {
    await api.admin.deleteProduct(id)
    deleting.value = null
    await load()
  } catch (err) {
    deleteError.value = err instanceof Error ? err.message : 'Échec de la suppression'
  } finally {
    deletingPending.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="font-display text-2xl font-medium text-primary-500">Gestion des produits</h1>
      <button @click="openCreate" class="bg-primary-500 text-wood-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center gap-2"><Plus class="w-4 h-4" /> Ajouter</button>
    </div>

    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">Chargement...</div>
      <div v-else-if="products.length === 0" class="p-10 text-center"><Package class="w-12 h-12 text-wood-300 mx-auto mb-2" /><p class="text-wood-400">Aucun produit</p></div>

      <!-- Mobile cards -->
      <div v-else class="sm:hidden divide-y divide-wood-100">
        <div v-for="p in products" :key="p.id" class="p-4 space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <img v-if="p.images[0]" :src="p.images[0]" :alt="p.name" class="w-10 h-10 rounded-md object-cover flex-shrink-0" />
              <span class="font-medium text-primary-500 text-sm break-words">{{ p.name }}</span>
            </div>
            <span :class="['text-xs px-2 py-1 rounded-full whitespace-nowrap', p.is_active ? 'bg-success-100 text-success-500' : 'bg-wood-100 text-wood-400']">{{ p.is_active ? 'Actif' : 'Inactif' }}</span>
          </div>
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="text-wood-500">{{ p.essence }} · {{ (p.price_eur / 100).toFixed(2) }} €</span>
            <span class="text-wood-500">Stock : {{ p.stock }}</span>
          </div>
          <div class="flex items-center justify-end gap-1 pt-1">
            <button @click="openEdit(p)" class="px-3 py-1.5 text-xs font-medium text-primary-500 border border-wood-200 rounded-lg hover:bg-wood-50 flex items-center gap-1"><Edit class="w-3.5 h-3.5" /> Modifier</button>
            <button @click="deleting = p" class="px-3 py-1.5 text-xs font-medium text-error-500 border border-wood-200 rounded-lg hover:bg-wood-50 flex items-center gap-1"><Trash2 class="w-3.5 h-3.5" /> Supprimer</button>
          </div>
        </div>
      </div>

      <!-- Desktop table -->
      <div v-else class="hidden sm:block overflow-x-auto">
        <table class="w-full text-sm">
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
              <td class="px-4 py-3 text-right"><button @click="openEdit(p)" class="p-1.5 text-wood-500 hover:text-primary-500"><Edit class="w-4 h-4" /></button><button @click="deleting = p" class="p-1.5 text-wood-500 hover:text-error-500"><Trash2 class="w-4 h-4" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>
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
          <div>
            <label class="text-sm text-wood-500">Images</label>
            <div class="mt-1 flex items-start gap-3">
              <div class="flex-1">
                <div class="flex flex-wrap gap-3">
                  <div v-for="url in form.images" :key="url" class="relative">
                    <img :src="url" alt="Image produit" class="w-20 h-20 rounded-lg object-cover border border-wood-200" />
                    <button @click="removeImage(url)" class="absolute -top-2 -right-2 bg-error-500 text-white rounded-full p-0.5 hover:bg-error-600"><X class="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div v-if="form.images.length === 0" class="text-sm text-wood-400">Aucune image</div>
                <button type="button" @click="fileInput?.click()" :disabled="uploading"
                  class="mt-2 px-3 py-2 border border-dashed border-wood-300 rounded-lg text-sm text-wood-500 hover:border-primary-500 hover:text-primary-500 flex items-center gap-2 disabled:opacity-50">
                  <Upload class="w-4 h-4" /> {{ uploading ? 'Upload en cours...' : 'Importer depuis l\'appareil' }}
                </button>
                <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple class="hidden" @change="onFilesSelected" />
                <p v-if="uploadError" class="mt-2 text-sm text-error-500">{{ uploadError }}</p>
              </div>
            </div>
          </div>
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

    <ConfirmModal
      :open="!!deleting"
      variant="danger"
      title="Supprimer ce produit ?"
      :message="deleteError || `« ${deleting?.name} » sera définitivement supprimé. Cette action est irréversible.`"
      confirm-label="Supprimer"
      :loading="deletingPending"
      @confirm="deleting && remove(deleting.id)"
      @cancel="deleting = null; deleteError = ''"
    />
  </div>
</template>
