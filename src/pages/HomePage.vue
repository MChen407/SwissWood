<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, Shield, Leaf, Award, Truck, TreePine, Star, TrendingUp } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { supabase, type Product } from '@/lib/supabase'

const products = ref<Product[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('products').select('*').eq('is_active', true).order('price_eur', { ascending: false })
  if (data) products.value = data as Product[]
  loading.value = false
})

const trustItems = [
  { icon: Shield, title: 'Qualité certifiée', text: 'Bois certifiés FSC et PEFC' },
  { icon: Leaf, title: 'Durabilité', text: 'Essences respectueuses de l\'environnement' },
  { icon: Award, title: 'Excellence', text: '20 ans d\'expertise au service de vos projets' },
  { icon: Truck, title: 'Livraison Europe', text: 'Expédition dans toute l\'Europe' },
]
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="relative bg-primary-500 text-wood-100 overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <img src="https://images.pexels.com/photos/12278586/pexels-photo-12278586.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" class="w-full h-full object-cover" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-500/80 to-transparent"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-wood-100/10 rounded-full text-sm text-wood-200 mb-6">
            <TreePine class="w-4 h-4" /> Spécialiste bois de construction
          </span>
          <h1 class="font-display text-4xl md:text-6xl font-medium leading-tight tracking-tight">Des bois de construction d'excellence</h1>
          <p class="mt-6 text-lg text-wood-200 leading-relaxed max-w-xl">Arbora sélectionne et livre les essences les plus résistantes pour vos projets professionnels et personnels à travers l'Europe.</p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <RouterLink to="/catalogue" class="inline-flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">Découvrir le catalogue <ArrowRight class="w-4 h-4" /></RouterLink>
            <RouterLink to="/a-propos" class="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border border-wood-300 text-wood-100 hover:bg-wood-100/10 transition-colors">Notre savoir-faire</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust badges -->
    <section class="bg-white border-b border-wood-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="item in trustItems" :key="item.title" class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-wood-100 flex items-center justify-center flex-shrink-0">
              <component :is="item.icon" class="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-primary-500">{{ item.title }}</h3>
              <p class="text-xs text-wood-500 mt-0.5">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="font-display text-3xl font-medium text-primary-500">Nos essences</h2>
          <p class="text-wood-500 mt-2">Une sélection rigoureuse pour chaque usage</p>
        </div>
        <RouterLink to="/catalogue" class="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-wood-600 transition-colors">Voir tout <ArrowRight class="w-4 h-4" /></RouterLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="bg-white rounded-xl border border-wood-200 overflow-hidden animate-pulse">
          <div class="aspect-[4/3] bg-wood-200"></div>
          <div class="p-4 space-y-2"><div class="h-5 bg-wood-200 rounded w-3/4"></div><div class="h-4 bg-wood-200 rounded"></div><div class="h-4 bg-wood-200 rounded w-1/2"></div></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- Values -->
    <section class="bg-wood-200 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-display text-3xl font-medium text-primary-500 mb-4">Pourquoi choisir Arbora ?</h2>
            <p class="text-wood-600 leading-relaxed">Depuis plus de 20 ans, Arbora accompagne les professionnels du bâtiment, menuisiers, architectes et particuliers exigeants. Nous sourçons nos bois auprès de fournisseurs certifiés, garantissant des essences durables, résistantes et de qualité professionnelle.</p>
            <ul class="mt-6 space-y-3">
              <li class="flex items-center gap-2 text-wood-600"><Star class="w-4 h-4 text-wood-400 fill-wood-400" /> Essences nobles sélectionnées avec soin</li>
              <li class="flex items-center gap-2 text-wood-600"><TrendingUp class="w-4 h-4 text-wood-400" /> Rapport qualité-prix optimisé</li>
              <li class="flex items-center gap-2 text-wood-600"><Shield class="w-4 h-4 text-wood-400" /> Traçabilité et certification garantie</li>
            </ul>
          </div>
          <div class="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src="https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Atelier de menuiserie" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-primary-500 rounded-2xl p-8 md:p-12 text-center">
        <h2 class="font-display text-3xl md:text-4xl font-medium text-wood-100">Prêt à démarrer votre projet ?</h2>
        <p class="mt-4 text-wood-200 max-w-xl mx-auto">Explorez notre catalogue complet et trouvez l'essence parfaite pour votre prochain chantier.</p>
        <RouterLink to="/catalogue" class="inline-flex items-center gap-2 mt-6 bg-cta-500 hover:bg-cta-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">Parcourir le catalogue <ArrowRight class="w-4 h-4" /></RouterLink>
      </div>
    </section>
  </DefaultLayout>
</template>
