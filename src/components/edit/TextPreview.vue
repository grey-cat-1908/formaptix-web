<template>
  <div class="view-form-q-title">
    <h3 class="form-q-title">{{ label }} <span style="color: red" v-if="required">*</span></h3>
    <p class="form-q-description">{{ description }}</p>
  </div>
  <div v-if="textarea" class="text-question">
    <textarea class="text-question-input" placeholder="Ответ на вопрос" readonly />
  </div>
  <div v-else class="text-question">
    <input class="text-question-input" placeholder="Ответ на вопрос" type="text" readonly />
  </div>
</template>

<script setup>
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
  required: {
    type: Boolean,
    default: null
  },
  textarea: {
    type: Boolean,
    default: null
  }
})
</script>

<style scoped>
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
