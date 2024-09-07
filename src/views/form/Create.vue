<script setup lang="ts">
import QuestionEdit from '@/components/edit/QuestionEdit.vue'
import { ref } from 'vue'
import draggable from 'vuedraggable'

const pages = ref([
  { text: 'Тестовый текст 1', questions: [] },
  { text: 'лоре ипсум долор сит амет', questions: [] }
])
const showDialog = ref(false)

function addNewQuestion(event: any) {
  pages.value[pages.value.length - 1].questions.push(event)
  showDialog.value = false
}
</script>

<template>
  <QuestionEdit v-if="showDialog" @input="addNewQuestion($event)" />
  <div class="">
    <button @click="showDialog = true">Создать</button>
    <button>Сохранить</button>
    <button>Превью</button>
  </div>
  <div>
    <div v-for="(page, index) in pages">
      <div>
        <h3>Страница {{ index + 1 }}</h3>
        <p>{{ page.text }}</p>
      </div>
      <hr />
      <draggable group="questions" :list="page.questions">
        <template #item="{ element }">
          <div style="cursor: pointer">{{ element.label }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drop-zone {
  background-color: #eee;
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}
</style>
