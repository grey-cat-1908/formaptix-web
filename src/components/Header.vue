<script setup lang="ts">
import { getTitle } from '@/utils/env'
import { useAuthStore } from '@/stores/auth'

import { PhList } from '@phosphor-icons/vue'
import { ref } from 'vue'
import router from '@/router'

const authStore = useAuthStore()

const isToggled = ref(false)

async function logout() {
  authStore.logout()
  await router.push('/')
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="container">
        <div class="header-column header--toggleview">
          <div class="header-title">
            <h2>{{ getTitle() }}</h2>
          </div>
          <PhList :size="32" class="header-toggle-btn" @click="isToggled = !isToggled" />
        </div>
        <div class="header-column header--toggled" :class="{ active: isToggled }">
          <div v-if="authStore.isAuthorized" class="header-authed">
            <button class="header-nickname" type="button" @click="$router.push('/profile')">
              {{ authStore.user.username }}
            </button>
            <button class="default-button header-leave-btn" type="button" @click="logout">
              Выйти
            </button>
          </div>
          <div v-else>
            <button
              class="default-button header-login-btn"
              type="button"
              @click="authStore.authDialogOpened = !authStore.authDialogOpened"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  //background: red;
  border-bottom: 2px solid var(--color-main-border);
  padding: 17px 0;

  & .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
  }

  &-login-btn,
  &-leave-btn {
    border-radius: 1rem;
    padding: 10px 30px;
  }

  &-leave-btn {
    color: var(--color-red);
  }

  &-nickname {
    margin-right: 20px;
    transition: 0.25s ease;

    &:hover {
      color: var(--color-subtext);
    }
  }

  &-toggle-btn {
    display: none;
  }

  @media (max-width: 500px) {
    &-toggle-btn {
      display: block;
      cursor: pointer;
    }

    &--toggleview {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    & .container {
      flex-direction: column;
      gap: 20px 0;
    }

    &-login-btn {
      display: block;
      width: 100%;
    }

    &--toggled {
      display: none;

      &.active {
        width: 100%;
        display: block;
      }
    }

    &-authed {
      display: flex;
      flex-direction: column;
      gap: 10px 0;
    }
    &-nickname {
      margin-right: 0;
    }
  }
}
</style>
