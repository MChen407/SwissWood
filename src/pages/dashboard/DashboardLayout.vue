<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { LayoutDashboard, Package, Heart, User, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const links = [
  { to: '/mon-compte', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/mon-compte/commandes', label: 'Mes commandes', icon: Package },
  { to: '/mon-compte/favoris', label: 'Favoris', icon: Heart },
  { to: '/mon-compte/profil', label: 'Mon profil', icon: User },
]

async function signOut() { await auth.signOut(); router.push('/') }
</script>

<template>
  <div class="min-h-screen flex flex-col bg-wood-100">
    <header class="bg-primary-500 text-wood-100 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center"><span class="font-display text-base font-semibold text-wood-100">A</span></div>
          <span class="font-display text-xl font-semibold">Arbora</span>
        </RouterLink>
        <button @click="signOut" class="flex items-center gap-2 text-sm text-wood-200 hover:text-white"><LogOut class="w-4 h-4" /> Déconnexion</button>
      </div>
    </header>

    <div class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div class="grid md:grid-cols-[240px_1fr] gap-6">
        <aside>
          <div class="bg-white rounded-xl border border-wood-200 p-4">
            <div class="px-3 py-2 mb-2">
              <p class="text-sm font-medium text-primary-500">{{ auth.fullName || 'Client' }}</p>
              <p class="text-xs text-wood-400 truncate">{{ auth.user?.email }}</p>
            </div>
            <nav class="space-y-1">
              <RouterLink v-for="link in links" :key="link.to" :to="link.to"
                :class="['flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  $route.path === link.to ? 'bg-primary-500 text-wood-100' : 'text-wood-600 hover:bg-wood-100']">
                <component :is="link.icon" class="w-4 h-4" /> {{ link.label }}
              </RouterLink>
            </nav>
          </div>
        </aside>
        <main><RouterView /></main>
      </div>
    </div>
  </div>
</template>
