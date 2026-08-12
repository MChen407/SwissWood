<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Mail, Phone, MapPin, Shield, Leaf, Truck } from 'lucide-vue-next'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-20 text-white" style="background:#4A2C1A;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-5">
            <img src="/logo.jpg" alt="SwissWood" class="h-11 w-11 rounded-lg object-cover" />
            <span class="font-display text-2xl font-semibold text-white">SwissWood</span>
          </div>
          <p class="text-sm leading-relaxed" style="color:#E8D4A8;">Votre spécialiste suisse du bois de chauffage premium et des fourneaux. Chaleur, qualité et fiabilité pour votre foyer.</p>
          <div class="flex flex-col gap-2.5 mt-5">
            <span class="flex items-center gap-2 text-xs" style="color:#C89B5D;"><Shield class="w-4 h-4" /> Paiement sécurisé</span>
            <span class="flex items-center gap-2 text-xs" style="color:#C89B5D;"><Leaf class="w-4 h-4" /> Bois certifiés FSC/PEFC</span>
            <span class="flex items-center gap-2 text-xs" style="color:#C89B5D;"><Truck class="w-4 h-4" /> Livraison en Europe</span>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-widest mb-5" style="color:#C89B5D;">Navigation</h3>
          <ul class="space-y-2.5">
            <li><RouterLink to="/" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">Accueil</RouterLink></li>
            <li><RouterLink to="/catalogue" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">Catalogue</RouterLink></li>
            <li><RouterLink to="/a-propos" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">À propos</RouterLink></li>
            <li><RouterLink to="/contact" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">Contact</RouterLink></li>
          </ul>
        </div>

        <!-- Essences -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-widest mb-5" style="color:#C89B5D;">Essences</h3>
          <ul class="space-y-2.5">
            <li><RouterLink to="/catalogue?essence=Teck" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">Teck</RouterLink></li>
            <li><RouterLink to="/catalogue?essence=Iroko" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">Iroko</RouterLink></li>
            <li><RouterLink to="/catalogue?essence=Pin" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">Pin</RouterLink></li>
            <li><RouterLink to="/catalogue?essence=Sapin" class="text-sm transition-colors hover:text-white" style="color:#E8D4A8;">Sapin</RouterLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-xs font-semibold uppercase tracking-widest mb-5" style="color:#C89B5D;">Contact</h3>
          <ul class="space-y-3">
            <li class="flex items-start gap-2 text-sm" style="color:#E8D4A8;"><Mail class="w-4 h-4 mt-0.5 flex-shrink-0" style="color:#C89B5D;" /> contact@swisswood.ch</li>
            <li class="flex items-start gap-2 text-sm" style="color:#E8D4A8;"><Phone class="w-4 h-4 mt-0.5 flex-shrink-0" style="color:#C89B5D;" /> +41 22 123 45 67</li>
            <li class="flex items-start gap-2 text-sm" style="color:#E8D4A8;"><MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" style="color:#C89B5D;" /> Rue du Bois 12, 1201 Genève, Suisse</li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style="border-top: 1px solid #6B4226;">
        <p class="text-xs" style="color:#C89B5D;">© {{ year }} SwissWood. Tous droits réservés.</p>
        <div class="flex items-center gap-6">
          <RouterLink to="/mentions-legales" class="text-xs transition-colors hover:text-white" style="color:#C89B5D;">Mentions légales</RouterLink>
          <RouterLink to="/confidentialite" class="text-xs transition-colors hover:text-white" style="color:#C89B5D;">Confidentialité</RouterLink>
          <RouterLink to="/" class="text-xs transition-colors hover:text-white" style="color:#C89B5D;">CGV</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
