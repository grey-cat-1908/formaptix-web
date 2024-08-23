<script setup lang="ts">
import { makeAPIRequest } from '@/utils/http'
import { useAuthStore } from '@/stores/auth'

import { ref } from 'vue'
import router from '@/router'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const authError = ref('')

async function submitForm() {
  const data = await makeAPIRequest(
    '/user/login',
    'POST',
    {},
    { username: username.value, password: password.value }
  )

  if (data.status === 200) {
    authError.value = ''
    localStorage.setItem('auth_token', data.json.token)
    authStore.authDialogOpened = false
    await authStore.prepareStore()
    await router.push('/')
  } else {
    authError.value = 'Авторизация не удалась.'
  }
}
</script>

<template>
  <div v-if="authStore.authDialogOpened">
    <button @click="authStore.authDialogOpened = false">x</button>
    <form @submit.prevent="submitForm">
      <div>
        <div>Имя пользователя</div>
        <input type="text" id="username" v-model="username" placeholder="Введи имя пользователя" />
      </div>
      <div>
        <div>Пароль</div>
        <input type="password" id="password" v-model="password" placeholder="Введи пароль" />
      </div>
      <p v-if="authError.length > 0">{{ authError }}</p>
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<style scoped></style>
