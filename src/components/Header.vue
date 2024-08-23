<script setup lang="ts">
import { getTitle } from '@/utils/env'
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="container">
        <h1 class="">{{ getTitle() }}</h1>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
