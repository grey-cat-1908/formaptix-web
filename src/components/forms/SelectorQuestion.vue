<template>
  <div class="selector">
    <div class="selector-labels">
      <div class="selector-labels-info">
        <PhCaretCircleUpDown :size="23" class="selector-labels-info--sign" />
        <div class="selector-labels-info--text">
          Выберите от {{ minValues }} до {{ Math.min(maxValues, options.length) }} {{ normalizeCountForm(Math.min(maxValues, options.length), ['варианта', 'вариантов', 'вариантов']) }}
        </div>
      </div>
    </div>
    <div class="selector-options">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="selector-option default-button"
        @click="toggleSelection(index)"
        :class="{ selected: isSelected(index) }"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
    <p v-if="error" class="selector-error">
      <PhXCircle class="selector-error--sign" :size="23" />{{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PhCaretCircleUpDown, PhXCircle } from '@phosphor-icons/vue'
import { normalizeCountForm } from '@/utils/formation'

const props = defineProps({
  minValues: {
    type: Number,
    default: 1
  },
  maxValues: {
    type: Number,
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  value: {
    type: Array,
    default: () => []
  },
  isRequired: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['input'])
const selectedIndexes = ref([...props.value])
const error = ref('')

function toggleSelection(index) {
  const isSelected = selectedIndexes.value.includes(index)

  if (isSelected) {
    selectedIndexes.value = selectedIndexes.value.filter((i) => i !== index)
  } else if (!props.maxValues || selectedIndexes.value.length < props.maxValues) {
    selectedIndexes.value.push(index)
  }

  validateSelection()
  emit('input', selectedIndexes.value)
}

function isSelected(index) {
  return selectedIndexes.value.includes(index)
}

function validateSelection() {
  error.value = ''

  if (selectedIndexes.value.length < props.minValues) {
    error.value = `Необходимо выбрать минимум ${props.minValues} ${normalizeCountForm(props.minValues, ['вариант', 'варианта', 'вариантов']) }.`
    return
  }

  if (props.maxValues && selectedIndexes.value.length > props.maxValues) {
    error.value = `Необходимо выбрать не больше ${props.maxValues} ${normalizeCountForm(props.maxValues, ['варианта', 'вариантов', 'вариантов']) }.`
    return
  }

  if (props.isRequired && selectedIndexes.value.length === 0) {
    error.value = `Выбор обязателен.`
  }
}

watch(selectedIndexes, validateSelection)
</script>

<style scoped lang="scss">
.selector {
  display: flex;
  flex-direction: column;

  &-labels {
    &-info {
      display: flex;
      align-items: center;
      gap: 0 11px;
      color: var(--color-description);
      font-size: 16px;
      font-weight: 400;
      margin-bottom: 30px;

      &--sign {
        min-width: 23px;
        min-height: 23px;
      }
    }
  }

  &-options {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  &-option {
    border-radius: 0.5rem;
    background: var(--color-input-background);
    border: 1px solid var(--color-main-border);
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      border: 1px solid var(--color-secondary-border);
      background: var(--color-main-background);
    }

    &.selected {
      border: 1px solid var(--color-main);
      background: var(--color-main-toned);
      //color: var(--color-alternative-text);
    }
  }

  &-error {
    margin-top: 20px;
    color: var(--color-red);
    display: flex;
    align-items: center;
    gap: 0 13px;
    font-size: 0.9em;

    &--sign {
      min-width: 23px;
      min-height: 23px;
    }
  }
}
</style>
