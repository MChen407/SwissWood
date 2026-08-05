<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useCurrencyStore } from '@/stores/currency'
import { navLinks } from '@/types/index'

const cart = useCartStore()
const auth = useAuthStore()
const currency = useCurrencyStore()
const mobileOpen = ref(false)
const userMenuOpen = ref(false)

function closeAll() { mobileOpen.value = false; userMenuOpen.value = false }
async function handleSignOut() { await auth.signOut(); closeAll() }

const currencies = ['EUR', 'USD', 'FCFA'] as const
</script>

<template>
  <header class="sticky top-0 z-40 bg-wood-100/90 backdrop-blur-md border-b border-wood-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <RouterLink to="/" @click="closeAll" class="flex items-center gap-2 group">
          <div class="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center"><span class="font-display text-lg font-semibold text-wood-100">A</span></div>
          <span class="font-display text-2xl font-semibold text-primary-500 tracking-tight">Arbora</span>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-8">
          <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="text-sm font-medium text-wood-600 hover:text-primary-500 transition-colors"
            active-class="text-primary-500">{{ link.label }}</RouterLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-4">
          <div class="hidden sm:flex items-center gap-1 bg-wood-200 rounded-lg p-0.5">
            <button v-for="c in currencies" :key="c" @click="currency.setCurrency(c)"
              :class="['px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                currency.currency === c ? 'bg-primary-500 text-wood-100' : 'text-wood-600 hover:text-primary-500']">{{ c }}</button>
          </div>

          <button @click="cart.toggleCart()" class="relative p-2 text-wood-600 hover:text-primary-500 transition-colors" aria-label="Panier">
            <ShoppingCart class="w-5 h-5" />
            <span v-if="cart.itemCount > 0"
              class="absolute -top-1 -right-1 bg-cta-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{{ cart.itemCount }}</span>
          </button>

          <div class="relative">
            <button @click="userMenuOpen = !userMenuOpen" class="p-2 text-wood-600 hover:text-primary-500 transition-colors" aria-label="Mon compte">
              <User class="w-5 h-5" />
            </button>
            <div v-if="userMenuOpen" @click="closeAll" class="fixed inset-0 z-40"></div>
            <div v-if="userMenuOpen" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-wood-200 py-2 z-50">
              <template v-if="auth.isAuthenticated">
                <div class="px-4 py-2 border-b border-wood-100">
                  <p class="text-sm font-medium text-primary-500">{{ auth.fullName || 'Mon compte' }}</p>
                  <p class="text-xs text-wood-500 truncate">{{ auth.user?.email }}</p>
                </div>
                <RouterLink to="/mon-compte" @click="closeAll" class="flex items-center gap-2 px-4 py-2 text-sm text-wood-600 hover:bg-wood-100"><LayoutDashboard class="w-4 h-4" /> Tableau de bord</RouterLink>
                <RouterLink v-if="auth.isAdmin" to="/admin" @click="closeAll" class="flex items-center gap-2 px-4 py-2 text-sm text-wood-600 hover:bg-wood-100"><ShieldCheck class="w-4 h-4" /> Administration</RouterLink>
                <button @click="handleSignOut" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-500 hover:bg-error-100"><LogOut class="w-4 h-4" /> Déconnexion</button>
              </template>
              <template v-else>
                <RouterLink to="/connexion" @click="closeAll" class="block px-4 py-2 text-sm text-wood-600 hover:bg-wood-100">Connexion</RouterLink>
                <RouterLink to="/inscription" @click="closeAll" class="block px-4 py-2 text-sm text-wood-600 hover:bg-wood-100">Créer un compte</RouterLink>
              </template>
            </div>
          </div>

          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 text-wood-600" aria-label="Menu">
            <component :is="mobileOpen ? X : Menu" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="mobileOpen" class="md:hidden border-t border-wood-200 bg-wood-100">
      <nav class="px-4 py-3 space-y-1">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" @click="closeAll"
          class="block py-2 text-sm font-medium text-wood-600 hover:text-primary-500" active-class="text-primary-500">{{ link.label }}</RouterLink>
        <div class="flex items-center gap-1 pt-2">
          <button v-for="c in currencies" :key="c" @click="currency.setCurrency(c)"
            :class="['px-3 py-1.5 text-xs font-medium rounded-md', currency.currency === c ? 'bg-primary-500 text-wood-100' : 'bg-wood-200 text-wood-600']">{{ c }}</button>
        </div>
      </nav>
    </div>
  </header>
</template>
