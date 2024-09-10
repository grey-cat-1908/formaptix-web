<template>
  <div class="view-form-q-title">
    <h3 class="form-q-title">{{ label }} <span style="color: red" v-if="required">*</span></h3>
    <p class="form-q-description">{{ description }}</p>
  </div>
  <div class="rating">
    <div class="rating-options">
      <label v-for="n in range" :key="n" class="rating-option">
        <input type="radio" :value="n" class="rating-option--btn" />
        <span>{{ n }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import '@/styles/form/view.scss'
import { computed, ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: null
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  required: {
    type: Boolean,
    default: null
  }
})

const range = computed(() => {
  return Array.from({ length: props.max - props.min + 1 }, (_, i) => props.min + i)
})
</script>

<style scoped lang="scss">
.rating {
  display: flex;
  flex-direction: column;
  //align-items: center;

  &-options {
    display: flex;
    justify-content: space-evenly;
    gap: 0 50px;
    width: 100%;

    @media (max-width: 810px) {
      flex-direction: column;
      gap: 20px 0;
    }
  }

  &-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px 0;

    //&--btn {
    //  width: 20px;
    //  height: 20px;
    //  cursor: pointer;
    //}

    &--btn:after {
      width: 25px;
      height: 25px;
      border-radius: 15px;
      top: -6px;
      left: -6px;
      position: relative;
      background: var(--color-input-background);
      border: 2px solid var(--color-main-border);
      content: '';
      display: inline-block;
      visibility: visible;
      cursor: pointer;
      transition: 0.25s ease;
    }

    &--btn:after:hover {
      border: 2px solid var(--color-secondary-border);
      background: var(--color-main-background);
    }
    &--btn:checked:after {
      width: 25px;
      height: 25px;
      border-radius: 15px;
      top: -6px;
      left: -6px;
      position: relative;
      border: 2px solid var(--color-main);
      background: var(--color-main-toned);
      content: '';
      display: inline-block;
      visibility: visible;
    }

    @media (max-width: 810px) {
      flex-direction: initial;
      gap: 0 25px;
    }
  }

  &-delete {
    width: 100%;
    border-radius: 1rem;
    padding: 10px 30px;
    margin-top: 25px;
    border: 1px solid var(--color-third-border);

    &:hover {
      border: 1px solid var(--color-main);
    }
  }
}
</style>
