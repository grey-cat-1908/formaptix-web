import { ref } from 'vue'
import { defineStore } from 'pinia'
// @ts-ignore
import { makeAPIRequest } from '@/utils/http'

export const useAuthStore = defineStore('auth', () => {
  const authDialogOpened = ref(false)
  const isAuthorized = ref(false)

  const user = ref({
    id: 0,
    username: ''
  })

  const prepareStore = async () => {
    if (localStorage.getItem('auth_token')) {
      const data = await makeAPIRequest('/user/get', 'POST', {}, {}, true)
      if (data.status !== 200) {
        localStorage.removeItem('auth_token')
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
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    isAuthorized.value = false
    authDialogOpened.value = false
    user.value = {
      id: 0,
      username: ''
    }
  }

  prepareStore()
  return { authDialogOpened, isAuthorized, user, prepareStore, logout }
})
