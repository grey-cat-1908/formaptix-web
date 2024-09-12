<template>
  <div class="default-card" :class="{ 'form-red': error || isEmpty }">
    <div class="view-form-q-title">
      <h3 class="form-q-title">{{ label }} <span style="color: red" v-if="isRequired">*</span></h3>
      <p class="form-q-description">{{ description }}</p>
    </div>
    <img v-if="imageUrl" :src="imageUrl" alt="image by user" />
    <div class="text-question">
      <input
        class="text-question-input"
        type="text"
        v-model="inputValue"
        :maxlength="maxLength"
        :required="isRequired"
        @input="validateInput"
        @blur="validateInput"
        placeholder="Ваш ответ"
      />
      <p v-if="error" class="text-question-error">
        <PhXCircle class="text-question-error--sign" :size="23" />{{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhXCircle } from '@phosphor-icons/vue'
import { validateSNILS, validateTIN } from '@/utils/validators'
import { normalizeCountForm } from '@/utils/formation'

import '@/styles/form/view.scss'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  minLength: {
    type: Number,
    default: null
  },
  maxLength: {
    type: Number,
    default: null
  },
  validator: {
    type: Number,
    default: null
  },
  value: {
    type: String,
    default: ''
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  isEmpty: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['input'])
const inputValue = ref(props.value)
const error = ref('')

function validateInput() {
  error.value = ''

  if (props.isRequired || inputValue.value) {
    if (props.minLength && inputValue.value.length < props.minLength) {
      error.value = `Минимальная длина - ${props.minLength} ${normalizeCountForm(props.minValues, ['символ', 'символа', 'символов'])}`
    }
    if (props.validator === 1 && !validateTIN(inputValue.value)) {
      error.value = 'Некорректный ИНН'
    }
    if (props.validator === 2 && !validateSNILS(inputValue.value)) {
      error.value = 'Некорректный СНИЛС'
    }
  }

  emit('input', inputValue.value)
}
</script>

<style scoped lang="scss">
.text-question {
  display: flex;
  flex-direction: column;

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

  &-input {
    width: 100% !important;
    background: var(--color-main-background);
    border: 1px solid var(--color-main-border);
    padding: 10px 20px;
    font-weight: 200;
    border-radius: 0.5rem;
    outline: 0;
    transition:
      border,
      background 0.25s ease;

    &:hover {
      border: 1px solid var(--color-secondary-border);
    }

    &:focus {
      border: 1px solid var(--color-third-border);
      background: var(--color-input-background);
    }
  }
}
</style>
