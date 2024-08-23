<script setup lang="ts">
import { makeAPIRequest } from '@/utils/http'
import { useAuthStore } from '@/stores/auth'

import { ref } from 'vue'
import router from '@/router'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const authError = ref('')

import { PhX, PhXCircle } from '@phosphor-icons/vue'

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
    <div class="login">
      <div class="login-bg"></div>
      <div class="login-space">
        <div class="login-card">
          <div class="login-card-title">
            <h3 class="login-card-title--text">Войти в аккаунт</h3>
            <button @click="authStore.authDialogOpened = false">
              <PhX class="login-card-title--btn" :size="30" />
            </button>
          </div>
          <form @submit.prevent="submitForm" class="login-form">
            <div class="login-form-part">
              <div class="login-form-title">Имя пользователя</div>
              <input
                class="login-form-input"
                type="text"
                id="username"
                v-model="username"
                placeholder="Введи имя пользователя"
              />
            </div>
            <div class="login-form-part">
              <div class="login-form-title">Пароль</div>
              <input
                class="login-form-input"
                type="password"
                id="password"
                v-model="password"
                placeholder="Введи пароль"
              />
            </div>
            <p v-if="authError.length > 0" class="login-form-error">
              <PhXCircle :size="23" />{{ authError }}
            </p>
            <button type="submit" class="default-button login-form-submit">Войти</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  &-space {
    position: fixed;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  &-bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100vh;
    z-index: 100;
  }

  &-card {
    width: 400px;
    padding: 30px;
    background: var(--color-main-background);
    border-radius: 1rem;

    &-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;

      &--btn {
        color: var(--color-red);
        transition: 0.25s ease;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }

  &-form {
    display: flex;
    flex-direction: column;
    gap: 15px 0;

    &-error {
      color: var(--color-red);
      display: flex;
      align-items: center;
      gap: 0 13px;
    }

    &-title {
      font-weight: 400;
      margin-bottom: 7px;
    }

    &-input {
      width: 100%;
      background: var(--color-input-background);
      border: 1px solid var(--color-main-border);
      padding: 10px 20px;
      font-weight: 200;
      border-radius: 0.5rem;
      outline: 0;
      transition: 0.25s ease;

      &:hover {
        border: 1px solid var(--color-secondary-border);
      }

      &:focus {
        border: 1px solid var(--color-third-border);
        background: var(--color-secondary-background);
      }
    }

    &-submit {
      margin-top: 15px;
      padding: 15px;
      border-radius: 1rem;
      background: var(--color-main);
      color: var(--color-alternative-text);

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
