<script setup lang="ts">
import { getTitle } from '@/utils/env'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="container">
        <h1>{{ getTitle() }}</h1>
        <div v-if="authStore.isAuthorized">
          <button type="button">
            {{ authStore.user.username }}
          </button>
          <button type="button" @click="authStore.logout">leave</button>
        </div>
        <div v-else>
          <button type="button" @click="authStore.authDialogOpened = !authStore.authDialogOpened">
            Войти
          </button>
        </div>
      </div>
    </div>
  </header>


</template>

<style scoped></style>
