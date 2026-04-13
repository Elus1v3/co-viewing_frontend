import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export interface Friend {
  id: number
  nickname: string
}

export const useFriendStore = defineStore('friend', () => {
  const users = ref<Friend[]>([]) 
  const incomingRequests = ref<Friend[]>([]) 
  const loading = ref(false)
  const error = ref<string | null>(null)

  const userStore = useUserStore()

  const apiUrl = import.meta.env.VITE_API_URL

  const fetchUsers = async () => {
    try {
      loading.value = true
      const res = await fetch(`${apiUrl}/api/co-viewing/users`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      users.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error'
    } finally {
      loading.value = false
    }
  }

  const sendFriendRequest = async (friendId: number) => {
    try {
      loading.value = true

      await fetch(`${apiUrl}/api/co-viewing/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userStore.currentUser?.id,
          friend_id: friendId,
        }),
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error'
    } finally {
      loading.value = false
    }
  }

  const fetchIncomingRequests = async () => {
    try {
      loading.value = true

      const res = await fetch(
        `${apiUrl}/api/co-viewing/friends/${userStore.currentUser?.id}`
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      incomingRequests.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error'
    } finally {
      loading.value = false
    }
  }

  const acceptFriendRequest = async (friendId: number) => {
    try {
      loading.value = true


      await fetch(`${apiUrl}/api/co-viewing/friends`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: friendId,
          friend_id: userStore.currentUser?.id,
        }),
      })

      

      await fetchIncomingRequests()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error'
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    incomingRequests,
    loading,
    error,
    fetchUsers,
    sendFriendRequest,
    fetchIncomingRequests,
    acceptFriendRequest,
  }
})