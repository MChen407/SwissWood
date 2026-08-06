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
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200" style="border-color: #E2DCD1;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" @click="closeAll" class="flex items-center gap-3 group flex-shrink-0">
          <img src="/logo.jpg" alt="SwissWood" class="h-10 w-10 rounded-lg object-cover" />
          <span class="font-display text-xl font-semibold tracking-tight" style="color: #4A2C1A;">SwissWood</span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-8">
          <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
            class="text-sm font-medium transition-colors"
            style="color: #7A7167;"
            active-class="!text-primary-500">{{ link.label }}</RouterLink>
        </nav>

        <!-- Right controls -->
        <div class="flex items-center gap-1 sm:gap-3">
          <!-- Currency switcher -->
          <div class="hidden sm:flex items-center gap-0.5 rounded-lg p-0.5" style="background:#E8D4A8;">
            <button v-for="c in currencies" :key="c" @click="currency.setCurrency(c)"
              :class="['px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                currency.currency === c
                  ? 'text-white'
                  : 'text-primary-600 hover:text-primary-500']"
              :style="currency.currency === c ? 'background:#6B4226;' : ''">{{ c }}</button>
          </div>

          <!-- Cart -->
          <button @click="cart.toggleCart()" class="relative p-2 rounded-lg transition-colors hover:bg-wood-100" aria-label="Panier" style="color:#4A2C1A;">
            <ShoppingCart class="w-5 h-5" />
            <span v-if="cart.itemCount > 0"
              class="absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              style="background:#B23A2E;">{{ cart.itemCount }}</span>
          </button>

          <!-- User menu -->
          <div class="relative">
            <button @click="userMenuOpen = !userMenuOpen" class="p-2 rounded-lg transition-colors hover:bg-wood-100" aria-label="Mon compte" style="color:#4A2C1A;">
              <User class="w-5 h-5" />
            </button>
            <div v-if="userMenuOpen" @click="closeAll" class="fixed inset-0 z-40"></div>
            <div v-if="userMenuOpen" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50" style="border-color:#E2DCD1;">
              <template v-if="auth.isAuthenticated">
                <div class="px-4 py-2 border-b" style="border-color:#E2DCD1;">
                  <p class="text-sm font-semibold" style="color:#4A2C1A;">{{ auth.fullName || 'Mon compte' }}</p>
                  <p class="text-xs truncate" style="color:#7A7167;">{{ auth.user?.email }}</p>
                </div>
                <RouterLink to="/mon-compte" @click="closeAll" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-wood-50 transition-colors" style="color:#6B4226;"><LayoutDashboard class="w-4 h-4" /> Tableau de bord</RouterLink>
                <RouterLink v-if="auth.isAdmin" to="/admin" @click="closeAll" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-wood-50 transition-colors" style="color:#6B4226;"><ShieldCheck class="w-4 h-4" /> Administration</RouterLink>
                <button @click="handleSignOut" class="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 transition-colors" style="color:#B23A2E;"><LogOut class="w-4 h-4" /> Déconnexion</button>
              </template>
              <template v-else>
                <RouterLink to="/connexion" @click="closeAll" class="block px-4 py-2 text-sm hover:bg-wood-50 transition-colors" style="color:#6B4226;">Connexion</RouterLink>
                <RouterLink to="/inscription" @click="closeAll" class="block px-4 py-2 text-sm hover:bg-wood-50 transition-colors" style="color:#6B4226;">Créer un compte</RouterLink>
              </template>
            </div>
          </div>

          <!-- Mobile menu toggle -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg hover:bg-wood-100 transition-colors" aria-label="Menu" style="color:#4A2C1A;">
            <component :is="mobileOpen ? X : Menu" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t bg-white" style="border-color:#E2DCD1;">
      <nav class="px-4 py-4 space-y-1">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" @click="closeAll"
          class="block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-wood-50"
          style="color:#6B4226;"
          active-class="bg-wood-100 !text-primary-600">{{ link.label }}</RouterLink>
        <div class="flex items-center gap-1 pt-3">
          <button v-for="c in currencies" :key="c" @click="currency.setCurrency(c)"
            :class="['px-3 py-1.5 text-xs font-medium rounded-md transition-colors', currency.currency === c ? 'text-white' : 'text-primary-600']"
            :style="currency.currency === c ? 'background:#6B4226;' : 'background:#E8D4A8;'">{{ c }}</button>
        </div>
      </nav>
    </div>
  </header>
</template>
