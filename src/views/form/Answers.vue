<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { makeAPIRequest } from '@/utils/http'
import FormNotFound from '@/components/FormNotFound.vue'
import { useRoute } from 'vue-router'
import TextValue from '@/components/answers/TextValue.vue'

const route = useRoute()

const data = ref([])
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
        <TextValue v-if="value.question_type === 1" v-model="value.value" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
