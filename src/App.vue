<template>
  <div class="root" id="root">
    <Auth />
    <Header />
    <router-view v-slot="{ Component, route }">
      <div class="layout">
        <transition name="page" mode="out-in">
          <component :is="Component" v-if="authStore.isReady" :key="route.fullPath" />
        </transition>
      </div>
    </router-view>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import Header from '@/components/Header.vue'
import Auth from '@/components/Auth.vue'

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition-timing-function: ease;
  transition-delay: 15ms;
  transition-duration: 0.15s;
  transition-property: opacity;
  overflow: hidden;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
.root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}
</style>
