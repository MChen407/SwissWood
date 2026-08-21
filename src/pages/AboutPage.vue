<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Shield, Leaf, Award, Heart, Check, ArrowRight, TreePine, Flame } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { t } = useI18n()

const values = [
  { icon: Shield, title: t('about.valueQualityTitle'), text: t('about.valueQualityText') },
  { icon: Leaf, title: t('about.valueSustainabilityTitle'), text: t('about.valueSustainabilityText') },
  { icon: Award, title: t('about.valueExcellenceTitle'), text: t('about.valueExcellenceText') },
  { icon: Heart, title: t('about.valueServiceTitle'), text: t('about.valueServiceText') },
]

const stats = [
  { value: '20+', label: t('about.statExperience') },
  { value: '10 000+', label: t('about.statCustomers') },
  { value: '15K', label: t('about.statStere') },
  { value: '98%', label: t('about.statSatisfaction') },
]

const features = [
  t('about.featureHumidity'),
  t('about.featureTraceability'),
  t('about.featureDelivery'),
  t('about.featureCertifications'),
]

const timeline = [
  { year: '2003', title: t('about.timeline2003Title'), text: t('about.timeline2003Text') },
  { year: '2008', title: t('about.timeline2008Title'), text: t('about.timeline2008Text') },
  { year: '2015', title: t('about.timeline2015Title'), text: t('about.timeline2015Text') },
  { year: '2024', title: t('about.timeline2024Title'), text: t('about.timeline2024Text') },
]

const certifications = [
  t('about.certFsc'),
  t('about.certPefc'),
  t('about.certIso'),
  t('about.certCo2'),
  t('about.certDry'),
]
</script>

<template>
  <DefaultLayout>

    <!-- HERO -->
    <section class="relative min-h-[520px] flex items-end overflow-hidden">
      <img
        src="/wood2.webp"
        :alt="t('about.heroAlt')"
        class="absolute inset-0 w-full h-full object-cover"
        style="object-position: center 40%;"
      />
      <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(74,44,26,0.92) 0%, rgba(74,44,26,0.55) 60%, rgba(74,44,26,0.2) 100%);"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32 w-full">
        <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-5 px-3 py-1.5 rounded-full" style="background:rgba(200,155,93,0.2); color:#C89B5D;">
          <TreePine class="w-3.5 h-3.5" /> {{ t('about.heroBadge') }}
        </span>
        <h1 class="font-display font-semibold text-white leading-tight max-w-3xl" style="font-size:clamp(2.2rem,5vw,3.8rem);">
          {{ t('about.heroTitle') }}
        </h1>
        <p class="mt-5 max-w-xl text-base leading-relaxed" style="color:#E8D4A8;">
          {{ t('about.heroText') }}
        </p>
        <RouterLink to="/contact"
          class="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-lg font-semibold text-white border transition-colors"
          style="border-color:rgba(232,212,168,0.5);"
          onmouseover="this.style.background='rgba(232,212,168,0.1)'" onmouseout="this.style.background='transparent'">
          {{ t('about.ctaContact') }} <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </section>

    <!-- Work -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid md:grid-cols-2 gap-14 items-center">
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
            <img src="/wood1.jpg" :alt="t('about.woodAlt')" class="w-full h-full object-cover" />
          </div>
          <div class="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg mt-8">
            <img src="/wood3.webp" :alt="t('about.cutAlt')" class="w-full h-full object-cover" />
          </div>
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-widest mb-3" style="color:#C89B5D;">{{ t('about.workLabel') }}</p>
          <h2 class="font-display text-3xl font-semibold mb-6" style="color:#4A2C1A;">{{ t('about.workTitle') }}</h2>
          <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">
            {{ t('about.workText1') }}
          </p>
          <p class="leading-relaxed mb-8" style="color:#7A7167; font-size:15px;">
            {{ t('about.workText2') }}
          </p>
          <ul class="space-y-3 mb-8">
            <li v-for="item in features" :key="item"
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
            {{ t('about.ctaCatalogue') }} <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
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

    <!-- Values -->
    <section class="py-20" style="background:#FAF7F2;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-sm font-semibold uppercase tracking-widest mb-3" style="color:#C89B5D;">{{ t('about.valuesLabel') }}</p>
          <h2 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">{{ t('about.valuesTitle') }}</h2>
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

    <!-- Dark CTA -->
    <section class="relative overflow-hidden min-h-[420px] flex items-center">
      <img src="/wood4.jpg" :alt="t('about.woodAlt')" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0" style="background:linear-gradient(90deg, rgba(74,44,26,0.93) 0%, rgba(74,44,26,0.75) 60%, rgba(74,44,26,0.4) 100%);"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-2xl">
          <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6 px-3 py-1.5 rounded-full" style="background:rgba(200,155,93,0.2); color:#C89B5D;">
            <Flame class="w-3.5 h-3.5" /> {{ t('about.commitmentLabel') }}
          </span>
          <h2 class="font-display font-semibold text-white leading-tight mb-6" style="font-size:clamp(1.8rem,4vw,3rem);">
            {{ t('about.commitmentTitle') }}
          </h2>
          <RouterLink to="/catalogue"
            class="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-white border transition-all"
            style="border-color:rgba(232,212,168,0.6);"
            onmouseover="this.style.background='rgba(232,212,168,0.15)'" onmouseout="this.style.background='transparent'">
            {{ t('about.ctaSelection') }} <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-14">
        <p class="text-sm font-semibold uppercase tracking-widest mb-3" style="color:#C89B5D;">{{ t('about.timelineLabel') }}</p>
        <h2 class="font-display text-3xl font-semibold" style="color:#4A2C1A;">{{ t('about.timelineTitle') }}</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div v-for="item in timeline" :key="item.year"
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

    <!-- Certifications -->
    <section class="py-14" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="font-display text-xl font-semibold text-white mb-8">{{ t('about.certificationsTitle') }}</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <div v-for="cert in certifications" :key="cert"
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