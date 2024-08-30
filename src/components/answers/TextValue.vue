<template>
  <div class="default-card" v-if="modelValue.length > 0">
    <div class="view-form-q-title">
      <h3 class="form-q-title">{{ label }}</h3>
      <p class="form-q-description">{{ description }}</p>
    </div>
    <div class="text-question">
      <input class="text-question-input" type="text" :value="modelValue" readonly />
    </div>
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
  modelValue: {
    type: Array,
    default: () => []
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
