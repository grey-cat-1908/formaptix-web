import { ref } from 'vue'
import { defineStore } from 'pinia'
// @ts-ignore
import { makeAPIRequest } from '@/utils/http'

export const useAuthStore = defineStore('auth', () => {
  const isReady = ref(false)
  const authDialogOpened = ref(false)
  const isAuthorized = ref(false)

  const user = ref({
    id: 0,
    username: ''
  })

  const prepareStore = async () => {
    isReady.value = false
    if (localStorage.getItem('auth_token')) {
      const data = await makeAPIRequest('/user/get', 'POST', {}, {}, true)
      if (data.status !== 200) {
        localStorage.removeItem('auth_token')
        isReady.value = true
        return (isAuthorized.value = false)
      } else {
        isAuthorized.value = true
        user.value = {
          id: data.json.id,
          username: data.json.username
        }
      }
    } else {
      isAuthorized.value = false
    }
    isReady.value = true
  }

  const logout = () => {
    isReady.value = false
    localStorage.removeItem('auth_token')
    isAuthorized.value = false
    authDialogOpened.value = false
    user.value = {
      id: 0,
      username: ''
    }
    isReady.value = true
  }

  prepareStore()
  return { authDialogOpened, isReady, isAuthorized, user, prepareStore, logout }
})
