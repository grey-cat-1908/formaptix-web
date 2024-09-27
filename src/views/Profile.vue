<script setup lang="ts">
// @ts-nocheck

import { onMounted, ref } from 'vue'
import router from '@/router'

import { useAuthStore } from '@/stores/auth'
import { makeAPIRequest } from '@/utils/http'

const authStore = useAuthStore()
const userForms = ref([])

import { PhEye, PhInfo, PhPen, PhPencil, PhTrash, PhUserList } from '@phosphor-icons/vue'

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
      <h1 class="profile-title">Профиль пользователя</h1>
      <div class="profile-ctrl-card">
        <div class="profile-ctrl-buttons">
          <button
            @click="createForm"
            class="default-button profile-ctrl-btn profile-ctrl-btn--create"
          >
            Создать форму
          </button>
          <!--          <button @click="createForm" class="default-button profile-ctrl-btn profile-ctrl-btn&#45;&#45;creat">Очистить все формы</button>-->
          <button
            @click="createForm"
            class="default-button profile-ctrl-btn profile-ctrl-btn--deleteacc"
          >
            Удалить аккаунт
          </button>
          <div class="profile-ctrl-info">
            <PhInfo :size="22" class="profile-ctrl-info--sign" /> После удаления аккаунта вернуть
            данные невозможно
          </div>
        </div>
      </div>
      <div class="profile-cards">
        <div class="profile-card" v-for="(form, index) in userForms" v-if="userForms.length > 0">
          <div class="profile-card-title">
            <!--            <code class="profile-card-num">001</code>-->
            {{ form.data.name }}
          </div>
          <div class="profile-card-buttons">
            <button
              class="profile-card-btn profile-card-btn--upd"
              @click="$router.push('/form/edit/' + form.id)"
            >
              <div class="profile-card-btn-inner"><PhPencil :size="26" /></div>
            </button>
            <button
              class="profile-card-btn profile-card-btn--upd"
              @click="$router.push('/form/answers/' + form.id)"
            >
              <div class="profile-card-btn-inner"><PhUserList :size="26" /></div>
            </button>
            <button
              class="profile-card-btn profile-card-btn--view"
              @click="$router.push('/form/view/' + form.id)"
            >
              <div class="profile-card-btn-inner"><PhEye :size="26" /></div>
            </button>
            <button class="profile-card-btn profile-card-btn--delete" @click="deleteForm(index)">
              <div class="profile-card-btn-inner"><PhTrash :size="26" /></div>
            </button>
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

  &-ctrl {
    &-info {
      display: flex;
      align-items: center;
      gap: 0 11px;
      color: var(--color-subtext);
      font-size: 16px;

      &--sign {
        min-width: 23px;
        min-height: 23px;
      }
    }

    &-card {
      margin-top: 30px;
      width: 100%;
      //border: 1px solid var(--color-main-border);
      //background: var(--color-secondary-background);
      //padding: 25px;
      border-radius: 1rem;
    }

    &-buttons {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px 20px;
    }

    &-btn {
      //width: 100%;
      padding: 15px 30px;
      border-radius: 1rem;

      &:hover {
        border: 1px solid var(--color-third-border);
      }

      @media (max-width: 500px) {
        width: 100%;
      }

      &--create {
        color: var(--color-main);
      }

      &--deleteacc {
        color: var(--color-red);
        //border: 1px solid var(--color-red);
      }
    }
  }

  &-cards {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }

  &-card {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
    border: 1px solid transparent;
    border-bottom: 2px solid var(--color-secondary-border);
    border-top: 2px solid transparent;
    transition: 0.4s ease;
    //cursor: pointer;

    &:hover {
      //background: var(--color-main-border);
    }

    @media (max-width: 680px) {
      flex-direction: column;
      align-items: start;

      .profile-card-buttons {
        margin-left: 0;
        margin-top: 10px;
        width: 100%;
        gap: 0 15px;
      }

      .profile-card-btn {
        width: 100%;
        height: 40px;
        border: 1px solid var(--color-main-border);
        background: var(--color-secondary-background);
        border-radius: 0.5rem;
      }
    }

    &:hover &-num {
      color: var(--color-text);
    }

    &:last-child {
      border-bottom: 2px solid transparent;
    }

    &-buttons {
      display: flex;
      align-items: center;
      gap: 0 10px;
      margin-left: 20px;
    }

    &-btn {
      height: 30px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.25s ease;

      &:hover {
        opacity: 0.7;
      }

      &--delete {
        color: var(--color-red);
      }
    }

    &-title {
      display: flex;
      font-weight: 400;
      align-items: center;
      gap: 0 15px;

      @media (max-width: 500px) {
        font-size: 0.95rem;
      }
    }

    &-num {
      font-size: 0.88em;
      font-weight: 400;
      padding-right: 15px;
      transition: 0.4s ease;
      border-right: 1px solid var(--color-subtext);
      color: var(--color-subtext);
    }
  }
}
</style>
