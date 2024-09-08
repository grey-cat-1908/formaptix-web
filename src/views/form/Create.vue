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
const showDialog = ref(false)

function addNewQuestion(event: any) {
  pages.value[pages.value.length - 1].questions.push(event)
  showDialog.value = false
}
</script>

<template>
  <QuestionEdit v-if="showDialog" @input="addNewQuestion($event)" />
  <div class="">
    <button @click="showDialog = true">Создать вопрос</button>
    <button @click="pages.push({text: null, questions: []})">Создать страницу</button>
    <button>Сохранить</button>
  </div>
  <div style="user-select: none;">
    <div v-for="(page, index) in pages">
      <div>
        <h3>Страница {{ index + 1 }}</h3>
        <input type="text" placeholder="Описание" v-model="page.text" />
      </div>
      <hr />
      <draggable fallback-class="fallbackStyleClass" ghost-class="ghost" direction="vertical" :force-fallback="true" group="questions" :list="page.questions">
        <template #item="{ element }">
          <div style="cursor: move!important;">
            <TextPreview v-if="element.question_type === 1" :label="element.label" :description="element.description" :required="element.required" />
            <SelectorPreview v-if="element.question_type === 2" :label="element.label" :description="element.description" :required="element.required" :options="element.options" />
            <ScalePreview v-if="element.question_type === 3" :label="element.label" :description="element.description" :required="element.required" :min="element.min_value" :max="element.max_value" :minLabel="element.min_label" :maxLabel="element.max_label"/>
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
