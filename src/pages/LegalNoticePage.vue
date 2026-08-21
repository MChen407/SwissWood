<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { t } = useI18n()
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="py-14 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-semibold">{{ t('legal.title') }}</h1>
        <p class="mt-3" style="color:#E8D4A8;">{{ t('legal.subtitle') }}</p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">1. {{ t('legal.editor') }}</h2>
        <p class="mb-4 leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('legal.editorIntro') }}</p>
        <p class="mb-2 font-semibold" style="color:#4A2C1A;">{{ t('legal.company') }}</p>
        <p class="leading-relaxed mb-2" style="color:#7A7167; font-size:15px;" v-html="t('legal.companyType') + '<br />' + t('legal.companyAddress')"></p>
        <ul class="space-y-1.5 mb-4 text-sm" style="color:#7A7167;">
          <li>{{ t('legal.id') }}: <span class="font-medium" style="color:#4A2C1A;">CHE-123.456.789</span></li>
          <li>{{ t('legal.vat') }}: <span class="font-medium" style="color:#4A2C1A;">CHE-123.456.789 TVA</span></li>
          <li>{{ t('legal.email') }}: <a href="mailto:contact@swisswood.example" class="font-medium" style="color:#6B4226;">contact@swisswood.example</a></li>
          <li>{{ t('legal.phone') }}: <span class="font-medium" style="color:#4A2C1A;">+41 21 555 14 80</span> <em class="text-xs" style="color:#C89B5D;">{{ t('legal.fictional') }}</em></li>
          <li>{{ t('legal.website') }}: <a href="http://www.swisswood.example" class="font-medium" style="color:#6B4226;">www.swisswood.example</a> <em class="text-xs" style="color:#C89B5D;">{{ t('legal.fictionalAddress') }}</em></li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">
          {{ t('legal.director') }}: <span class="font-medium" style="color:#4A2C1A;">Jean Dupont</span> <em class="text-xs" style="color:#C89B5D;">{{ t('legal.fictionalName') }}</em>
        </p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">2. {{ t('legal.activity') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.activityText1') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.activityText2') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.activityText3') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('legal.activityText4') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">3. {{ t('legal.ip') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.ipText1') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.ipText2') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('legal.ipText3') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">4. {{ t('legal.liability') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.liabilityText1') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.liabilityText2') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.liabilityText3') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('legal.liabilityText4') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">5. {{ t('legal.externalLinks') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.externalText1') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('legal.externalText2') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">6. {{ t('legal.applicableLaw') }}</h2>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('legal.applicableText') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">7. {{ t('legal.contactSection') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('legal.contactIntro') }}</p>
        <p class="mb-2 font-semibold" style="color:#4A2C1A;">{{ t('legal.company') }}</p>
        <p class="leading-relaxed mb-2" style="color:#7A7167; font-size:15px;" v-html="t('legal.contactAddress')"></p>
        <p class="text-sm" style="color:#7A7167;">
          {{ t('legal.email') }}: <a href="mailto:contact@swisswood.example" class="font-medium" style="color:#6B4226;">contact@swisswood.example</a><br />
          {{ t('legal.phone') }}: <span class="font-medium" style="color:#4A2C1A;">+41 21 555 14 80</span>
        </p>
      </div>
    </div>
  </DefaultLayout>
</template>