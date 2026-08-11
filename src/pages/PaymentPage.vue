<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CreditCard, Building2, Mail, Loader2, ShieldCheck, ArrowRight, Check, Lock, Info } from 'lucide-vue-next'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { api, type OrderDetailDto } from '@/lib/api'
import { useCurrencyStore } from '@/stores/currency'

const route = useRoute()
const router = useRouter()
const currency = useCurrencyStore()

const order = ref<OrderDetailDto | null>(null)
const loading = ref(true)
const step = ref<'method' | 'bank_instructions' | 'card_security' | 'card_processing' | 'card_validation'>('method')
const securityCode = ref('')
const errorMsg = ref('')

const orderTotals = computed(() => {
  const o = order.value
  if (!o) return { eur: 0, usd: 0, fcfa: 0 }
  const usd = o.items.reduce((s, i) => s + (i.unit_price_usd ?? 0) * Number(i.quantity), 0)
  const fcfa = o.items.reduce((s, i) => s + (i.unit_price_fcfa ?? 0) * Number(i.quantity), 0)
  return { eur: o.total_eur, usd, fcfa }
})

onMounted(async () => {
  const orderId = route.query.order as string
  if (!orderId) { router.push('/panier'); return }
  try {
    order.value = await api.orders.getMine(orderId)
  } catch {
    router.push('/panier')
    return
  }
  loading.value = false
})

async function selectMethod(method: 'card' | 'bank_transfer') {
  if (!order.value) return
  if (method === 'bank_transfer') {
    step.value = 'bank_instructions'
    await api.orders.initPayment(order.value.id, { method: 'bank_transfer' })
  } else {
    step.value = 'card_security'
    await api.orders.initPayment(order.value.id, { method: 'card' })
    setTimeout(() => { step.value = 'card_processing' }, 2000)
    setTimeout(() => { step.value = 'card_validation' }, 4500)
  }
}

async function validateCode() {
  if (securityCode.value.length < 4) { errorMsg.value = 'Veuillez saisir le code complet'; return }
  errorMsg.value = ''
  if (!order.value) return
  try {
    await api.orders.confirmPayment(order.value.id, securityCode.value)
    router.push({ name: 'confirmation', query: { order: order.value.id } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Code invalide. Veuillez réessayer.'
    errorMsg.value = message
  }
}

async function resendCode() {
  errorMsg.value = ''
  if (!order.value) return
  try {
    await api.orders.resendCode(order.value.id)
    errorMsg.value = 'Un nouveau code vous a été envoyé.'
  } catch (err) {
    errorMsg.value = err instanceof Error ? err.message : 'Impossible de renvoyer le code.'
  }
}

function finishBankTransfer() {
  if (!order.value) return
  router.push({ name: 'confirmation', query: { order: order.value.id, method: 'transfer' } })
}
</script>

<template>
  <DefaultLayout>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-20"><Loader2 class="w-8 h-8 text-primary-500 animate-spin mx-auto" /></div>

      <div v-else-if="order">
        <h1 class="font-display text-3xl font-medium text-primary-500 mb-2">Paiement</h1>
        <p class="text-wood-500 mb-2">Commande <span class="font-medium text-primary-500">{{ order.order_number }}</span></p>
        <p class="text-2xl font-semibold text-primary-500 mb-8">{{ currency.formatPriceWithFallback(orderTotals.eur, orderTotals.usd, orderTotals.fcfa) }}</p>

        <!-- Step: Choose method -->
        <div v-if="step === 'method'" class="space-y-4">
          <h2 class="text-lg font-medium text-primary-500">Choisissez votre méthode de paiement</h2>
          <button @click="selectMethod('card')" class="w-full flex items-center gap-4 p-5 bg-white border-2 border-wood-200 rounded-xl hover:border-primary-500 transition-colors text-left group">
            <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0"><CreditCard class="w-6 h-6 text-primary-500" /></div>
            <div class="flex-1"><h3 class="font-medium text-primary-500">Paiement par carte bancaire</h3><p class="text-sm text-wood-500">Sécurisé par authentification forte (3D Secure)</p></div>
            <ArrowRight class="w-5 h-5 text-wood-300 group-hover:text-primary-500 transition-colors" />
          </button>
          <button @click="selectMethod('bank_transfer')" class="w-full flex items-center gap-4 p-5 bg-white border-2 border-wood-200 rounded-xl hover:border-primary-500 transition-colors text-left group">
            <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0"><Building2 class="w-6 h-6 text-primary-500" /></div>
            <div class="flex-1"><h3 class="font-medium text-primary-500">Paiement par compte bancaire (Virement)</h3><p class="text-sm text-wood-500">Recevez les coordonnées bancaires par e-mail</p></div>
            <ArrowRight class="w-5 h-5 text-wood-300 group-hover:text-primary-500 transition-colors" />
          </button>
        </div>

        <!-- Step: Bank transfer instructions -->
        <div v-else-if="step === 'bank_instructions'" class="space-y-6">
          <div class="bg-white rounded-xl border border-wood-200 p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg bg-wood-200 flex items-center justify-center"><Mail class="w-5 h-5 text-wood-600" /></div>
              <div><h2 class="font-medium text-primary-500">Instructions envoyées par e-mail</h2><p class="text-sm text-wood-500">La procédure de virement a été envoyée sur votre boîte mail.</p></div>
            </div>
            <div class="bg-wood-100 rounded-lg p-4 text-sm text-wood-600 space-y-2">
              <p class="flex items-center gap-2"><Info class="w-4 h-4 text-wood-400" /> Ouvrez votre e-mail et suivez les instructions fournies.</p>
              <p class="flex items-center gap-2"><Info class="w-4 h-4 text-wood-400" /> Effectuez le virement avec les coordonnées bancaires indiquées.</p>
              <p class="flex items-center gap-2"><Info class="w-4 h-4 text-wood-400" /> Référence à indiquer: <strong>{{ order.order_number }}</strong></p>
            </div>
          </div>
          <div class="bg-warning-100 border border-warning-500/20 rounded-xl p-5">
            <div class="flex items-start gap-3"><Info class="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" /><div><h3 class="font-medium text-warning-500">Commande en attente de réception des fonds</h3><p class="text-sm text-wood-600 mt-1">Dès réception de votre virement, notre équipe validera votre commande. Vous recevrez une confirmation par e-mail.</p></div></div>
          </div>
          <button @click="finishBankTransfer" class="w-full bg-primary-500 text-wood-100 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"><Check class="w-5 h-5" /> J'ai effectué le virement</button>
        </div>

        <!-- Step: Card security code sent -->
        <div v-else-if="step === 'card_security'" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-wood-200 flex items-center justify-center mx-auto mb-4"><ShieldCheck class="w-8 h-8 text-wood-600" /></div>
          <h2 class="font-display text-xl font-medium text-primary-500">Sécurité</h2>
          <p class="text-wood-500 mt-2">Un code de sécurité a été envoyé à votre numéro de téléphone.</p>
          <div class="flex items-center justify-center gap-2 mt-4 text-sm text-wood-400"><Loader2 class="w-4 h-4 animate-spin" /> Infos code envoyé...</div>
        </div>

        <!-- Step: Card processing loader -->
        <div v-else-if="step === 'card_processing'" class="text-center py-16">
          <Loader2 class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-6" />
          <h2 class="font-display text-xl font-medium text-primary-500">Communication avec la banque</h2>
          <p class="text-wood-500 mt-2 max-w-sm mx-auto">Veuillez patienter, ne rafraîchissez pas la page. L'application travaille...</p>
        </div>

        <!-- Step: Card validation -->
        <div v-else-if="step === 'card_validation'" class="space-y-6">
          <div class="bg-white rounded-xl border border-wood-200 p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center"><ShieldCheck class="w-5 h-5 text-success-500" /></div>
              <h2 class="font-medium text-primary-500">Validation de votre paiement</h2>
            </div>
            <p class="text-sm text-wood-500 mb-4">Saisissez le code de confirmation que vous venez de recevoir.</p>
            <input v-model="securityCode" type="text" maxlength="6" placeholder="Code à 4-6 chiffres" class="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:border-primary-500" @keyup.enter="validateCode" />
            <p v-if="errorMsg" class="text-sm text-error-500 mt-2">{{ errorMsg }}</p>
            <p class="text-sm text-wood-400 mt-2"><button type="button" class="underline hover:text-primary-500" @click="resendCode">Renvoyer le code</button></p>
          </div>
          <button @click="validateCode" class="w-full bg-primary-500 text-wood-100 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"><Lock class="w-5 h-5" /> Valider le paiement</button>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
