<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router'

import { useAuthStore } from '@/stores/auth'
import { makeAPIRequest } from '@/utils/http'

const authStore = useAuthStore()
const userForms = ref([])

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
</script>

<template>
  <div v-for="(form, index) in userForms" v-if="userForms.length > 0">
    <h3>{{ form.data.name }}</h3>
    <button @click="$router.push('/form/view/' + form.id)">view</button>
    <button @click="$router.push('/form/update/' + form.id)">upd</button>
    <button @click="deleteForm(index)">del</button>
  </div>
  <div v-else>
    <h1>Формы не найдены.</h1>
  </div>
</template>

<style scoped></style>
