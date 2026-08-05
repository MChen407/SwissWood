<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Phone, MapPin, Send, Check, Building2 } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const form = ref({ name: '', email: '', subject: '', message: '' })
const sent = ref(false)

function handleSubmit() {
  sent.value = true
  form.value = { name: '', email: '', subject: '', message: '' }
  setTimeout(() => sent.value = false, 5000)
}

const contacts = [
  { icon: Mail, label: 'E-mail', value: 'contact@arbora.eu' },
  { icon: Phone, label: 'Téléphone', value: '+33 1 23 45 67 89' },
  { icon: MapPin, label: 'Adresse', value: '42 Rue du Bois, 75008 Paris, France' },
]
</script>

<template>
  <DefaultLayout>
    <section class="bg-primary-500 text-wood-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-medium">Contactez-nous</h1>
        <p class="mt-3 text-wood-200">Notre équipe est à votre disposition pour vous conseiller.</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-3 gap-8">
        <div class="space-y-4">
          <div v-for="c in contacts" :key="c.label" class="bg-white rounded-xl border border-wood-200 p-5">
            <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3"><component :is="c.icon" class="w-5 h-5 text-primary-500" /></div>
            <p class="text-xs text-wood-400 uppercase tracking-wider">{{ c.label }}</p>
            <p class="text-sm font-medium text-primary-500 mt-1">{{ c.value }}</p>
          </div>
          <div class="bg-white rounded-xl border border-wood-200 p-5">
            <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mb-3"><Building2 class="w-5 h-5 text-primary-500" /></div>
            <p class="text-xs text-wood-400 uppercase tracking-wider">Horaires</p>
            <p class="text-sm text-wood-600 mt-1">Lun - Ven: 8h - 18h</p>
            <p class="text-sm text-wood-600">Sam: 9h - 12h</p>
          </div>
        </div>

        <div class="md:col-span-2">
          <form @submit.prevent="handleSubmit" class="bg-white rounded-xl border border-wood-200 p-6 space-y-4">
            <h2 class="font-display text-xl font-medium text-primary-500">Envoyer un message</h2>
            <div v-if="sent" class="flex items-center gap-2 p-3 bg-success-100 text-success-500 text-sm rounded-lg"><Check class="w-4 h-4" /> Votre message a bien été envoyé. Nous vous répondrons sous 24h.</div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div><label class="text-sm text-wood-500">Nom complet</label><input v-model="form.name" type="text" required class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
              <div><label class="text-sm text-wood-500">E-mail</label><input v-model="form.email" type="email" required class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            </div>
            <div><label class="text-sm text-wood-500">Sujet</label><input v-model="form.subject" type="text" required class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" /></div>
            <div><label class="text-sm text-wood-500">Message</label><textarea v-model="form.message" rows="5" required class="w-full mt-1 px-3 py-2.5 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"></textarea></div>
            <button type="submit" class="bg-primary-500 text-wood-100 px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"><Send class="w-4 h-4" /> Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
