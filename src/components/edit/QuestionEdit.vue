<script setup lang="ts">
import { PhX, PhXCircle } from '@phosphor-icons/vue'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['input'])
const data = ref({})

onMounted(() => {
  data.value = {
    label: null,
    description: null,
    question_type: 1,
    required: false,
    validator: null,
    min_length: null,
    max_length: null
  }
})

async function submitForm() {
  if (data.value.question_type === 1 && data.value.validator === null) {
    if (data.value.min_length !== null && data.value.min_length < 0) return
    if (data.value.max_length !== null) {
      if (data.value.max_length <= 0) return
      if (data.value.min_length !== null && data.value.max_length < data.value.min_length) return
    }
  }

  emit('input', data.value)
}
</script>

<template>
  <div class="question">
    <div class="question-bg"></div>
    <div class="question-space">
      <div class="question-card">
        <div class="question-card-title">
          <h3 class="question-card-title--text">Редактирование вопроса</h3>
          <button @click="">
            <PhX class="question-card-title--btn" :size="30" />
          </button>
        </div>
        <form @submit.prevent="submitForm" class="question-card-content">
          <div class="">
            <p>Название</p>
            <input v-model="data.label" type="text" required placeholder="Название вопроса" />
          </div>
          <div class="">
            <p>Описание</p>
            <input v-model="data.description" type="text" placeholder="Описание" />
          </div>
          <div class="">
            <p>Тип вопроса</p>
            <select v-model="data.question_type" id="question-type">
              <option :value="1">Текст</option>
              <option :value="2">Выбор</option>
              <option :value="3">Шкала</option>
            </select>
          </div>
          <div class="question-data">
            <div class="" v-if="data.question_type === 1">
              <div class="">
                <p>Валидатор</p>
                <select v-model="data.validator" id="question-type">
                  <option :value="null">Текст</option>
                  <option :value="1">ИНН</option>
                  <option :value="2">СНИЛС</option>
                </select>
                <div class="" v-if="data.validator === null">
                  <div class="">
                    <p>Минимальная длина</p>
                    <input v-model="data.min_length" type="number" placeholder="0" />
                  </div>
                  <div class="">
                    <p>Максимальная длина</p>
                    <input v-model="data.max_length" type="number" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <p>Обязательный?</p>
            <label class="switch">
              <input v-model="data.required" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
          <button type="submit">Сохранить</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.question {
  &-space {
    position: fixed;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  &-bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100vh;
    z-index: 100;
  }

  &-card {
    width: 800px;
    padding: 30px;
    background: var(--color-main-background);
    border-radius: 1rem;

    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;

      &--btn {
        transition: 0.25s ease;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
</style>
