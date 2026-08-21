<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const { t } = useI18n()

const introParagraphs = [t('privacy.intro1'), t('privacy.intro2'), t('privacy.intro3')]
const idData = [t('privacy.idData1'), t('privacy.idData2'), t('privacy.idData3'), t('privacy.idData4'), t('privacy.idData5'), t('privacy.idData6')]
const orderData = [t('privacy.orderData1'), t('privacy.orderData2'), t('privacy.orderData3'), t('privacy.orderData4'), t('privacy.orderData5'), t('privacy.orderData6'), t('privacy.orderData7'), t('privacy.orderData8')]
const techData = [t('privacy.techData1'), t('privacy.techData2'), t('privacy.techData3'), t('privacy.techData4'), t('privacy.techData5'), t('privacy.techData6'), t('privacy.techData7'), t('privacy.techData8')]
const purposes = [t('privacy.purpose1'), t('privacy.purpose2'), t('privacy.purpose3'), t('privacy.purpose4'), t('privacy.purpose5'), t('privacy.purpose6'), t('privacy.purpose7'), t('privacy.purpose8'), t('privacy.purpose9'), t('privacy.purpose10'), t('privacy.purpose11'), t('privacy.purpose12'), t('privacy.purpose13'), t('privacy.purpose14'), t('privacy.purpose15')]
const international = [t('privacy.international1'), t('privacy.international2'), t('privacy.international3'), t('privacy.international4'), t('privacy.international5'), t('privacy.international6'), t('privacy.international7'), t('privacy.international8')]
const thirdParties = [t('privacy.thirdParty1'), t('privacy.thirdParty2'), t('privacy.thirdParty3'), t('privacy.thirdParty4'), t('privacy.thirdParty5'), t('privacy.thirdParty6'), t('privacy.thirdParty7')]
const cookies = [t('privacy.cookie1'), t('privacy.cookie2'), t('privacy.cookie3'), t('privacy.cookie4'), t('privacy.cookie5'), t('privacy.cookie6')]
const retention = [t('privacy.retention3'), t('privacy.retention4'), t('privacy.retention5'), t('privacy.retention6'), t('privacy.retention7')]
const security = [t('privacy.security1'), t('privacy.security2'), t('privacy.security3'), t('privacy.security4'), t('privacy.security5'), t('privacy.security6')]
const rights = [t('privacy.right1'), t('privacy.right2'), t('privacy.right3'), t('privacy.right4'), t('privacy.right5'), t('privacy.right6'), t('privacy.right7')]
</script>

<template>
  <DefaultLayout>
    <!-- Hero -->
    <section class="py-14 text-white" style="background:#4A2C1A;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-semibold">{{ t('privacy.title') }}</h1>
        <p class="mt-3" style="color:#E8D4A8;">{{ t('privacy.updated') }}</p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <p v-for="p in introParagraphs" :key="p" class="leading-relaxed mb-4 last:mb-0" style="color:#7A7167; font-size:15px;">{{ p }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">1. {{ t('privacy.controller') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.controllerIntro') }}</p>
        <p class="mb-2 font-semibold" style="color:#4A2C1A;">SwissWood Sàrl</p>
        <p class="leading-relaxed mb-2" style="color:#7A7167; font-size:15px;" v-html="t('privacy.companyAddress')"></p>
        <p class="text-sm mb-2" style="color:#7A7167;">
          {{ t('privacy.email') }}: <a href="mailto:privacy@swisswood.example" class="font-medium" style="color:#6B4226;">privacy@swisswood.example</a><br />
          {{ t('privacy.phone') }}: <span class="font-medium" style="color:#4A2C1A;">+41 21 555 14 80</span>
        </p>
        <p class="text-xs" style="color:#C89B5D;">{{ t('privacy.fictional') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">2. {{ t('privacy.collected') }}</h2>
        <p class="leading-relaxed mb-5" style="color:#7A7167; font-size:15px;">{{ t('privacy.collectedIntro') }}</p>

        <h3 class="font-semibold mb-2" style="color:#4A2C1A;">{{ t('privacy.idData') }}</h3>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in idData" :key="i">{{ i }}</li>
        </ul>

        <h3 class="font-semibold mb-2" style="color:#4A2C1A;">{{ t('privacy.orderData') }}</h3>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in orderData" :key="i">{{ i }}</li>
        </ul>

        <h3 class="font-semibold mb-2" style="color:#4A2C1A;">{{ t('privacy.paymentData') }}</h3>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">{{ t('privacy.paymentData1') }}</p>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">{{ t('privacy.paymentData2') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.paymentData3') }}</p>

        <h3 class="font-semibold mb-2 mt-5" style="color:#4A2C1A;">{{ t('privacy.techData') }}</h3>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">{{ t('privacy.techDataIntro') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 text-sm" style="color:#7A7167;">
          <li v-for="i in techData" :key="i">{{ i }}</li>
        </ul>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">3. {{ t('privacy.purposes') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.purposesIntro') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 text-sm" style="color:#7A7167;">
          <li v-for="i in purposes" :key="i">{{ i }}</li>
        </ul>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">4. {{ t('privacy.international') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.internationalText1') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.internationalText2') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in international" :key="i">{{ i }}</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.internationalText3') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">5. {{ t('privacy.thirdParties') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.thirdParties1') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.thirdParties2') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in thirdParties" :key="i">{{ i }}</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.thirdParties3') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">6. {{ t('privacy.transfers') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.transfers1') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.transfers2') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">7. {{ t('privacy.cookies') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.cookiesIntro') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in cookies" :key="i">{{ i }}</li>
        </ul>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">{{ t('privacy.cookies1') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.cookies2') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">8. {{ t('privacy.commercial') }}</h2>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">{{ t('privacy.commercial1') }}</p>
        <p class="leading-relaxed mb-3" style="color:#7A7167; font-size:15px;">{{ t('privacy.commercial2') }}</p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.commercial3') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">9. {{ t('privacy.retention') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.retention1') }}</p>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.retention2') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in retention" :key="i">{{ i }}</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.retention8') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">10. {{ t('privacy.security') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.securityIntro') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in security" :key="i">{{ i }}</li>
        </ul>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.security7') }}</p>
      </div>

      <div class="bg-white rounded-xl border p-8" style="border-color:#E2DCD1; box-shadow:0 2px 12px rgba(43,36,32,0.06);">
        <h2 class="font-display text-xl font-semibold mb-4" style="color:#4A2C1A;">11. {{ t('privacy.rights') }}</h2>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.rightsIntro') }}</p>
        <ul class="list-disc pl-5 space-y-1.5 mb-5 text-sm" style="color:#7A7167;">
          <li v-for="i in rights" :key="i">{{ i }}</li>
        </ul>
        <p class="leading-relaxed mb-4" style="color:#7A7167; font-size:15px;">{{ t('privacy.rights1') }}</p>
        <p class="mb-4"><a href="mailto:privacy@swisswood.example" class="font-medium" style="color:#6B4226;">privacy@swisswood.example</a></p>
        <p class="leading-relaxed" style="color:#7A7167; font-size:15px;">{{ t('privacy.rights2') }}</p>
      </div>
    </div>
  </DefaultLayout>
</template>