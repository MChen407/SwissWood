<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { t } = useI18n()
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 class="font-display text-5xl font-medium text-primary-500">404</h1>
      <p class="text-wood-500 mt-3">{{ t('notFound.message') }}</p>
      <RouterLink to="/" class="mt-6 inline-flex items-center gap-2 text-primary-500 hover:underline"><ArrowLeft class="w-4 h-4" /> {{ t('notFound.backHome') }}</RouterLink>
    </div>
  </DefaultLayout>
</template>