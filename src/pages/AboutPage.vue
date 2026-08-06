<script setup lang="ts">
import { Shield, Leaf, Award, Flame, Heart, Check } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const values = [
  { icon: Shield, title: 'Qualité certifiée', text: 'Tous nos bois sont certifiés FSC ou PEFC, garantissant une gestion durable des forêts.' },
  { icon: Leaf, title: 'Durabilité', text: 'Nous sélectionnons des essences respectueuses de l\'environnement, durables et résistantes.' },
  { icon: Award, title: 'Excellence', text: 'Plus de 20 ans d\'expertise dans la sélection et la distribution de bois de chauffage premium.' },
  { icon: Heart, title: 'Service client', text: 'Une équipe dédiée pour conseiller et accompagner chaque client dans son projet.' },
]

const timeline = [
  { year: '2003', event: 'Création de SwissWood à Genève, spécialisé dans le bois de chauffage local.' },
  { year: '2008', event: 'Extension à la distribution en Europe et partenariats certifiés FSC/PEFC.' },
  { year: '2015', event: 'Lancement de la gamme fourneaux et poêles à bois haute efficacité.' },
  { year: '2024', event: 'Plus de 10 000 clients satisfaits et livraison dans 15 pays européens.' },
]
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="py-16 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm mb-5" style="background:rgba(200,155,93,0.2); color:#C89B5D;">
            <Flame class="w-4 h-4" /> À propos de SwissWood
          </span>
          <h1 class="font-display text-4xl font-semibold text-white">Notre engagement qualité</h1>
          <p class="mt-4 leading-relaxed" style="color:#E8D4A8;">
            Depuis plus de 20 ans, SwissWood fournit du bois de chauffage certifié et des fourneaux premium aux familles et professionnels exigeants à travers l'Europe.
          </p>
        </div>
      </div>
    </section>

    <!-- Story -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid md:grid-cols-2 gap-14 items-center">
        <div class="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
          <img src="https://images.pexels.com/photos/12278589/pexels-photo-12278589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Stock de bois SwissWood" class="w-full h-full object-cover" />
        </div>
        <div>
          <p class="text-sm font-medium uppercase tracking-widest mb-3" style="color:#C89B5D;">Notre histoire</p>
          <h2 class="font-display text-3xl font-semibold mb-5" style="color:#4A2C1A;">Née de la passion du bois</h2>
          <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
            Fondée en 2003 à Genève, SwissWood est née de la conviction qu'il est possible de chauffer durablement sans compromis sur la qualité. Nous sourçons nos essences auprès de partenaires certifiés en Europe, en veillant toujours au respect des écosystèmes forestiers.
          </p>
          <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
            Aujourd'hui, SwissWood est une référence européenne dans la distribution de bois de chauffage premium et de fourneaux, servant des milliers de foyers chaque hiver.
          </p>

          <!-- Timeline -->
          <div class="mt-8 space-y-4">
            <div v-for="item in timeline" :key="item.year" class="flex gap-4 items-start">
              <span class="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded" style="background:#E8D4A8; color:#6B4226;">{{ item.year }}</span>
              <p class="text-sm leading-relaxed" style="color:#7A7167;">{{ item.event }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16" style="background:#E8D4A8;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-sm font-medium uppercase tracking-widest mb-2" style="color:#6B4226;">Ce qui nous guide</p>
          <h2 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">Nos valeurs</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="v in values" :key="v.title"
            class="bg-white rounded-xl p-6 text-center transition-all hover:-translate-y-1"
            style="border:1px solid #E2DCD1; box-shadow:0 2px 8px rgba(43,36,32,0.06);">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style="background:#E8D4A8;">
              <component :is="v.icon" class="w-6 h-6" style="color:#6B4226;" />
            </div>
            <h3 class="font-semibold mb-2" style="color:#4A2C1A;">{{ v.title }}</h3>
            <p class="text-sm leading-relaxed" style="color:#7A7167;">{{ v.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div v-for="(s, i) in [
          { value: '20+', label: 'Années d\'expérience' },
          { value: '10k+', label: 'Clients satisfaits' },
          { value: '15+', label: 'Pays desservis' },
          { value: '98%', label: 'Taux de satisfaction' }
        ]" :key="i"
          class="p-6 rounded-xl" style="background:#FAF7F2; border:1px solid #E2DCD1;">
          <p class="font-display text-4xl font-semibold" style="color:#4A2C1A;">{{ s.value }}</p>
          <p class="text-sm mt-2" style="color:#7A7167;">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section class="py-14" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-display text-2xl font-semibold text-white mb-8">Nos certifications & engagements</h2>
        <div class="flex flex-wrap justify-center gap-6">
          <div v-for="cert in ['FSC Certifié', 'PEFC Certifié', 'ISO 9001', 'Livraison CO₂ neutre']" :key="cert"
            class="flex items-center gap-2 px-5 py-3 rounded-xl" style="background:rgba(200,155,93,0.15); border:1px solid rgba(200,155,93,0.3);">
            <Check class="w-4 h-4" style="color:#C89B5D;" />
            <span class="text-sm font-medium" style="color:#E8D4A8;">{{ cert }}</span>
          </div>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>
