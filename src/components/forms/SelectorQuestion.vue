<template>
  <div class="selector-component">
    <div class="options">
      <div
          v-for="(option, index) in options"
          :key="index"
          class="option"
          @click="toggleSelection(index)"
          :class="{ selected: isSelected(index) }"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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
    error.value = `Необходимо выбрать минимум ${props.minValues} вариантов.`
    return
  }

  if (props.maxValues && selectedIndexes.value.length > props.maxValues) {
    error.value = `Необходимо выбрать не больше ${props.maxValues} вариантов.`
    return
  }

  if (props.isRequired && selectedIndexes.value.length === 0) {
    error.value = `Выбор обязателен.`
  }
}

watch(selectedIndexes, validateSelection)
</script>

<style scoped>
.selector-component {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.options {
  display: flex;
  flex-wrap: wrap;
}

.option {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.option.selected {
  border-color: #42b983;
  background-color: #e6f7ff;
}

.option img {
  max-width: 50px;
  margin-right: 10px;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>
