<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Save, Check } from 'lucide-vue-next'
import { api, type CmsContentDto } from '@/lib/api'

const { t } = useI18n()

type CmsLang = 'fr' | 'en' | 'es' | 'de'
const CMS_LANGS: { value: CmsLang; labelKey: string }[] = [
  { value: 'fr', labelKey: 'locale.fr' },
  { value: 'en', labelKey: 'locale.en' },
  { value: 'es', labelKey: 'locale.es' },
  { value: 'de', labelKey: 'locale.de' },
]
const cmsLang = ref<CmsLang>('fr')

const contents = ref<CmsContentDto[]>([])
const loading = ref(true)
const savedKey = ref<string | null>(null)

function translationOf(item: CmsContentDto, lang: CmsLang): string {
  return item.translations?.[lang]?.value ?? ''
}

onMounted(async () => {
  contents.value = await api.admin.getCms()
  for (const item of contents.value) {
    item.translations = { en: {}, es: {}, de: {}, ...(item.translations ?? {}) }
  }
  loading.value = false
})

function isFilled(item: CmsContentDto, lang: CmsLang): boolean {
  return lang === 'fr' ? item.value.trim() !== '' : translationOf(item, lang).trim() !== ''
}

async function save(item: CmsContentDto) {
  const lang = cmsLang.value
  if (lang === 'fr') {
    await api.admin.updateCms(item.id, { value: item.value })
  } else {
    await api.admin.updateCms(item.id, { value: translationOf(item, lang), locale: lang })
  }
  savedKey.value = `${item.key}:${lang}`
  setTimeout(() => savedKey.value = null, 2000)
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="font-display text-2xl font-medium text-primary-500">{{ t('admin.cmsTitle') }}</h1>
      <div class="flex items-center gap-1">
        <button v-for="lang in CMS_LANGS" :key="lang.value" type="button" @click="cmsLang = lang.value"
          :class="['px-2.5 py-1 text-xs font-medium rounded-md uppercase transition-colors',
            cmsLang === lang.value ? 'bg-primary-500 text-wood-100' : 'bg-wood-100 text-wood-500 hover:bg-wood-200']">
          {{ t(lang.labelKey) }}
        </button>
      </div>
    </div>
    <div v-if="loading" class="text-center py-10 text-wood-400">{{ t('common.loading') }}</div>
    <div v-else class="space-y-4">
      <div v-for="item in contents" :key="item.id" class="bg-white rounded-xl border border-wood-200 p-5">
        <label class="text-sm font-medium text-primary-500">{{ item.label }}</label>
        <p class="text-xs text-wood-300 mb-2">
          {{ t('admin.cmsKey') }}: {{ item.key }}
          <span class="ml-2 inline-flex items-center gap-1">
            <span v-for="lang in CMS_LANGS" :key="lang.value" :title="t(lang.labelKey)"
              :class="['w-1.5 h-1.5 rounded-full inline-block', isFilled(item, lang.value) ? 'bg-primary-500' : 'bg-wood-200']"></span>
          </span>
        </p>
        <div class="flex gap-2">
          <textarea v-if="cmsLang === 'fr'" v-model="item.value" rows="2" class="flex-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"></textarea>
          <textarea v-else v-model="item.translations![cmsLang].value" rows="2" class="flex-1 px-3 py-2 border border-wood-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"></textarea>
          <button @click="save(item)" :aria-label="t('common.save')" class="self-start p-2.5 bg-primary-500 text-wood-100 rounded-lg hover:bg-primary-600 transition-colors"><Save v-if="savedKey !== `${item.key}:${cmsLang}`" class="w-4 h-4" /><Check v-else class="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  </div>
</template>
