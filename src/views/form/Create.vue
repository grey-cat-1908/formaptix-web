<script setup lang="ts">
import QuestionEdit from '@/components/edit/QuestionEdit.vue'
import { ref } from 'vue'

const questions = ref([])
const showDialog = ref(false)
</script>

<template>
  <QuestionEdit
    v-if="showDialog"
    @input="
      questions.push($event)
      showDialog = false
    "
  />
  <div class="">
    <button @click="showDialog = true">Создать</button>
    <button>Сохранить</button>
    <button>Превью</button>
  </div>
  <div class="">
    {{ questions }}
  </div>
</template>

<style scoped lang="scss"></style>
