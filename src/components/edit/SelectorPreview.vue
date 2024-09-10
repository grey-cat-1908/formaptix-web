<template>
  <div class="view-form-q-title">
    <h3 class="form-q-title">{{ label }} <span style="color: red" v-if="required">*</span></h3>
    <p class="form-q-description">{{ description }}</p>
  </div>
  <div class="selector">
    <div class="selector-options">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="selector-option default-button"
      >
        <span>{{ option.label }}</span>
      </div>
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
  options: {
    type: Array,
    required: true
  },
  required: {
    type: Boolean,
    default: null
  }
})
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
