import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export interface Friend {
  id: number
  nickname: string
  status?: string 
}

export const useFriendStore = defineStore('friend', () => {
  const users = ref<Friend[]>([]) 
  const incomingRequests = ref<Friend[]>([]) 
  const friends = ref<Friend[]>([]) 
  const outgoingRequests = ref<Friend[]>([]) 
  const loading = ref(false)
  const userStore = useUserStore()
  const apiUrl = import.meta.env.VITE_API_URL

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/co-viewing/users`)
      if (res.ok) users.value = await res.json()
    } catch (err) {
      console.error(err)
    }
  }

  const resetFriendState = () => {
    incomingRequests.value = []
    friends.value = []
  }

  const fetchFriends = async () => {
    if (!userStore.currentUser?.id) return

    try {
      loading.value = true


      resetFriendState()

      const userId = userStore.currentUser.id

      const [reqRes, friendsRes] = await Promise.all([
        fetch(`${apiUrl}/api/co-viewing/friends/${userId}`),
        fetch(`${apiUrl}/api/co-viewing/friends/${userId}/list`)
      ])

      if (reqRes.ok) {
        const data = await reqRes.json()
        incomingRequests.value = Array.isArray(data) ? data : []
      }

      if (friendsRes.ok) {
        const data = await friendsRes.json()
        friends.value = Array.isArray(data) ? data : []
      }

    } finally {
      loading.value = false
    }
  }

  const sendFriendRequest = async (friendId: number) => {
    const targetUser = users.value.find(u => u.id === friendId)
    const alreadyRequested = outgoingRequests.value.some(u => u.id === friendId)
    if (targetUser && !alreadyRequested) {
      outgoingRequests.value.push({ ...targetUser, status: 'pending' })
    }

    try {
      const res = await fetch(`${apiUrl}/api/co-viewing/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userStore.currentUser?.id,
          friend_id: friendId,
        }),
      })
      if (res.ok) {
        await fetchFriends()
      } else {
        outgoingRequests.value = outgoingRequests.value.filter(u => u.id !== friendId)
      }
    } catch (err) {
      outgoingRequests.value = outgoingRequests.value.filter(u => u.id !== friendId)
      console.error(err)
    }
  }

  const acceptFriendRequest = async (friendId: number) => {
    try {
      const res = await fetch(`${apiUrl}/api/co-viewing/friends`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: friendId,
          friend_id: userStore.currentUser?.id,
        }),
      })
      if (res.ok) await fetchFriends()
    } catch (err) { console.error(err) }
  }

  const deleteFriend = async (friendId: number) => {
  
    friends.value = friends.value.filter(f => f.id !== friendId)
    outgoingRequests.value = outgoingRequests.value.filter(f => f.id !== friendId)
    
    try {
      const res = await fetch(`${apiUrl}/api/co-viewing/friends`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userStore.currentUser?.id,
          friend_id: friendId,
        }),
      })
      if (res.ok) await fetchFriends()
    } catch (err) { console.error(err) }
  }

  return {
    users, incomingRequests, friends, outgoingRequests, loading,
    fetchUsers, fetchFriends, sendFriendRequest, acceptFriendRequest, deleteFriend
  }
})