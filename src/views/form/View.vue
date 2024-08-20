<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { makeAPIRequest } from '@/utils/http'
import Scale from '@/components/forms/Scale.vue'

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

async function submitForm() {
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
      <Scale
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
