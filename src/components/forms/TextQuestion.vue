<template>
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
</template>

<script setup>
import { ref } from 'vue'
import { PhXCircle } from '@phosphor-icons/vue'

const props = defineProps({
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
  }
})

const emit = defineEmits(['input'])
const inputValue = ref(props.value)
const error = ref('')

function validateTIN(value) {
  const len = value.length
  if (len !== 10 && len !== 12) return false

  const digits = value.split('').map(Number)

  if (len === 10) {
    const checksum =
      ((2 * digits[0] +
        4 * digits[1] +
        10 * digits[2] +
        3 * digits[3] +
        5 * digits[4] +
        9 * digits[5] +
        4 * digits[6] +
        6 * digits[7] +
        8 * digits[8]) %
        11) %
      10
    return digits[9] === checksum
  }

  if (len === 12) {
    const checksum1 =
      ((7 * digits[0] +
        2 * digits[1] +
        4 * digits[2] +
        10 * digits[3] +
        3 * digits[4] +
        5 * digits[5] +
        9 * digits[6] +
        4 * digits[7] +
        6 * digits[8] +
        8 * digits[9]) %
        11) %
      10
    const checksum2 =
      ((3 * digits[0] +
        7 * digits[1] +
        2 * digits[2] +
        4 * digits[3] +
        10 * digits[4] +
        3 * digits[5] +
        5 * digits[6] +
        9 * digits[7] +
        4 * digits[8] +
        6 * digits[9] +
        8 * digits[10]) %
        11) %
      10
    return digits[10] === checksum1 && digits[11] === checksum2
  }

  return false
}

function validateSNILS(value) {
  if (value.length !== 11) return false

  const digits = value.slice(0, 9).split('').map(Number)
  const checksum = digits.reduce((sum, digit, index) => sum + digit * (9 - index), 0)

  let controlNumber = checksum % 101
  if (controlNumber === 100 || controlNumber === 101) {
    controlNumber = 0
  }

  return controlNumber === Number(value.slice(-2))
}

function validateInput() {
  error.value = ''

  if (props.minLength && inputValue.value.length < props.minLength) {
    error.value = `Минимальная длина ${props.minLength} символов`
    return
  }

  if (props.validator === 1 && !validateTIN(inputValue.value)) {
    error.value = 'Некорректный ИНН'
    return
  }

  if (props.validator === 2 && !validateSNILS(inputValue.value)) {
    error.value = 'Некорректный СНИЛС'
    return
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
    width: 100%;
    background: var(--color-main-background);
    border: 1px solid var(--color-main-border);
    padding: 10px 20px;
    font-weight: 200;
    border-radius: 0.5rem;
    outline: 0;
    transition: 0.25s ease;

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
