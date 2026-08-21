import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setLocale, type Locale } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>((localStorage.getItem('swisswood_locale') as Locale) || 'fr')

  function set(localeCode: Locale) {
    locale.value = localeCode
    setLocale(localeCode)
  }

  return { locale, set }
})