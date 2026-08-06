<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Shield, Leaf, Award, Heart, Check, ArrowRight, TreePine, Flame } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const values = [
  { icon: Shield, title: 'Qualité certifiée', text: 'Tous nos bois sont certifiés FSC ou PEFC, garantissant une gestion durable des forêts.' },
  { icon: Leaf, title: 'Durabilité', text: 'Nous sélectionnons des essences respectueuses de l\'environnement, durables et résistantes.' },
  { icon: Award, title: 'Excellence', text: 'Plus de 20 ans d\'expertise dans la sélection et la distribution de bois de chauffage premium.' },
  { icon: Heart, title: 'Service client', text: 'Une équipe dédiée pour conseiller et accompagner chaque foyer dans son projet.' },
]

const stats = [
  { value: '20+', label: 'Années d\'expérience' },
  { value: '10 000+', label: 'Clients satisfaits' },
  { value: '15K', label: 'Stères livrés / an' },
  { value: '98%', label: 'Taux de satisfaction' },
]
</script>

<template>
  <DefaultLayout>

    <!-- HERO — Forestry-inspired full-bleed with overlay -->
    <section class="relative min-h-[520px] flex items-end overflow-hidden">
      <img
        src="/wood2.webp"
        alt="Bois SwissWood"
        class="absolute inset-0 w-full h-full object-cover"
        style="object-position: center 40%;"
      />
      <!-- Dark gradient overlay -->
      <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(74,44,26,0.92) 0%, rgba(74,44,26,0.55) 60%, rgba(74,44,26,0.2) 100%);"></div>

      <!-- Content -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32 w-full">
        <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-5 px-3 py-1.5 rounded-full" style="background:rgba(200,155,93,0.2); color:#C89B5D;">
          <TreePine class="w-3.5 h-3.5" /> À propos de SwissWood
        </span>
        <h1 class="font-display font-semibold text-white leading-tight max-w-3xl" style="font-size:clamp(2.2rem,5vw,3.8rem);">
          Pratiques responsables<br />et chaleur authentique
        </h1>
        <p class="mt-5 max-w-xl text-base leading-relaxed" style="color:#E8D4A8;">
          Wood production est une industrie qui se situe à l'intersection de nombreux aspects de la société, de l'économie et de l'environnement. Depuis 2003, SwissWood en fait son métier.
        </p>
        <RouterLink to="/contact"
          class="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg font-semibold text-white border transition-colors"
          style="border-color:rgba(232,212,168,0.5);"
          onmouseover="this.style.background='rgba(232,212,168,0.1)'" onmouseout="this.style.background='transparent'">
          Nous contacter <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </section>

    <!-- "More about our work" — double image + text (Forestry layout) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid md:grid-cols-2 gap-14 items-center">
        <!-- Double stacked images -->
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
            <img src="/wood1.jpg" alt="Bois de chauffage" class="w-full h-full object-cover" />
          </div>
          <div class="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg mt-8">
            <img src="/wood3.webp" alt="Coupe de bois" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Text -->
        <div>
          <p class="text-sm font-semibold uppercase tracking-widest mb-3" style="color:#C89B5D;">Notre travail</p>
          <h2 class="font-display text-3xl font-semibold mb-6" style="color:#4A2C1A;">PLUS SUR NOTRE SAVOIR-FAIRE</h2>
          <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
            La production de bois de chauffage est une industrie fondamentale qui englobe la récolte, la transformation et la distribution du bois à diverses fins. Elle constitue un pilier dans de nombreux secteurs, notamment la construction, la fabrication de meubles et la production d'énergie renouvelable.
          </p>
          <p class="leading-relaxed mb-8" style="color:#7A7167; font-size:15px;">
            SwissWood sélectionne ses essences avec soin, favorisant les forêts gérées durablement et les circuits courts européens. Chaque livraison est un engagement qualité signé SwissWood.
          </p>
          <ul class="space-y-3 mb-8">
            <li v-for="item in ['Bois sec à moins de 20% d\'humidité', 'Traçabilité de l\'origine garantie', 'Livraison calendée et ponctuelle', 'Certifications FSC & PEFC']" :key="item"
              class="flex items-center gap-3 text-sm" style="color:#4A2C1A;">
              <span class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style="background:#6B4226;">
                <Check class="w-3 h-3 text-white" />
              </span>
              {{ item }}
            </li>
          </ul>
          <RouterLink to="/catalogue"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all"
            style="background:#6B4226;"
            onmouseover="this.style.background='#4A2C1A'" onmouseout="this.style.background='#6B4226'">
            Voir notre catalogue <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats counter row — Forestry style -->
    <section class="py-16 border-y" style="border-color:#E2DCD1;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="s in stats" :key="s.value">
            <p class="font-display font-semibold mb-2" style="font-size:clamp(2rem,4vw,3rem); color:#4A2C1A;">{{ s.value }}</p>
            <p class="text-sm" style="color:#7A7167;">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values grid -->
    <section class="py-20" style="background:#FAF7F2;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-sm font-semibold uppercase tracking-widest mb-3" style="color:#C89B5D;">Ce qui nous guide</p>
          <h2 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">Nos valeurs</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="v in values" :key="v.title"
            class="bg-white rounded-2xl p-7 transition-all hover:-translate-y-1"
            style="border:1px solid #E2DCD1; box-shadow:0 2px 8px rgba(43,36,32,0.05);">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style="background:#E8D4A8;">
              <component :is="v.icon" class="w-6 h-6" style="color:#6B4226;" />
            </div>
            <h3 class="font-semibold mb-2" style="color:#4A2C1A;">{{ v.title }}</h3>
            <p class="text-sm leading-relaxed" style="color:#7A7167;">{{ v.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Full-width dark CTA section — Forestry "Timber Tapestry" style -->
    <section class="relative overflow-hidden min-h-[420px] flex items-center">
      <img src="/wood4.jpg" alt="Bois de chauffage" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0" style="background:linear-gradient(90deg, rgba(74,44,26,0.93) 0%, rgba(74,44,26,0.75) 60%, rgba(74,44,26,0.4) 100%);"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full" style="background:rgba(200,155,93,0.2); color:#C89B5D;">
            <Flame class="w-3.5 h-3.5" /> Notre engagement
          </span>
          <h2 class="font-display font-semibold text-white leading-tight mb-6" style="font-size:clamp(1.8rem,4vw,3rem);">
            UNE EXPLORATION COMPLÈTE DES PRATIQUES RESPONSABLES DU BOIS SUISSE
          </h2>
          <RouterLink to="/catalogue"
            class="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white border transition-all"
            style="border-color:rgba(232,212,168,0.6);"
            onmouseover="this.style.background='rgba(232,212,168,0.15)'" onmouseout="this.style.background='transparent'">
            Consulter notre sélection <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Timeline / history -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-14">
        <p class="text-sm font-semibold uppercase tracking-widest mb-3" style="color:#C89B5D;">Notre parcours</p>
        <h2 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">Histoire de SwissWood</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div v-for="item in [
          { year: '2003', title: 'Fondation', text: 'Création à Genève, spécialisé dans le bois de chauffage local et les essences alpines.' },
          { year: '2008', title: 'Expansion européenne', text: 'Extension de la distribution en Europe et mise en place de partenariats certifiés FSC/PEFC.' },
          { year: '2015', title: 'Gamme fourneaux', text: 'Lancement de la gamme poêles à bois haute efficacité et collaboration avec des artisans locaux.' },
          { year: '2024', title: 'E-commerce', text: 'Lancement de la boutique en ligne, 10 000+ clients satisfaits et livraison dans 15 pays.' },
        ]" :key="item.year"
          class="flex gap-5 p-6 rounded-2xl bg-white" style="border:1px solid #E2DCD1; box-shadow:0 2px 8px rgba(43,36,32,0.04);">
          <div class="flex-shrink-0">
            <span class="inline-block text-xs font-bold px-3 py-1.5 rounded-lg" style="background:#E8D4A8; color:#6B4226;">{{ item.year }}</span>
          </div>
          <div>
            <h3 class="font-semibold mb-1" style="color:#4A2C1A;">{{ item.title }}</h3>
            <p class="text-sm leading-relaxed" style="color:#7A7167;">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications strip -->
    <section class="py-14" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-display text-xl font-semibold text-white mb-8">Certifications & engagements</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <div v-for="cert in ['FSC Certifié', 'PEFC Certifié', 'ISO 9001', 'Livraison CO₂ neutre', 'Bois sec < 20%']" :key="cert"
            class="flex items-center gap-2 px-5 py-3 rounded-xl"
            style="background:rgba(200,155,93,0.12); border:1px solid rgba(200,155,93,0.3);">
            <Check class="w-4 h-4" style="color:#C89B5D;" />
            <span class="text-sm font-medium" style="color:#E8D4A8;">{{ cert }}</span>
          </div>
        </div>
      </div>
    </section>

  </DefaultLayout>
</template>
