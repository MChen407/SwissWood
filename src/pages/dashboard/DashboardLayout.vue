<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, Package, Heart, User, LogOut } from 'lucide-vue-next'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const showLogoutModal = ref(false)
const signOutPending = ref(false)

const links = [
  { to: '/mon-compte', labelKey: 'dashboardTitle', icon: LayoutDashboard },
  { to: '/mon-compte/commandes', labelKey: 'orders', icon: Package },
  { to: '/mon-compte/favoris', labelKey: 'favorites', icon: Heart },
  { to: '/mon-compte/profil', labelKey: 'profile', icon: User },
]

async function signOut() {
  signOutPending.value = true
  await auth.signOut()
  signOutPending.value = false
  showLogoutModal.value = false
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-wood-100">
    <header class="bg-primary-500 text-wood-100 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/logo.jpg" alt="SwissWood" class="w-9 h-9 rounded-lg object-cover" />
          <span class="font-display text-xl font-semibold">SwissWood</span>
        </RouterLink>
        <button @click="showLogoutModal = true" class="flex items-center gap-2 text-sm text-wood-200 hover:text-white"><LogOut class="w-4 h-4" /> {{ t('dashboard.logout') }}</button>
      </div>
    </header>

    <div class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div class="grid md:grid-cols-[240px_1fr] gap-6">
        <aside>
          <div class="bg-white rounded-xl border border-wood-200 p-4">
            <div class="px-3 py-2 mb-2">
              <p class="text-sm font-medium text-primary-500">{{ auth.fullName || t('dashboard.client') }}</p>
              <p class="text-xs text-wood-400 truncate">{{ auth.user?.email }}</p>
            </div>
            <nav class="space-y-1">
              <RouterLink v-for="link in links" :key="link.to" :to="link.to"
                :class="['flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  $route.path === link.to ? 'bg-primary-500 text-wood-100' : 'text-wood-600 hover:bg-wood-100']">
                <component :is="link.icon" class="w-4 h-4" /> {{ t(`dashboard.${link.labelKey}`) }}
              </RouterLink>
            </nav>
          </div>
        </aside>
        <main><RouterView /></main>
      </div>
    </div>
  </div>

  <ConfirmModal
    :open="showLogoutModal"
    variant="danger"
    :title="t('auth.logoutTitle')"
    :message="t('auth.logoutMessage')"
    :confirm-label="t('auth.logoutConfirm')"
    :loading="signOutPending"
    @confirm="signOut"
    @cancel="showLogoutModal = false"
  />
</template>
