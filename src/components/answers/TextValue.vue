<template>
  <div class="text-question-component">
    <input type="text" :value="modelValue" readonly />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['modelValue'])
</script>

<style scoped>
.text-question-component {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>
