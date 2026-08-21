<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Mail, Lock, AlertCircle } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showErrorModal = ref(false)

async function handleSubmit() {
  error.value = ''; loading.value = true
  try {
    await auth.signIn(email.value, password.value)
    router.push((route.query.redirect as string) || '/mon-compte')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : t('auth.invalidCredentials')
    showErrorModal.value = true
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
          <h1 class="font-display text-2xl font-semibold" style="color:#4A2C1A;">{{ t('auth.login') }}</h1>
          <p class="text-sm mt-1" style="color:#7A7167;">{{ t('auth.loginSubtitle') }}</p>
        </div>

        <form @submit.prevent="handleSubmit"
          class="bg-white rounded-2xl border p-8 space-y-5"
          style="border-color:#E2DCD1; box-shadow:0 4px 20px rgba(43,36,32,0.08);">

          <div v-if="error"
            class="flex items-start gap-3 p-4 rounded-lg text-sm"
            style="background:#fde8e6; color:#C0392B;">
            <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" /> {{ error }}
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
          </div>

          <button type="submit" :disabled="loading"
            class="w-full text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            style="background:#B23A2E; box-shadow:0 4px 12px rgba(178,58,46,0.25);"
            onmouseover="if(!this.disabled) this.style.background='#8F2E24'" onmouseout="this.style.background='#B23A2E'">
            {{ loading ? t('common.loading') : t('auth.login') }}
          </button>

          <p class="text-center text-sm" style="color:#7A7167;">
            {{ t('auth.noAccount') }}
            <RouterLink to="/inscription" class="font-semibold hover:underline" style="color:#6B4226;">{{ t('auth.register') }}</RouterLink>
          </p>
        </form>
      </div>
    </div>

    <ConfirmModal
      :open="showErrorModal"
      variant="danger"
      confirm-only
      :confirm-label="t('common.close')"
      :title="t('auth.loginFailed')"
      :message="error || t('auth.loginFailedHint')"
      @confirm="showErrorModal = false"
    />
  </DefaultLayout>
</template>
