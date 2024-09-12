<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'

import { useAuthStore } from '@/stores/auth'
import { makeAPIRequest } from '@/utils/http'

const authStore = useAuthStore()
const userForms = ref([])

import { PhEye, PhPen, PhPencil, PhTrash } from '@phosphor-icons/vue'

onMounted(async () => {
  await authStore.prepareStore()
  if (!authStore.isAuthorized) {
    await router.push('/')
  } else {
    const formResponse = await makeAPIRequest('/form/list', 'GET', {}, {}, true)
    if (!formResponse.json || formResponse.status !== 200) {
      return
    }
    userForms.value = formResponse.json.forms
  }
})

async function deleteForm(index: Number) {
  const form = userForms.value[index]
  await makeAPIRequest('/form/delete', 'DELETE', { id: form.id }, {}, true)
  userForms.value.splice(index, 1)
}

async function createForm() {
  const formResponse = await makeAPIRequest(
    '/form/create',
    'POST',
    null,
    {
      name: 'Новая форма',
      pages: [{ text: 'Пустая страница', questions: [] }]
    },
    true
  )
  if (!formResponse.json || formResponse.status !== 200) {
    return
  }
  userForms.value.push(formResponse.json)
}
</script>

<template>
  <div class="profile" v-if="authStore.isAuthorized">
    <div class="container">
      <h1 class="profile-title">Управление формами</h1>
      <button @click="createForm">Создать</button>
      <div class="profile-cards">
        <div v-for="(form, index) in userForms" v-if="userForms.length > 0">
          <div class="profile-card">
            <div class="profile-card-title">{{ form.data.name }}</div>
            <div class="profile-card-buttons">
              <button
                class="profile-card-btn profile-card-btn--view"
                @click="$router.push('/form/view/' + form.id)"
              >
                <div class="profile-card-btn-inner"><PhEye :size="24" /></div>
              </button>
              <button
                class="profile-card-btn profile-card-btn--update"
                @click="$router.push('/form/edit/' + form.id)"
              >
                <div class="profile-card-btn-inner"><PhPencil :size="24" /></div>
              </button>
              <button class="profile-card-btn profile-card-btn--delete" @click="deleteForm(index)">
                <div class="profile-card-btn-inner"><PhTrash :size="24" /></div>
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <h1>Формы не найдены.</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile {
  margin: 40px 0;

  &-cards {
    margin-top: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 25px;
  }

  &-card {
    border: 1px solid var(--color-main-border);
    background: var(--color-secondary-background);
    transition: 0.25s ease;
    padding: 15px;
    border-radius: 0.5rem;

    &-title {
      font-weight: 400;
    }

    &-buttons {
      margin-top: 25px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
    }

    &-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 45px;
      border-radius: 0.5rem;
      transition: 0.25s ease;

      &--view {
        background: #d6e1ff;
        border: 1px solid #a7beff;

        &:hover {
          background: #ccd9ff;
        }
      }

      &--update {
        background: #fff7cc;
        border: 1px solid #f6e17a;

        &:hover {
          background: #fff4b2;
        }
      }

      &--delete {
        background: #ffd8d8;
        border: 1px solid #ffb1b1;

        &:hover {
          background: #ffcece;
        }
      }
    }
  }
}
</style>
