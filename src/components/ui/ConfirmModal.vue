<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Check, AlertTriangle, X } from 'lucide-vue-next'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  open: boolean
  title: string
  message?: string
  variant?: 'confirm' | 'danger'
  confirmLabel?: string
  cancelLabel?: string
  confirmOnly?: boolean
  loading?: boolean
}>(), {
  variant: 'confirm',
  confirmOnly: false,
  loading: false,
})

const emit = defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()

function onCancel() {
  if (props.confirmOnly) return
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[60] bg-black/40" @click.self="onCancel"></div>
    </Transition>
    <Transition name="pop">
      <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="onCancel">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" style="border:1px solid #E2DCD1;">
          <div class="flex items-start gap-3 mb-4">
            <span class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :style="variant === 'danger' ? { background:'#fde8e6' } : { background:'#E8D4A8' }">
              <AlertTriangle v-if="variant === 'danger'" class="w-5 h-5" style="color:#B23A2E;" />
              <Check v-else class="w-5 h-5" style="color:#6B4226;" />
            </span>
            <div class="flex-1 min-w-0">
              <h2 class="font-display text-lg font-semibold" style="color:#4A2C1A;">{{ title }}</h2>
              <p v-if="message" class="text-sm leading-relaxed mt-1" style="color:#7A7167;">{{ message }}</p>
            </div>
            <button v-if="!confirmOnly" @click="onCancel" class="p-1 -m-1 rounded-lg hover:bg-wood-100 transition-colors flex-shrink-0" style="color:#7A7167;" aria-label="Fermer"><X class="w-5 h-5" /></button>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button v-if="!confirmOnly" @click="onCancel"
              class="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors" style="background:#FAF7F2; color:#6B4226;"
              onmouseover="this.style.background='#EDE6DA'" onmouseout="this.style.background='#FAF7F2'">{{ cancelLabel || t('common.cancel') }}</button>
            <button @click="emit('confirm')" :disabled="loading"
              class="px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
              :style="variant === 'danger' ? { background:'#B23A2E' } : { background:'#6B4226' }"
              onmouseover="this.style.background=this.getAttribute('data-danger')==='1' ? '#8F2E24' : '#4A2C1A'"
              onmouseout="this.style.background=this.getAttribute('data-danger')==='1' ? '#B23A2E' : '#6B4226'"
              :data-danger="variant === 'danger' ? '1' : '0'">
              {{ loading ? t('payment.processing') : (confirmLabel || t('common.confirm')) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
.pop-enter-active, .pop-leave-active { transition: transform .2s ease, opacity .2s ease }
.pop-enter-from, .pop-leave-to { transform: scale(.95); opacity: 0 }
</style>