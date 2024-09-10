<script setup lang="ts">
import QuestionEdit from '@/components/edit/QuestionEdit.vue'
import { ref } from 'vue'
import draggable from 'vuedraggable'
import TextPreview from '@/components/edit/TextPreview.vue'
import SelectorPreview from '@/components/edit/SelectorPreview.vue'
import ScalePreview from '@/components/edit/ScalePreview.vue'

const pages = ref([
  { text: 'Тестовый текст 1', questions: [] },
  { text: 'лоре ипсум долор сит амет', questions: [] }
])
const showCreateDialog = ref(false);
const showEditDialog = ref(false);

const currentPage = ref(0);
const currentQuestion = ref(0);

function addNewQuestion(event: any) {
  pages.value[pages.value.length - 1].questions.push(event)
  showCreateDialog.value = false
}

function editQuestion(event: any) {
  pages.value[currentPage.value].questions[currentQuestion.value] = event;
  showEditDialog.value = false;
}

function queueQuestionEdit(pageIndex: number, questionIndex: number) {
  currentPage.value = pageIndex;
  currentQuestion.value = questionIndex;
  showEditDialog.value = true;
}

function deletePage(index: number) {
  let moveTo = index - 1;
  if (index === 0) {
    moveTo = index + 1;
  }
  pages.value[moveTo].questions.concat(pages.value[index].questions);
  pages.value.splice(index, 1);
}

function deleteQuestion(pageIndex: number, questionIndex: number) {
  pages.value[pageIndex].questions.splice(questionIndex, 1);
}
</script>

<template>
  <QuestionEdit v-if="showCreateDialog" @input="addNewQuestion($event)" />
  <QuestionEdit v-if="showEditDialog" @input="editQuestion($event)" :data="pages[currentPage].questions[currentQuestion]" />
  <div class="">
    <button @click="showCreateDialog = true">Создать вопрос</button>
    <button @click="pages.push({text: null, questions: []})">Создать страницу</button>
    <button>Сохранить</button>
  </div>
  <div style="user-select: none;">
    <div v-for="(page, pageIndex) in pages">
      <div>
        <h3>Страница {{ pageIndex + 1 }}</h3>
        <input type="text" placeholder="Описание" v-model="page.text" />
        <button @click="deletePage(pageIndex)" v-if="pages.length > 1">X</button>
      </div>
      <hr />
      <draggable fallback-class="fallbackStyleClass" ghost-class="ghost" direction="vertical" :force-fallback="true" group="questions" :list="page.questions">
        <template #item="{element, index}">
          <div class="default-card" style="cursor: move!important;">
            <TextPreview v-if="element.question_type === 1" :label="element.label" :description="element.description" :required="element.required" />
            <SelectorPreview v-if="element.question_type === 2" :label="element.label" :description="element.description" :required="element.required" :options="element.options" />
            <ScalePreview v-if="element.question_type === 3" :label="element.label" :description="element.description" :required="element.required" :min="element.min_value" :max="element.max_value" :minLabel="element.min_label" :maxLabel="element.max_label"/>
            <button @click="deleteQuestion(pageIndex, index)">X</button>
            <button @click="queueQuestionEdit(pageIndex, index)">Редактировать</button>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fallbackStyleClass {
  cursor: move!important;
  user-select: none!important;
}
</style>
