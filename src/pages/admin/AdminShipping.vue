<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, Check, Plus, Trash2, Loader2 } from 'lucide-vue-next'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import { COUNTRIES } from '@/lib/countries'
import { api } from '@/lib/api'

interface Row {
  country: string
  feeEur: number
  active: boolean
  dirty: boolean
  saving: boolean
}

const rows = ref<Row[]>([])
const loading = ref(true)
const error = ref('')
const addCountry = ref('')
const savedCountry = ref<string | null>(null)

function eurToCents(eur: number): number {
  return Math.round(eur * 100)
}

function centsToEur(cents: number): number {
  return cents / 100
}

onMounted(async () => {
  try {
    const { fees } = await api.admin.listShippingFees()
    rows.value = fees.map((fee) => ({
      country: fee.country,
      feeEur: centsToEur(fee.fee_eur),
      active: fee.active,
      dirty: false,
      saving: false,
    }))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Échec du chargement'
  } finally {
    loading.value = false
  }
})

const availableCountries = COUNTRIES.filter((c) => !rows.value.some((r) => r.country === c))

function addRow() {
  if (!addCountry.value) return
  rows.value.push({ country: addCountry.value, feeEur: 0, active: true, dirty: false, saving: false })
  addCountry.value = ''
}

async function save(row: Row) {
  row.saving = true
  try {
    await api.admin.upsertShippingFee({ country: row.country, fee_eur: eurToCents(row.feeEur), active: row.active })
    row.dirty = false
    savedCountry.value = row.country
    setTimeout(() => savedCountry.value = null, 2000)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Échec de l’enregistrement'
  } finally {
    row.saving = false
  }
}

async function remove(row: Row) {
  try {
    await api.admin.deleteShippingFee(row.country)
    rows.value = rows.value.filter((r) => r.country !== row.country)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Échec de la suppression'
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="font-display text-2xl font-medium text-primary-500">Frais de livraison</h1>
      <div class="flex items-center gap-2">
        <div class="w-64">
          <SearchableSelect v-model="addCountry" :options="availableCountries.map((c) => ({ value: c, label: c }))" placeholder="Ajouter un pays…" />
        </div>
        <button @click="addRow" :disabled="!addCountry"
          class="bg-primary-500 text-wood-100 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 flex items-center gap-2 disabled:opacity-50">
          <Plus class="w-4 h-4" /> Ajouter
        </button>
      </div>
    </div>

    <p class="text-sm text-wood-500 mb-4">
      Frais appliqués au moment de la commande selon le pays de livraison. Montant en euros. Pays non configuré : livraison gratuite (0 €).
    </p>

    <div v-if="error" class="mb-4 p-3 rounded-lg text-sm bg-error-100 text-error-500">{{ error }}</div>

    <div v-if="loading" class="text-center py-10 text-wood-400">Chargement...</div>
    <div v-else-if="rows.length === 0" class="text-center py-12 bg-white rounded-xl border border-wood-200">
      <p class="text-wood-400">Aucun pays configuré. Ajoutez un pays ci-dessus.</p>
    </div>
    <div v-else class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div class="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-wood-400 border-b border-wood-200">
        <span class="col-span-4">Pays</span>
        <span class="col-span-3">Frais (€)</span>
        <span class="col-span-2 text-center">Actif</span>
        <span class="col-span-3 text-right">Actions</span>
      </div>
      <div v-for="row in rows" :key="row.country" class="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-wood-100 last:border-0">
        <span class="col-span-7 sm:col-span-4 text-sm font-medium text-primary-500">{{ row.country }}</span>
        <div class="col-span-5 sm:col-span-3">
          <input v-model.number="row.feeEur" type="number" min="0" step="0.5" @input="row.dirty = true"
            class="w-full px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
        </div>
        <div class="col-span-3 sm:col-span-2 flex sm:justify-center">
          <label class="inline-flex items-center gap-2 text-sm text-wood-500">
            <input type="checkbox" v-model="row.active" @change="row.dirty = true" class="rounded" />
            <span class="sm:hidden">Actif</span>
          </label>
        </div>
        <div class="col-span-6 sm:col-span-3 flex items-center justify-end gap-2">
          <button @click="save(row)" :disabled="row.saving || !row.dirty"
            class="p-2 bg-primary-500 text-wood-100 rounded-lg hover:bg-primary-600 disabled:opacity-40 transition-colors">
            <Loader2 v-if="row.saving" class="w-4 h-4 animate-spin" />
            <Save v-else-if="savedCountry !== row.country" class="w-4 h-4" />
            <Check v-else class="w-4 h-4" />
          </button>
          <button @click="remove(row)" class="p-2 text-wood-400 hover:text-error-500 rounded-lg hover:bg-wood-100 transition-colors" aria-label="Supprimer">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>