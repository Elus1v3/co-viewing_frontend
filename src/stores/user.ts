import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export interface UserId {
  id: number
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<UserId | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const router = useRouter()

  const signUp = async (nickname: string, password: string) => {
    if (!nickname || !password) {
      error.value = 'Заполните все поля'
      return
    }

    try {
      loading.value = true
      error.value = null

      const apiUrl = import.meta.env.VITE_API_URL

      const response = await fetch(`${apiUrl}/api/co-viewing/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      currentUser.value = {
        id: data.id
      }

      router.push('/')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Registration error:', err)
    } finally {
      loading.value = false
    }
  }

  const signIn = async (nickname: string, password: string) => {
    if (!nickname || !password) {
      error.value = 'Заполните все поля'
      return
    }

    try {
      loading.value = true
      error.value = null

      const apiUrl = import.meta.env.VITE_API_URL

      const response = await fetch(`${apiUrl}/api/co-viewing/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      currentUser.value = {
        id: data.id
      }


      router.push('/')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Login error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    currentUser,
    loading,
    error,
    signUp,
    signIn,
  }
})