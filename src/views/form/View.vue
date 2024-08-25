<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { makeAPIRequest } from '@/utils/http'
import Scale from '@/components/forms/ScaleQuestion.vue'
import TextQuestion from '@/components/forms/TextQuestion.vue'
import SelectorQuestion from '@/components/forms/SelectorQuestion.vue'
import FormNotFound from '@/components/FormNotFound.vue'
import { useRoute } from 'vue-router'

import { PhInfo } from '@phosphor-icons/vue'

const route = useRoute()

const data = ref({})
const currentPageNumber = ref(0)
const pageCount = ref(0)
const currentPage = ref({})
const answers = ref([])
const isFormNotFound = ref(true)
const isSent = ref(false)

async function prepareNewPage() {
  currentPage.value = data.value.pages[currentPageNumber.value]
  currentPage.value.questions.forEach((q) => {
    answers.value[q.id] = {
      question_id: q.id,
      question_type: q.question_type
    }
  })
}

function beforeSubmitValidate() {
  for (let question_id of currentPage.value.questions.keys()) {
    const question = currentPage.value.questions[question_id]
    const answer = answers.value[question.id]

    if (question.question_type === 2) {
      return question.required && answer.values.length >= question.min_values
    }
  }
  return true
}

async function submitForm() {
  if (beforeSubmitValidate()) {
    if (currentPageNumber.value !== data.value.pages.length - 1) {
      currentPageNumber.value += 1
      await prepareNewPage()
    } else {
      await makeAPIRequest(
        '/answer/create',
        'POST',
        { form_id: Number(route.params.id) },
        {
          values: Array.from(Object.keys(answers.value).map((val) => answers.value[val]))
        }
      )
      isSent.value = true
    }
  }
}

onMounted(async () => {
  const formResponse = await makeAPIRequest('/form/get', 'GET', { id: Number(route.params.id) })
  if (!formResponse.json || formResponse.status !== 200) {
    return
  }
  data.value = formResponse.json.data
  pageCount.value = data.value.pages.length
  isFormNotFound.value = false
  await prepareNewPage()
})
</script>

<template>
  <div class="view">
    <div class="container">
      <FormNotFound v-if="isFormNotFound" />
      <div v-else>
        <div v-if="isSent" class="default-card">Форма была успешно отправлена.</div>
        <div v-else class="view-form">
          <div class="view-form-title view-form-container default-card">
            <div class="view-form-info">
              <PhInfo :size="23" class="view-form-info--sign" /> Информация о форме
            </div>
            <h2 class="form-title">{{ data.name }}</h2>
            <p class="form-description">{{ currentPage.text }}</p>
          </div>
          <form @submit.prevent="submitForm" class="">
            <div class="view-form-q view-form-container">
              <div class="default-card form-red" v-for="question in currentPage.questions">
                <div class="view-form-q-title">
                  <h3 class="form-q-title">{{ question.label }}</h3>
                  <p class="form-q-description">{{ question.description }}</p>
                </div>
                <TextQuestion
                  v-if="question.question_type === 1"
                  :minLength="question.min_length"
                  :maxLength="question.max_length"
                  :validator="question.validator"
                  :isRequired="question.required"
                  v-model="answers[question.id].value"
                  @input="answers[question.id].value = $event"
                />
                <SelectorQuestion
                  v-if="question.question_type === 2"
                  :minValues="question.min_values"
                  :maxValues="question.max_values"
                  :options="question.options"
                  :isRequired="question.required"
                  v-model="answers[question.id].values"
                  @input="answers[question.id].values = $event"
                />
                <Scale
                  v-if="question.question_type === 3"
                  :min="question.min_value"
                  :max="question.max_value"
                  :minLabel="question.min_label"
                  :maxLabel="question.max_label"
                  :isRequired="question.required"
                  v-model="answers[question.id].value"
                  @input="answers[question.id].value = $event"
                />
              </div>
            </div>
            <div class="view-form-btns view-form-container">
              <div class="view-form-send-space" v-if="currentPageNumber === pageCount - 1">
                <button type="submit" class="default-button view-form-send">Отправить</button>
                <div class="view-form-info">
                  <PhInfo :size="22" class="view-form-info--sign" /> Проверьте все данные перед
                  отправкой!
                </div>
              </div>
              <button type="submit" class="default-button view-form-next" v-else>Дальше</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.default-card {
  width: 100%;
  border: 1px solid var(--color-main-border);
  background: var(--color-secondary-background);
  padding: 25px;
  border-radius: 1rem;
}
.form-red {
  border: 1px solid var(--color-red);
}

.view {
  margin: 40px 0;
  &-form {
    display: flex;
    flex-direction: column;
    //gap: 25px 0;

    &-container {
      margin: 0 auto;
      max-width: 800px;
    }

    &-title {
      border: 1px solid var(--color-third-border);
      //margin-bottom: 20px;

      & h2 {
        margin-top: 10px;
        margin-bottom: 4px;
      }
    }

    &-info {
      display: flex;
      align-items: center;
      gap: 0 11px;
      color: var(--color-subtext);
      font-size: 16px;

      &--sign {
        min-width: 23px;
        min-height: 23px;
      }
    }

    &-q {
      display: flex;
      flex-direction: column;
      gap: 20px 0;
      margin: 35px auto;

      &:empty {
        margin: 10px 0;
      }

      &-title {
        margin-bottom: 25px;

        & h3 {
          font-weight: 400;
          margin-bottom: 8px;
        }

        & p {
          color: var(--color-description);
          font-size: 17px;
        }
      }
    }

    &-send,
    &-next {
      border-radius: 1rem;
      padding: 10px 30px;
    }

    &-send {
      padding: 15px 30px;
      border-radius: 1rem;
      background: var(--color-main);
      color: var(--color-alternative-text);

      &:hover {
        opacity: 0.9;
      }

      @media (max-width: 500px) {
        width: 100%;
      }

      &-space {
        display: flex;
        //justify-content: space-between;
        align-items: center;
        gap: 10px 30px;

        @media (max-width: 500px) {
          flex-direction: column;
        }
      }
    }
  }

  @media (max-width: 500px) {
    .form-title {
      font-size: 1.3em;
    }

    .form-description {
      font-size: 0.9em;
    }

    .form-q-title {
      font-size: 1.1em;
    }

    .form-q-description {
      font-size: 0.88em;
    }
  }

  @media (max-width: 380px) {
    .form-title {
      font-size: 1.17em;
    }
  }
}
</style>
