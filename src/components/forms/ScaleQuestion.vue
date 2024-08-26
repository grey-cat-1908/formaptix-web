<template>
  <div class="rating">
    <div class="rating-labels">
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

<style scoped lang="scss">
.rating {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
  }

  &-options {
    display: flex;
    justify-content: space-evenly;
    gap: 0 50px;
    width: 100%;

    @media (max-width: 810px) {
      flex-direction: column;
      gap: 15px 0;
    }
  }

  &-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px 0;

    &--btn {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    @media (max-width: 810px) {
      flex-direction: initial;
      gap: 0 15px;
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
