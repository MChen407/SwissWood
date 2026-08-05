<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Save, Check } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const form = ref({ first_name: '', last_name: '', phone: '', address: '', city: '', country: '' })
const saved = ref(false)

onMounted(() => {
  if (auth.profile) {
    form.value = {
      first_name: auth.profile.first_name, last_name: auth.profile.last_name,
      phone: auth.profile.phone, address: auth.profile.address,
      city: auth.profile.city, country: auth.profile.country,
    }
  }
})

async function save() {
  await auth.updateProfile({ ...form.value })
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Mon profil</h1>
    <div class="bg-white rounded-xl border border-wood-200 p-6 max-w-2xl">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center"><User class="w-6 h-6 text-primary-500" /></div>
        <div><p class="font-medium text-primary-500">{{ auth.fullName || 'Client' }}</p><p class="text-sm text-wood-400">{{ auth.user?.email }}</p></div>
      </div>
      <div v-if="saved" class="flex items-center gap-2 p-3 bg-success-100 text-success-500 text-sm rounded-lg mb-4"><Check class="w-4 h-4" /> Profil mis à jour avec succès</div>
      <form @submit.prevent="save" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="text-sm text-wood-500">Prénom</label><input v-model="form.first_name" type="text" class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          <div><label class="text-sm text-wood-500">Nom</label><input v-model="form.last_name" type="text" class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
        </div>
        <div><label class="text-sm text-wood-500">Téléphone</label><input v-model="form.phone" type="tel" class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
        <div><label class="text-sm text-wood-500">Adresse</label><input v-model="form.address" type="text" class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="text-sm text-wood-500">Ville</label><input v-model="form.city" type="text" class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          <div><label class="text-sm text-wood-500">Pays</label><input v-model="form.country" type="text" class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
        </div>
        <button type="submit" class="bg-primary-500 text-wood-100 px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"><Save class="w-4 h-4" /> Enregistrer</button>
      </form>
    </div>
  </div>
</template>
