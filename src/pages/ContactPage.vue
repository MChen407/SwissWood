<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail, Phone, MapPin, Send, Check, Clock } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { t } = useI18n()
const form = ref({ name: '', email: '', subject: '', message: '' })
const sent = ref(false)

function handleSubmit() {
  sent.value = true
  form.value = { name: '', email: '', subject: '', message: '' }
  setTimeout(() => sent.value = false, 5000)
}

const contacts = [
  { icon: Mail, label: t('contact.email'), value: 'contact@swisswood.ch' },
  { icon: Phone, label: t('contact.phone'), value: '+41 22 123 45 67' },
  { icon: MapPin, label: t('contact.address'), value: 'Rue du Bois 12, 1201 Genève, Suisse' },
  { icon: Clock, label: t('contact.hours'), value: t('contact.hoursValue') },
]
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="py-14 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-semibold">{{ t('contact.title') }}</h1>
        <p class="mt-3" style="color:#E8D4A8;">{{ t('contact.subtitle') }}</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid md:grid-cols-3 gap-8">

        <!-- Contact info -->
        <div class="space-y-4">
          <div v-for="c in contacts" :key="c.label"
            class="bg-white rounded-xl border p-5 transition-all hover:-translate-y-0.5"
            style="border-color:#E2DCD1; box-shadow:0 2px 8px rgba(43,36,32,0.05);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style="background:#E8D4A8;">
              <component :is="c.icon" class="w-5 h-5" style="color:#6B4226;" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-widest mb-1" style="color:#C89B5D;">{{ c.label }}</p>
            <p class="text-sm font-medium" style="color:#4A2C1A;">{{ c.value }}</p>
          </div>
        </div>

        <!-- Form -->
        <div class="md:col-span-2">
          <form @submit.prevent="handleSubmit"
            class="bg-white rounded-xl border p-8 space-y-5"
            style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
            <h2 class="font-display text-xl font-semibold" style="color:#4A2C1A;">{{ t('contact.sendTitle') }}</h2>

            <div v-if="sent"
              class="flex items-center gap-3 p-4 rounded-lg text-sm"
              style="background:#d4f0e0; color:#4E7A51;">
              <Check class="w-4 h-4 flex-shrink-0" />
              {{ t('contact.sentMessage') }}
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('contact.name') }} *</label>
                <input v-model="form.name" type="text" required placeholder="Jean Dupont"
                  class="w-full px-3 py-2.5 rounded-lg text-sm"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('contact.email') }} *</label>
                <input v-model="form.email" type="email" required placeholder="vous@exemple.com"
                  class="w-full px-3 py-2.5 rounded-lg text-sm"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('contact.subject') }} *</label>
              <input v-model="form.subject" type="text" required :placeholder="t('contact.subjectPlaceholder')"
                class="w-full px-3 py-2.5 rounded-lg text-sm"
                style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('contact.message') }} *</label>
              <textarea v-model="form.message" rows="5" required :placeholder="t('contact.messagePlaceholder')"
                class="w-full px-3 py-2.5 rounded-lg text-sm resize-none"
                style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'"></textarea>
            </div>

            <button type="submit"
              class="inline-flex items-center gap-2 text-white px-7 py-3 rounded-lg font-semibold transition-all"
              style="background:#B23A2E; box-shadow:0 4px 12px rgba(178,58,46,0.25);"
              onmouseover="this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
              <Send class="w-4 h-4" /> {{ t('contact.send') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>