<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { ChevronDown, Search, X } from 'lucide-vue-next'

export interface SearchableOption {
  value: string
  label: string
}

export interface SearchableOptionGroup {
  label: string
  options: SearchableOption[]
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options?: SearchableOption[]
    groups?: SearchableOptionGroup[]
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
    size?: 'md' | 'sm'
    className?: string
  }>(),
  {
    options: () => [],
    groups: () => [],
    placeholder: 'Sélectionner…',
    searchPlaceholder: 'Rechercher…',
    disabled: false,
    size: 'md',
    className: '',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)
const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const rootEl = ref<HTMLDivElement | null>(null)
const activeIndex = ref(-1)

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

interface FlatOption {
  value: string
  label: string
  groupLabel: string
}

const flatOptions = computed<FlatOption[]>(() => {
  const all: FlatOption[] = []
  for (const group of props.groups) {
    for (const option of group.options) all.push({ ...option, groupLabel: group.label })
  }
  for (const option of props.options) all.push({ ...option, groupLabel: '' })
  return all
})

const visibleOptions = computed<FlatOption[]>(() => {
  const q = normalize(query.value)
  if (!q) return flatOptions.value
  return flatOptions.value.filter(
    (o) => normalize(o.label).includes(q) || normalize(o.value).includes(q),
  )
})

const showSearch = computed(() => flatOptions.value.length > 6)

const totalCount = computed(() => visibleOptions.value.length)

function selectedLabel(): string {
  const found = flatOptions.value.find((o) => o.value === props.modelValue)
  return found?.label ?? props.modelValue ?? props.placeholder
}

function select(value: string) {
  emit('update:modelValue', value)
  open.value = false
  query.value = ''
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    query.value = ''
    activeIndex.value = -1
    requestAnimationFrame(() => searchInput.value?.focus())
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) {
    if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === ' ') {
      event.preventDefault()
      open.value = true
      activeIndex.value = -1
      requestAnimationFrame(() => searchInput.value?.focus())
    }
    return
  }
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = activeIndex.value + 1 < totalCount.value ? activeIndex.value + 1 : 0
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = activeIndex.value - 1 >= 0 ? activeIndex.value - 1 : totalCount.value - 1
      break
    case 'Enter':
      event.preventDefault()
      if (activeIndex.value >= 0 && totalCount.value > 0) select(visibleOptions.value[activeIndex.value].value)
      else if (totalCount.value === 1) select(visibleOptions.value[0].value)
      break
    case 'Escape':
      open.value = false
      break
    case 'Tab':
      open.value = false
      break
  }
}

function onTriggerFocus(event: FocusEvent) {
  ;(event.currentTarget as HTMLElement | null)?.style && ((event.currentTarget as HTMLElement).style.borderColor = '#6B4226')
}

function onTriggerBlur(event: FocusEvent) {
  ;(event.currentTarget as HTMLElement | null)?.style && ((event.currentTarget as HTMLElement).style.borderColor = '#E2DCD1')
}

function onClickOutside(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) {
    open.value = false
  }
}

watch(
  () => query.value,
  () => {
    activeIndex.value = -1
  },
)

watch(
  () => props.modelValue,
  () => {
    open.value = false
  },
)

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="rootEl" class="relative" :class="className">
    <button
      type="button"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
      aria-haspopup="listbox"
      :aria-expanded="open"
      class="w-full flex items-center justify-between gap-2 rounded-lg text-sm text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :class="size === 'sm' ? 'px-2.5 py-1.5' : 'px-3 py-2.5'"
      style="border:1px solid #E2DCD1; color:#2B2420; background:#fff; outline:none;"
      @focus="onTriggerFocus"
      @blur="onTriggerBlur"
    >
      <span class="truncate" :style="modelValue ? { color: '#2B2420' } : { color: '#8A8578' }">{{ selectedLabel() }}</span>
      <ChevronDown class="w-4 h-4 flex-shrink-0 transition-transform" :class="{ 'rotate-180': open }" style="color:#7A7167;" />
    </button>

    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full min-w-[220px] rounded-lg border bg-white shadow-lg overflow-hidden"
      style="border-color:#E2DCD1; box-shadow: 0 10px 30px rgba(43,36,32,0.12);"
    >
      <div v-if="showSearch" class="flex items-center gap-2 px-3 py-2 border-b" style="border-color:#F0EDE7;">
        <Search class="w-4 h-4 flex-shrink-0" style="color:#7A7167;" />
        <input
          ref="searchInput"
          v-model="query"
          :placeholder="searchPlaceholder"
          class="w-full bg-transparent text-sm outline-none"
          style="color:#2B2420;"
        />
        <button v-if="query" type="button" class="flex-shrink-0" @click="query = ''" aria-label="Effacer la recherche">
          <X class="w-4 h-4" style="color:#8A8578;" />
        </button>
      </div>

      <div class="max-h-64 overflow-y-auto py-1">
        <template v-for="(option, index) in visibleOptions" :key="option.value">
          <div
            v-if="option.groupLabel && (index === 0 || visibleOptions[index - 1].groupLabel !== option.groupLabel)"
            class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider"
            style="color:#8A8578;"
          >
            {{ option.groupLabel }}
          </div>
          <ul role="listbox">
            <li
              role="option"
              :aria-selected="option.value === modelValue"
              @click="select(option.value)"
              @mouseenter="activeIndex = index"
              class="px-3 py-2 text-sm cursor-pointer select-none flex items-center justify-between"
              :class="{ 'bg-[#F6EFE4]': option.value === modelValue }"
              :style="activeIndex === index ? { background: '#F6EFE4', color: '#4A2C1A' } : { color: '#2B2420' }"
            >
              <span>{{ option.label }}</span>
              <span v-if="option.value === modelValue" class="text-xs font-bold" style="color:#6B4226;">✓</span>
            </li>
          </ul>
        </template>
        <div v-if="visibleOptions.length === 0" class="px-3 py-4 text-sm text-center" style="color:#8A8578;">
          Aucun résultat
        </div>
      </div>
    </div>
  </div>
</template>