<script setup lang="ts">
// @ts-nocheck

import { getTitle } from '@/utils/env'
import { useAuthStore } from '@/stores/auth'

import {PhFilePlus, PhFloppyDisk, PhList, PhRowsPlusBottom} from '@phosphor-icons/vue'
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
  <div class="control">
    <div class="control-wrapper">
      <div class="control-card">
        <button @click="showCreateDialog = true" class="control-card-button"><PhRowsPlusBottom :size="30" /></button>
        <button @click="pages.push({ text: null, questions: [] })" class="control-card-button"><PhFilePlus :size="30" /></button>
        <button @click="submitSave" class="control-card-button"><PhFloppyDisk :size="30" /></button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.control {
  display: none;
  position: fixed;
  bottom: 0;
  z-index: 10000;
  width: 100%;

  @media (max-width: 660px) {
    display: block;
  }

  &-card {
    width: 100%;
    padding: 25px 30px;
    display: flex;
    justify-content: space-around;
    gap: 0 50px;
    background: var(--color-secondary-background);
    box-shadow: 0 -10px 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
