<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { makeAPIRequest } from '@/utils/http'
import Scale from '@/components/forms/ScaleQuestion.vue'
import TextQuestion from '@/components/forms/TextQuestion.vue'
import SelectorQuestion from '@/components/forms/SelectorQuestion.vue'

const data = ref({})
const currentPageNumber = ref(0)
const currentPage = ref({})
const answers = ref([])

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
        { form_id: 1 },
        {
          values: Array.from(Object.keys(answers.value).map((val) => answers.value[val]))
        }
      )
    }
  }
}

onMounted(async () => {
  data.value = await makeAPIRequest('/form/get', 'GET', { id: 1 })
  await prepareNewPage()
})
</script>

<template>
  <h2>{{ data.name }}</h2>
  <p>{{ currentPage.text }}</p>

  <form @submit.prevent="submitForm">
    <div class="" v-for="question in currentPage.questions">
      <h3>{{ question.label }}</h3>
      <p>{{ question.description }}</p>
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
    <button type="submit">Отправить</button>
  </form>
</template>

<style scoped></style>
