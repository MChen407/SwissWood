<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Mail, Lock, User, AlertCircle } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  if (password.value.length < 6) { error.value = 'Le mot de passe doit contenir au moins 6 caractères'; return }
  loading.value = true
  try {
    await auth.signUp(email.value, password.value, firstName.value, lastName.value)
    router.push('/mon-compte')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  } finally { loading.value = false }
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-xl bg-primary-500 flex items-center justify-center mx-auto mb-4"><span class="font-display text-2xl font-semibold text-wood-100">A</span></div>
          <h1 class="font-display text-2xl font-medium text-primary-500">Créer un compte</h1>
          <p class="text-wood-500 text-sm mt-1">Rejoignez Arbora en quelques secondes</p>
        </div>
        <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-wood-200 p-6 space-y-4">
          <div v-if="error" class="flex items-center gap-2 p-3 bg-error-100 text-error-500 text-sm rounded-lg"><AlertCircle class="w-4 h-4 flex-shrink-0" /> {{ error }}</div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="text-sm text-wood-500">Prénom</label><div class="relative mt-1"><User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wood-300" /><input v-model="firstName" type="text" required placeholder="Jean" class="w-full pl-10 pr-4 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div></div>
            <div><label class="text-sm text-wood-500">Nom</label><input v-model="lastName" type="text" required placeholder="Dupont" class="w-full mt-1 px-4 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
          </div>
          <div><label class="text-sm text-wood-500">E-mail</label><div class="relative mt-1"><Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wood-300" /><input v-model="email" type="email" required placeholder="vous@exemple.com" class="w-full pl-10 pr-4 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div></div>
          <div><label class="text-sm text-wood-500">Mot de passe</label><div class="relative mt-1"><Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wood-300" /><input v-model="password" type="password" required placeholder="••••••••" class="w-full pl-10 pr-4 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div></div>
          <button type="submit" :disabled="loading" class="w-full bg-primary-500 text-wood-100 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50">{{ loading ? 'Création...' : 'Créer mon compte' }}</button>
          <p class="text-center text-sm text-wood-500">Déjà un compte ? <RouterLink to="/connexion" class="text-primary-500 hover:underline">Se connecter</RouterLink></p>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>
