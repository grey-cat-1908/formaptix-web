<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { makeAPIRequest } from '@/utils/http'
import FormNotFound from '@/components/FormNotFound.vue'
import { useRoute } from 'vue-router'
import TextValue from '@/components/answers/TextValue.vue'
import SelectorValue from '@/components/answers/SelectorValue.vue'
import ScaleValue from '@/components/answers/ScaleValue.vue'

const route = useRoute()

const data = ref([])
const questionsData = ref({})
const currentPageNumber = ref(0)
const isAnswerNotFound = ref(true)
const mode = ref(0)

onMounted(async () => {
  const formResponse = await makeAPIRequest(
    '/answer/get',
    'GET',
    { form_id: Number(route.params.id) },
    {},
    true
  )
  if (!formResponse.json || formResponse.status !== 200) {
    return
  }
  data.value = formResponse.json.answers
  if (data.value.length > 0) {
    isAnswerNotFound.value = false
  }

  const questionsFormResponse = await makeAPIRequest('/form/get', 'GET', {
    id: Number(route.params.id)
  })
  if (!questionsFormResponse.json || questionsFormResponse.status !== 200) {
    return
  }

  questionsFormResponse.json.data.pages.forEach((p: any) => {
    p.questions.forEach((q: any) => {
      questionsData.value[q.id] = q
    })
  })
})
</script>

<template>
  <FormNotFound v-if="isAnswerNotFound" />
  <div v-else>
    <button @click="mode = 0">Отдельный пользователь</button>
    <div class="" v-if="mode === 0">
      <button @click="currentPageNumber = Math.max(0, currentPageNumber - 1)"><</button>
      <button @click="currentPageNumber = Math.min(data.length - 1, currentPageNumber + 1)">
        >
      </button>

      <div class="" v-for="(value, index) in data[currentPageNumber].data.values">
        <TextValue
          v-if="questionsData[value.question_id].question_type === 1"
          :label="questionsData[value.question_id].label"
          :description="questionsData[value.question_id].description"
          :textarea="questionsData[value.question_id].textarea"
          v-model="value.value"
        />
        <SelectorValue
          v-if="questionsData[value.question_id].question_type === 2"
          :options="questionsData[value.question_id].options"
          :label="questionsData[value.question_id].label"
          :description="questionsData[value.question_id].description"
          v-model="value.values"
        ></SelectorValue>
        <ScaleValue
          v-if="questionsData[value.question_id].question_type === 3"
          :min="questionsData[value.question_id].min_value"
          :max="questionsData[value.question_id].max_value"
          :label="questionsData[value.question_id].label"
          :description="questionsData[value.question_id].description"
          v-model="value.value"
        ></ScaleValue>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
