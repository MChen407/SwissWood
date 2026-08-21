<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, Package, Users, CreditCard, Star, FileText, LogOut, ShieldCheck, Menu, X, Truck } from 'lucide-vue-next'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const showLogoutModal = ref(false)
const signOutPending = ref(false)
const mobileOpen = ref(false)

const links = [
  { to: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard },
  { to: '/admin/produits', labelKey: 'admin.products', icon: Package },
  { to: '/admin/commandes', labelKey: 'admin.orders', icon: FileText },
  { to: '/admin/clients', labelKey: 'admin.clients', icon: Users },
  { to: '/admin/paiements', labelKey: 'admin.payments', icon: CreditCard },
  { to: '/admin/avis', labelKey: 'admin.reviews', icon: Star },
  { to: '/admin/contenu', labelKey: 'admin.cms', icon: FileText },
  { to: '/admin/livraison', labelKey: 'admin.shipping', icon: Truck },
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
  <div class="min-h-screen flex bg-wood-100">
    <aside class="w-64 bg-primary-500 text-wood-100 flex-shrink-0 hidden md:flex flex-col fixed h-full">
      <div class="p-5 border-b border-primary-700">
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/logo.jpg" alt="SwissWood" class="w-9 h-9 rounded-lg object-cover" />
          <div><span class="font-display text-lg font-semibold block">SwissWood</span><span class="text-xs text-wood-300 flex items-center gap-1"><ShieldCheck class="w-3 h-3" /> {{ t('admin.admin') }}</span></div>
        </RouterLink>
      </div>
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to"
          :class="['flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
            $route.path === link.to ? 'bg-wood-100/10 text-white' : 'text-wood-200 hover:bg-wood-100/5']">
          <component :is="link.icon" class="w-4 h-4" /> {{ t(link.labelKey) }}
        </RouterLink>
      </nav>
      <div class="p-3 border-t border-primary-700">
        <button @click="showLogoutModal = true" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-wood-200 hover:bg-wood-100/5"><LogOut class="w-4 h-4" /> {{ t('nav.logout') }}</button>
      </div>
    </aside>

    <div class="flex-1 md:ml-64">
      <header class="bg-white border-b border-wood-200 h-16 flex items-center px-4 sm:px-6 sticky top-0 z-20">
        <div class="md:hidden flex items-center gap-2 mr-4"><img src="/logo.jpg" alt="SwissWood" class="w-7 h-7 rounded-lg object-cover" /><span class="font-display text-lg font-semibold text-primary-500">{{ t('admin.admin') }}</span></div>
        <div class="flex-1"></div>
        <p class="text-sm text-wood-500 hidden sm:block mr-3">{{ auth.fullName }}</p>
        <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg hover:bg-wood-100 text-primary-500" :aria-label="t('nav.menu')">
          <component :is="mobileOpen ? X : Menu" class="w-5 h-5" />
        </button>
      </header>

      <!-- Mobile nav -->
      <div v-if="mobileOpen" class="md:hidden bg-primary-500 text-wood-100">
        <nav class="p-3 space-y-1">
          <RouterLink v-for="link in links" :key="link.to" :to="link.to" @click="mobileOpen = false"
            :class="['flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors',
              $route.path === link.to ? 'bg-wood-100/10 text-white' : 'text-wood-200 hover:bg-wood-100/5']">
            <component :is="link.icon" class="w-4 h-4" /> {{ t(link.labelKey) }}
          </RouterLink>
          <button @click="showLogoutModal = true" class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-wood-200 hover:bg-wood-100/5"><LogOut class="w-4 h-4" /> {{ t('nav.logout') }}</button>
        </nav>
      </div>

      <main class="p-4 sm:p-6 lg:p-8"><RouterView /></main>
    </div>
  </div>

  <ConfirmModal
    :open="showLogoutModal"
    variant="danger"
    :title="t('auth.logoutTitle')"
    :message="t('auth.adminSignOutMessage')"
    :confirm-label="t('auth.logoutConfirm')"
    :loading="signOutPending"
    @confirm="signOut"
    @cancel="showLogoutModal = false"
  />
</template>
