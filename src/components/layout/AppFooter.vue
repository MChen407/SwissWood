<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Mail, Phone, MapPin, Shield, Leaf, Truck } from 'lucide-vue-next'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-primary-500 text-wood-100 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 rounded-lg bg-wood-100/10 flex items-center justify-center"><span class="font-display text-lg font-semibold text-wood-100">A</span></div>
            <span class="font-display text-2xl font-semibold">Arbora</span>
          </div>
          <p class="text-sm text-wood-200 leading-relaxed">Votre spécialiste européen du bois de construction premium. Des essences durables, certifiées et résistantes.</p>
          <div class="flex flex-col gap-2 mt-4">
            <span class="flex items-center gap-2 text-xs text-wood-200"><Shield class="w-4 h-4" /> Paiement sécurisé</span>
            <span class="flex items-center gap-2 text-xs text-wood-200"><Leaf class="w-4 h-4" /> Bois certifiés FSC/PEFC</span>
            <span class="flex items-center gap-2 text-xs text-wood-200"><Truck class="w-4 h-4" /> Livraison Europe</span>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-wood-300 mb-4">Navigation</h3>
          <ul class="space-y-2">
            <li><RouterLink to="/" class="text-sm text-wood-200 hover:text-white transition-colors">Accueil</RouterLink></li>
            <li><RouterLink to="/catalogue" class="text-sm text-wood-200 hover:text-white transition-colors">Catalogue</RouterLink></li>
            <li><RouterLink to="/a-propos" class="text-sm text-wood-200 hover:text-white transition-colors">À propos</RouterLink></li>
            <li><RouterLink to="/contact" class="text-sm text-wood-200 hover:text-white transition-colors">Contact</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-wood-300 mb-4">Essences</h3>
          <ul class="space-y-2">
            <li><RouterLink to="/catalogue?essence=Teck" class="text-sm text-wood-200 hover:text-white transition-colors">Teck</RouterLink></li>
            <li><RouterLink to="/catalogue?essence=Iroko" class="text-sm text-wood-200 hover:text-white transition-colors">Iroko</RouterLink></li>
            <li><RouterLink to="/catalogue?essence=Pin" class="text-sm text-wood-200 hover:text-white transition-colors">Pin</RouterLink></li>
            <li><RouterLink to="/catalogue?essence=Sapin" class="text-sm text-wood-200 hover:text-white transition-colors">Sapin</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-wood-300 mb-4">Contact</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-2 text-sm text-wood-200"><Mail class="w-4 h-4 mt-0.5" /> contact@arbora.eu</li>
            <li class="flex items-start gap-2 text-sm text-wood-200"><Phone class="w-4 h-4 mt-0.5" /> +33 1 23 45 67 89</li>
            <li class="flex items-start gap-2 text-sm text-wood-200"><MapPin class="w-4 h-4 mt-0.5" /> 42 Rue du Bois, 75008 Paris, France</li>
          </ul>
        </div>
      </div>

      <div class="border-t border-primary-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-wood-300">© {{ year }} Arbora. Tous droits réservés.</p>
        <div class="flex items-center gap-4">
          <RouterLink to="/" class="text-xs text-wood-300 hover:text-white transition-colors">Mentions légales</RouterLink>
          <RouterLink to="/" class="text-xs text-wood-300 hover:text-white transition-colors">Confidentialité</RouterLink>
          <RouterLink to="/" class="text-xs text-wood-300 hover:text-white transition-colors">CGV</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
