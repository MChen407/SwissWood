<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { LayoutDashboard, Package, Users, CreditCard, Star, FileText, LogOut, ShieldCheck } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/commandes', label: 'Commandes', icon: FileText },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/paiements', label: 'Paiements', icon: CreditCard },
  { to: '/admin/avis', label: 'Avis', icon: Star },
  { to: '/admin/contenu', label: 'Contenu CMS', icon: FileText },
]

async function signOut() { await auth.signOut(); router.push('/') }
</script>

<template>
  <div class="min-h-screen flex bg-wood-100">
    <aside class="w-64 bg-primary-500 text-wood-100 flex-shrink-0 hidden md:flex flex-col fixed h-full">
      <div class="p-5 border-b border-primary-700">
        <RouterLink to="/" class="flex items-center gap-2">
          <img src="/logo.jpg" alt="SwissWood" class="w-9 h-9 rounded-lg object-cover" />
          <div><span class="font-display text-lg font-semibold block">SwissWood</span><span class="text-xs text-wood-300 flex items-center gap-1"><ShieldCheck class="w-3 h-3" /> Admin</span></div>
        </RouterLink>
      </div>
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to"
          :class="['flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
            $route.path === link.to ? 'bg-wood-100/10 text-white' : 'text-wood-200 hover:bg-wood-100/5']">
          <component :is="link.icon" class="w-4 h-4" /> {{ link.label }}
        </RouterLink>
      </nav>
      <div class="p-3 border-t border-primary-700">
        <button @click="signOut" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-wood-200 hover:bg-wood-100/5"><LogOut class="w-4 h-4" /> Déconnexion</button>
      </div>
    </aside>

    <div class="flex-1 md:ml-64">
      <header class="bg-white border-b border-wood-200 h-16 flex items-center px-4 sm:px-6 sticky top-0 z-20">
        <div class="md:hidden flex items-center gap-2 mr-4"><img src="/logo.jpg" alt="SwissWood" class="w-7 h-7 rounded-lg object-cover" /><span class="font-display text-lg font-semibold text-primary-500">Admin</span></div>
        <p class="text-sm text-wood-500">{{ auth.fullName }}</p>
      </header>
      <main class="p-4 sm:p-6 lg:p-8"><RouterView /></main>
    </div>
  </div>
</template>
