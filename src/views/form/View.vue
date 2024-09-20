<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { makeAPIRequest } from '@/utils/http'
import Scale from '@/components/forms/ScaleQuestion.vue'
import TextQuestion from '@/components/forms/TextQuestion.vue'
import SelectorQuestion from '@/components/forms/SelectorQuestion.vue'
import FormNotFound from '@/components/FormNotFound.vue'
import { useRoute } from 'vue-router'

import { PhInfo, PhCardsThree } from '@phosphor-icons/vue'
import { validateSNILS, validateTIN } from '@/utils/validators'

import '@/styles/form/view.scss'

const route = useRoute()

const data = ref({})
const currentPageNumber = ref(0)
const pageCount = ref(0)
const currentPage = ref({})
const answers = ref({})
const isFormNotFound = ref(true)
const isSent = ref(false)

const emptyQuestions = ref({})

async function prepareNewPage() {
  currentPage.value = data.value.pages[currentPageNumber.value]
  currentPage.value.questions.forEach((q) => {
    answers.value[q.id] = {
      question_id: q.id,
      question_type: q.question_type,
      value: null,
      values: null
    }
  })
}

function beforeSubmitValidate() {
  for (let question of currentPage.value.questions) {
    const answer = answers.value[question.id]

    emptyQuestions.value[question.id] = true

    if (!answer) return false
    if (question.required && !answer.value && !answer.values) return false

    if (question.question_type === 1 && answer.value) {
      if (!question.validator && question.min_length && answer.value.length < question.min_length)
        return false
      if (question.validator === 1 && !validateTIN(answer.value)) return false
      if (question.validator === 2 && !validateSNILS(answer.value)) return false
    } else if (
      question.question_type === 2 &&
      !(question.required && answer.values.length >= question.min_values)
    ) {
      return false
    }

    delete emptyQuestions.value[question.id]
  }
  return true
}

async function submitForm() {
  if (beforeSubmitValidate()) {
    if (currentPageNumber.value !== data.value.pages.length - 1) {
      currentPageNumber.value += 1
      await prepareNewPage()
    } else {
      for (let page of data.value.pages) {
        page.questions.forEach((q) => {
          let answer = answers.value[q.id]
          if (!q.required && !(answer.value || answer.values)) {
            delete answers.value[q.id]
          }
        })
      }
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
              <PhCardsThree :size="23" class="view-form-info--sign" />
              <div class="view-form-info--text">
                Страница {{ currentPageNumber + 1 }} из {{ data.pages.length }}
              </div>
            </div>
            <h2 class="form-title">{{ data.name }}</h2>
            <p class="form-description">{{ currentPage.text }}</p>
          </div>
          <form @submit.prevent="submitForm" class="">
            <div class="view-form-q view-form-container">
              <div v-for="question in currentPage.questions">
                <TextQuestion
                  :key="question.id"
                  v-if="question.question_type === 1"
                  :label="question.label"
                  :description="question.description"
                  :imageUrl="question.image_url"
                  :minLength="question.min_length"
                  :maxLength="question.max_length"
                  :validator="question.validator"
                  :isRequired="question.required"
                  :isTextarea="question.textarea"
                  :isEmpty="emptyQuestions[question.id]"
                  v-model="answers[question.id].value"
                  @input="answers[question.id].value = $event"
                />
                <SelectorQuestion
                  :key="question.id"
                  v-if="question.question_type === 2"
                  :label="question.label"
                  :description="question.description"
                  :imageUrl="question.image_url"
                  :minValues="question.min_values"
                  :maxValues="question.max_values"
                  :options="question.options"
                  :isRequired="question.required"
                  :isEmpty="emptyQuestions[question.id]"
                  v-model="answers[question.id].values"
                  @input="answers[question.id].values = $event"
                />
                <Scale
                  :key="question.id"
                  v-if="question.question_type === 3"
                  :label="question.label"
                  :description="question.description"
                  :imageUrl="question.image_url"
                  :min="question.min_value"
                  :max="question.max_value"
                  :minLabel="question.min_label"
                  :maxLabel="question.max_label"
                  :isRequired="question.required"
                  :isEmpty="emptyQuestions[question.id]"
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

<style scoped lang="scss"></style>
