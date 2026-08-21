<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import { SUPPORTED_LOCALES, type Locale } from '@/i18n'

const { locale } = useI18n()
const localeStore = useLocaleStore()

const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
}

function changeLocale(l: Locale) {
  locale.value = l
  localeStore.set(l)
}
</script>

<template>
  <div class="hidden sm:flex items-center gap-0.5 rounded-lg p-0.5" style="background:#E8D4A8;">
    <button
      v-for="l in SUPPORTED_LOCALES"
      :key="l"
      type="button"
      @click="changeLocale(l)"
      :class="['px-2 py-1 text-xs font-medium rounded-md transition-all uppercase',
        locale === l ? 'text-white' : 'text-primary-600 hover:text-primary-500']"
      :style="locale === l ? 'background:#6B4226;' : ''"
      :title="LOCALE_LABELS[l]"
    >{{ l }}</button>
  </div>
</template>