<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 class="font-display text-5xl font-medium text-primary-500">404</h1>
      <p class="text-wood-500 mt-3">Cette page n'existe pas ou a été déplacée.</p>
      <RouterLink to="/" class="mt-6 inline-flex items-center gap-2 text-primary-500 hover:underline"><ArrowLeft class="w-4 h-4" /> Retour à l'accueil</RouterLink>
    </div>
  </DefaultLayout>
</template>
