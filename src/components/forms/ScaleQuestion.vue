<template>
  <div class="default-card" :class="{ 'form-red': isEmpty }">
    <div class="view-form-q-title">
      <h3 class="form-q-title">{{ label }}</h3>
      <p class="form-q-description">{{ description }}</p>
    </div>
    <img v-if="imageUrl" :src="imageUrl" alt="image by user" />
    <div class="rating">
      <div class="rating-options">
        <label v-for="n in range" :key="n" class="rating-option">
          <input
            type="radio"
            :value="n"
            v-model="selectedValue"
            :required="isRequired"
            @change="updateValue"
            class="rating-option--btn"
          />
          <span>{{ n }}</span>
        </label>
      </div>
      <button
        class="rating-delete default-button"
        v-if="selectedValue !== null"
        @click="cancelSelection"
      >
        Отменить выбор
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhCardsThree, PhCaretCircleUpDown } from '@phosphor-icons/vue'

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
  },
  isEmpty: {
    type: Boolean,
    default: false
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

//button {
//  margin-top: 10px;
//}
</style>
