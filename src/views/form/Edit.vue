<script setup lang="ts">
// @ts-nocheck

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
import {
  PhDotsSixVertical,
  PhFilePlus,
  PhFloppyDisk,
  PhRowsPlusBottom,
  PhTrash
} from '@phosphor-icons/vue'

import EditControl from '@/components/EditControl.vue'

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
  <EditControl />
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
  <div class="edit">
    <div class="container">
      <div class="edit-form edit-form-container">
        <div class="default-card edit-ctrl-card hl-grey">
          <button
            @click="showCreateDialog = true"
            class="edit-ctrl-card-btn edit-ctrl-card-btn--newa"
          >
            <PhRowsPlusBottom :size="30" />
          </button>
          <button
            @click="pages.push({ text: null, questions: [] })"
            class="edit-ctrl-card-btn edit-ctrl-card-btn--newp"
          >
            <PhFilePlus :size="30" />
          </button>
          <button @click="submitSave" class="edit-ctrl-card-btn edit-ctrl-card-btn--save">
            <PhFloppyDisk :size="30" />
          </button>
        </div>
        <div style="user-select: none" class="">
          <div class="default-card hl-main form-card-formtitle">
            <h3 class="view-form-q-title">Название формы</h3>
            <input type="text" v-model="formName" class="default-input" />
          </div>
          <div class="edit-form-page-space">
            <div v-for="(page, pageIndex) in pages">
              <div class="edit-form-page">
                <h2 class="form-title edit-form-page-title">
                  Страница {{ pageIndex + 1 }}
                  <button
                    @click="deletePage(pageIndex)"
                    v-if="pages.length > 1"
                    class="edit-form-page-delete"
                  >
                    <PhTrash :size="32" />
                  </button>
                </h2>
                <div class="default-card hl-grey">
                  <h3 class="edit-form-title">Описание страницы</h3>
                  <textarea
                    placeholder="Описание"
                    v-model="page.text"
                    class="edit-form-page-card-textarea"
                  />
                </div>
              </div>
              <div class="edit-form-cards-space">
                <draggable
                  fallback-class="fallbackStyleClass"
                  ghost-class="ghost"
                  direction="vertical"
                  :force-fallback="true"
                  group="questions"
                  :list="page.questions"
                  handle=".edit-form-card-move"
                >
                  <template #item="{ element, index }">
                    <div class="default-card edit-form-card">
                      <div class="edit-form-card-move" style="cursor: move !important">
                        <PhDotsSixVertical :size="30" />
                      </div>
                      <div class="edit-form-card-main">
                        <TextPreview
                          v-if="element.question_type === 1"
                          :label="element.label"
                          :description="element.description"
                          :required="element.required"
                          :textarea="element.textarea"
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
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fallbackStyleClass {
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

.default-input {
  width: 100% !important;
  background: var(--color-main-background);
  border: 1px solid var(--color-main-border);
  padding: 10px 20px;
  font-weight: 200;
  border-radius: 0.5rem;
  outline: 0;
  transition:
    border,
    background 0.25s ease;

  &:hover {
    border: 1px solid var(--color-secondary-border);
  }

  &:focus {
    border: 1px solid var(--color-third-border);
    background: var(--color-input-background);
  }
}

.hl-grey {
  border: 1px solid var(--color-third-border);
}

.hl-main {
  border: 2px solid var(--color-main);
}

.edit {
  margin: 40px 0;

  &-form {
    display: flex;
    flex-direction: column;
    //gap: 25px 0;

    &-container {
      display: grid;
      grid-template-columns: 75px calc(100% - 95px);
      gap: 0 20px;
      align-items: start;
      margin: 0 auto;
      max-width: 880px;
    }

    &-title {
      font-weight: 400;
      margin-bottom: 15px;
    }

    &-description {
      color: var(--color-description);
      font-size: 17px;
    }

    &-page {
      display: flex;
      flex-direction: column;
      gap: 15px 0;

      &-space {
        display: flex;
        flex-direction: column;
        margin-top: 40px;
        gap: 70px 0;
      }

      &-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0 20px;
      }

      &-delete {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        transition: 0.15s ease-in-out;
        color: var(--color-red);

        &:hover {
          background: rgba(255, 59, 59, 0.1);
        }

        &:active {
          opacity: 0.7;
        }
      }

      &-card {
        &-textarea {
          width: 100% !important;
          background: var(--color-main-background);
          border: 1px solid var(--color-main-border);
          padding: 10px 20px;
          font-weight: 200;
          border-radius: 0.5rem;
          outline: 0;
          transition:
            border,
            background 0.25s ease;

          &:hover {
            border: 1px solid var(--color-secondary-border);
          }

          &:focus {
            border: 1px solid var(--color-third-border);
            background: var(--color-input-background);
          }
        }
      }
    }

    &-card {
      padding-left: 10px;
      display: flex;
      align-items: center;
      gap: 0 15px;

      &-move {
      }
    }

    &-cards {

      &-space > * {
        display: flex;
        flex-direction: column;
        gap: 20px 0;
        margin-top: 35px;
      }
    }
  }



  &-ctrl-card {
    padding: 10px;
    position: sticky;
    top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px 0;

    &-btn {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: 0.15s ease-in-out;

      &:hover {
        background: var(--color-main-border);
      }

      &:active {
        background: var(--color-main-toned);
      }

      //&--newp, &--newa {
      //  background: #d6e1ff;
      //  border: 1px solid #a7beff;
      //}
      //
      //&--save {
      //  background: #d0ffc6;
      //  border: 1px solid #52c042;
      //}
    }
  }
}

@media (max-width: 660px) {
  .edit {
    margin-bottom: 120px;

    &-form {
      &-container {
        display: block;
      }
    }
    &-ctrl-card {
      display: none;
    }
  }
}
</style>
