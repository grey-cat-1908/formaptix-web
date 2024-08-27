import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useFormViewStore = defineStore('formView', () => {
  const error = ref('');

  return { error }
})
