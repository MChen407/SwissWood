<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Mail, Lock, User, AlertCircle } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
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
  if (password.value.length < 6) { error.value = t('auth.passwordTooShort'); return }
  loading.value = true
  try {
    await auth.signUp(email.value, password.value, firstName.value, lastName.value)
    router.push('/mon-compte')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : t('auth.errorGeneric')
  } finally { loading.value = false }
}
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-16" style="background:#FAF7F2;">
      <div class="w-full max-w-md">
        <!-- Logo header -->
        <div class="text-center mb-8">
          <img src="/logo.jpg" alt="SwissWood" class="h-16 w-16 rounded-2xl object-cover mx-auto mb-4 shadow-md" />
          <h1 class="font-display text-2xl font-semibold" style="color:#4A2C1A;">{{ t('auth.createTitle') }}</h1>
          <p class="text-sm mt-1" style="color:#7A7167;">{{ t('auth.registerSubtitle') }}</p>
        </div>

        <form @submit.prevent="handleSubmit"
          class="bg-white rounded-2xl border p-8 space-y-5"
          style="border-color:#E2DCD1; box-shadow:0 4px 20px rgba(43,36,32,0.08);">

          <div v-if="error"
            class="flex items-start gap-3 p-4 rounded-lg text-sm"
            style="background:#fde8e6; color:#C0392B;">
            <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" /> {{ error }}
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('auth.firstName') }}</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#C89B5D;" />
                <input v-model="firstName" type="text" required placeholder="Jean"
                  class="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm"
                  style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                  onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('auth.lastName') }}</label>
              <input v-model="lastName" type="text" required placeholder="Dupont"
                class="w-full px-3 py-2.5 rounded-lg text-sm"
                style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('auth.email') }}</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#C89B5D;" />
              <input v-model="email" type="email" required placeholder="vous@exemple.com"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium mb-1.5" style="color:#7A7167;">{{ t('auth.password') }}</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#C89B5D;" />
              <input v-model="password" type="password" required placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
                onfocus="this.style.borderColor='#6B4226'" onblur="this.style.borderColor='#E2DCD1'" />
            </div>
            <p class="text-xs mt-1.5" style="color:#7A7167;">{{ t('auth.minChars') }}</p>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            style="background:#B23A2E; box-shadow:0 4px 12px rgba(178,58,46,0.25);"
            onmouseover="if(!this.disabled) this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
            {{ loading ? t('common.loading') : t('auth.createButton') }}
          </button>

          <p class="text-center text-sm" style="color:#7A7167;">
            {{ t('auth.hasAccount') }}
            <RouterLink to="/connexion" class="font-semibold hover:underline" style="color:#6B4226;">{{ t('auth.login') }}</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>
