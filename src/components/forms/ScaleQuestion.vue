<template>
  <div class="rating-component">
    <div class="labels">
      <span>{{ minLabel }}</span>
      <span>{{ maxLabel }}</span>
    </div>
    <div class="rating-options">
      <label v-for="n in range" :key="n" class="rating-option">
        <input
          type="radio"
          :value="n"
          v-model="selectedValue"
          :required="isRequired"
          @change="updateValue"
        />
        <span>{{ n }}</span>
      </label>
    </div>
    <button v-if="selectedValue !== null" @click="cancelSelection">Отменить выбор</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  minLabel: {
    type: String,
    required: true
  },
  maxLabel: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: null
  },
  isRequired: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['input'])
const selectedValue = ref(props.value)

const range = computed(() => {
  return Array.from({ length: props.max - props.min + 1 }, (_, i) => props.min + i)
})

function updateValue() {
  emit('input', selectedValue.value)
}

function cancelSelection() {
  selectedValue.value = null
  emit('input', selectedValue.value)
}
</script>

<style scoped>
.rating-component {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.rating-options {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.rating-option {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  margin-top: 10px;
}
</style>
