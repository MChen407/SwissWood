<script setup lang="ts">
import { Shield, Leaf, Award, TreePine, TrendingUp, Heart } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const values = [
  { icon: Shield, title: 'Qualité certifiée', text: 'Tous nos bois sont certifiés FSC ou PEFC, garantissant une gestion durable des forêts.' },
  { icon: Leaf, title: 'Durabilité', text: 'Nous sélectionnons des essences respectueuses de l\'environnement, durables et résistantes.' },
  { icon: Award, title: 'Excellence', text: 'Plus de 20 ans d\'expertise dans la sélection et la distribution de bois de construction.' },
  { icon: Heart, title: 'Service client', text: 'Une équipe dédiée pour conseiller et accompagner chaque client dans son projet.' },
]
</script>

<template>
  <DefaultLayout>
    <section class="bg-primary-500 text-wood-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-wood-100/10 rounded-full text-sm text-wood-200 mb-4"><TreePine class="w-4 h-4" /> À propos d'Arbora</span>
          <h1 class="font-display text-4xl font-medium">Notre engagement qualité</h1>
          <p class="mt-4 text-wood-200 leading-relaxed">Depuis plus de 20 ans, Arbora fournit des bois de construction certifiés aux professionnels du bâtiment, menuisiers, architectes et particuliers exigeants à travers l'Europe.</p>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="relative rounded-2xl overflow-hidden aspect-[4/3]"><img src="https://images.pexels.com/photos/12278589/pexels-photo-12278589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Stock de bois" class="w-full h-full object-cover" /></div>
        <div>
          <h2 class="font-display text-2xl font-medium text-primary-500 mb-4">Notre histoire</h2>
          <p class="text-wood-600 leading-relaxed">Fondée en 2003, Arbora est née de la passion du bois et de la conviction qu'il est possible de construire durablement sans compromis sur la qualité. Nous sourçons nos essences auprès de partenaires certifiés en Europe, en Afrique et en Asie, en veillant toujours au respect des écosystèmes forestiers.</p>
          <p class="text-wood-600 leading-relaxed mt-4">Aujourd'hui, Arbora est une référence européenne dans la distribution de bois de construction premium, servant des milliers de clients professionnels et particuliers.</p>
        </div>
      </div>
    </section>

    <section class="bg-wood-200 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-display text-2xl font-medium text-primary-500 text-center mb-10">Nos valeurs</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="v in values" :key="v.title" class="bg-white rounded-xl p-6 text-center">
            <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-4"><component :is="v.icon" class="w-6 h-6 text-primary-500" /></div>
            <h3 class="font-medium text-primary-500">{{ v.title }}</h3>
            <p class="text-sm text-wood-500 mt-2 leading-relaxed">{{ v.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div><p class="font-display text-4xl font-medium text-primary-500">20+</p><p class="text-sm text-wood-500 mt-1">Années d'expérience</p></div>
        <div><p class="font-display text-4xl font-medium text-primary-500">10k+</p><p class="text-sm text-wood-500 mt-1">Clients satisfaits</p></div>
        <div><p class="font-display text-4xl font-medium text-primary-500">30+</p><p class="text-sm text-wood-500 mt-1">Pays desservis</p></div>
        <div><p class="font-display text-4xl font-medium text-primary-500 flex items-center justify-center gap-1"><TrendingUp class="w-8 h-8" /> 98%</p><p class="text-sm text-wood-500 mt-1">Taux de satisfaction</p></div>
      </div>
    </section>
  </DefaultLayout>
</template>
