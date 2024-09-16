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
        <div class="profile-card" v-for="(form, index) in userForms" v-if="userForms.length > 0">
          <div class="profile-card-title">
            <code class="profile-card-num">001</code>
            {{ form.data.name }}
          </div>
          <div class="profile-card-buttons">
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
    cursor: pointer;

    &:hover {
      ////border: 1px solid var(--color-main-border);
      background: var(--color-main-border);
      ////border-radius: 0.5rem;
      //transform: scale(1.03);
      //border-bottom: 2px solid var(--color-third-border) !important;
      //border-top: 2px solid var(--color-third-border);
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
    }

    &-btn {
      height: 30px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition:  0.25s ease;


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
//.profile {
//  margin: 40px 0;
//
//  &-cards {
//    margin-top: 30px;
//    display: grid;
//    grid-template-columns: 1fr 1fr 1fr 1fr;
//    gap: 25px;
//  }
//
//  &-card {
//    border: 1px solid var(--color-main-border);
//    background: var(--color-secondary-background);
//    transition: 0.25s ease;
//    padding: 15px;
//    border-radius: 0.5rem;
//
//    &-title {
//      font-weight: 400;
//    }
//
//    &-buttons {
//      margin-top: 25px;
//      display: grid;
//      grid-template-columns: 1fr 1fr 1fr;
//      gap: 15px;
//    }
//
//    &-btn {
//      display: flex;
//      justify-content: center;
//      align-items: center;
//      height: 45px;
//      border-radius: 0.5rem;
//      transition: 0.25s ease;
//
//      &--view {
//        background: #d6e1ff;
//        border: 1px solid #a7beff;
//
//        &:hover {
//          background: #ccd9ff;
//        }
//      }
//
//      &--update {
//        background: #fff7cc;
//        border: 1px solid #f6e17a;
//
//        &:hover {
//          background: #fff4b2;
//        }
//      }
//
//      &--delete {
//        background: #ffd8d8;
//        border: 1px solid #ffb1b1;
//
//        &:hover {
//          background: #ffcece;
//        }
//      }
//    }
//  }
//}
</style>
