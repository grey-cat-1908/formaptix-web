<script setup lang="ts">
import QuestionEdit from '@/components/edit/QuestionEdit.vue'
import { onMounted, ref } from 'vue'
import router from '@/router'
import draggable from 'vuedraggable'
import TextPreview from '@/components/edit/TextPreview.vue'
import SelectorPreview from '@/components/edit/SelectorPreview.vue'
import ScalePreview from '@/components/edit/ScalePreview.vue'
import { makeAPIRequest } from '@/utils/http'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const pages = ref([])
const formName = ref()
const formId = ref(0)

const showCreateDialog = ref(false)
const showEditDialog = ref(false)

const currentPage = ref(0)
const currentQuestion = ref(0)

const savedNotify = ref(false)

function addNewQuestion(event: any) {
  pages.value[pages.value.length - 1].questions.push(event)
  showCreateDialog.value = false
}

function editQuestion(event: any) {
  pages.value[currentPage.value].questions[currentQuestion.value] = event
  showEditDialog.value = false
}

function queueQuestionEdit(pageIndex: number, questionIndex: number) {
  currentPage.value = pageIndex
  currentQuestion.value = questionIndex
  showEditDialog.value = true
}

function deletePage(index: number) {
  let moveTo = index - 1
  if (index === 0) {
    moveTo = index + 1
  }
  pages.value[moveTo].questions.concat(pages.value[index].questions)
  pages.value.splice(index, 1)
}

function deleteQuestion(pageIndex: number, questionIndex: number) {
  pages.value[pageIndex].questions.splice(questionIndex, 1)
}

async function submitSave() {
  const formResponse = await makeAPIRequest(
    '/form/edit',
    'PUT',
    { id: formId.value },
    { name: formName.value, pages: pages.value },
    true
  )
  if (!formResponse.json || formResponse.status !== 200) {
    await router.push('/')
    return
  }
  savedNotify.value = true
  setTimeout(function () {
    savedNotify.value = false
  }, 2000)
}

onMounted(async () => {
  const formResponse = await makeAPIRequest('/form/get', 'GET', { id: Number(route.params.id) })
  if (!formResponse.json || formResponse.status !== 200 || !authStore.isAuthorized) {
    await router.push('/')
    return
  }
  pages.value = formResponse.json.data.pages
  formName.value = formResponse.json.data.name
  formId.value = Number(route.params.id)
})
</script>

<template>
  <transition-group name="notification-appear">
    <div class="notification" v-if="savedNotify">
      <div class="save-success">Успешно сохранено!</div>
    </div>
  </transition-group>
  <QuestionEdit v-if="showCreateDialog" @input="addNewQuestion($event)" />
  <QuestionEdit
    v-if="showEditDialog"
    @input="editQuestion($event)"
    :data="pages[currentPage].questions[currentQuestion]"
  />
  <div class="">
    <button @click="showCreateDialog = true">Создать вопрос</button>
    <button @click="pages.push({ text: null, questions: [] })">Создать страницу</button>
    <button @click="submitSave">Сохранить</button>
  </div>
  <div style="user-select: none">
    <input type="text" v-model="formName" />
    <div v-for="(page, pageIndex) in pages">
      <div>
        <h3>Страница {{ pageIndex + 1 }}</h3>
        <textarea placeholder="Описание" v-model="page.text" />
        <button @click="deletePage(pageIndex)" v-if="pages.length > 1">X</button>
      </div>
      <hr />
      <draggable
        fallback-class="fallbackStyleClass"
        ghost-class="ghost"
        direction="vertical"
        :force-fallback="true"
        group="questions"
        :list="page.questions"
      >
        <template #item="{ element, index }">
          <div class="default-card" style="cursor: move !important">
            <TextPreview
              v-if="element.question_type === 1"
              :label="element.label"
              :description="element.description"
              :required="element.required"
            />
            <SelectorPreview
              v-if="element.question_type === 2"
              :label="element.label"
              :description="element.description"
              :required="element.required"
              :options="element.options"
            />
            <ScalePreview
              v-if="element.question_type === 3"
              :label="element.label"
              :description="element.description"
              :required="element.required"
              :min="element.min_value"
              :max="element.max_value"
              :minLabel="element.min_label"
              :maxLabel="element.max_label"
            />
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
  cursor: move !important;
  user-select: none !important;
}

.notification {
  display: flex;
  position: fixed;
  bottom: 0;
  right: 0;
  flex-direction: column;
  padding: 0 24px 24px;
  z-index: 5678;
  @media (max-width: 768px) {
    width: 100%;
  }
}

.save-success {
  padding: 12px 24px;
  border-radius: 16px;
  margin-top: 8px;
  border: 1px solid var(--color-green);
}

.notification-appear-enter-from,
.notification-appear-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.notification-appear-enter-active,
.notification-appear-leave-active {
  transition-timing-function: ease;
  transition-duration: 0.2s;
}
</style>
