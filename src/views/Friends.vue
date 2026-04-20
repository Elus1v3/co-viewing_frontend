<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFriendStore } from '@/stores/friend'
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const friendStore = useFriendStore()
const userStore = useUserStore()

const search = ref('')
const isOpen = ref(false) 
const activeIndex = ref(-1)
const buttonRefs = ref<(HTMLButtonElement | null)[]>([])

const showResults = computed(() => search.value.trim().length > 0)

const filteredUsers = computed(() => {
  if (!search.value.trim()) return []
  return friendStore.users.filter(u => {
    const matchesNickname = u.nickname.toLowerCase().includes(search.value.toLowerCase())
    const isNotMe = u.id !== userStore.currentUser?.id
    return matchesNickname && isNotMe
  })
})

const isFriend = (id: number) => {

  return friendStore.friends.some(f => f.id === id)
}

const isSent = (id: number) => {
  return !isIncoming(id) && friendStore.outgoingRequests.some(r => r.id === id)
}

const isIncoming = (id: number) => {
  return friendStore.incomingRequests.some(r => r.id === id)
}


onMounted(async () => {
  await friendStore.fetchUsers()
  if (userStore.currentUser?.id) {
    await friendStore.fetchFriends()
  }
})

const getButtonStyle = (index: number) => {
  const button = buttonRefs.value[index]
  if (button) {
    const nav = button.parentElement
    if (nav) {
      const navRect = nav.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      return {
        left: `${buttonRect.left - navRect.left}px`,
        width: `${buttonRect.width}px`
      }
    }
  }
  return { left: '0px', width: '0px' }
}

const goToSignUp = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="bg-gray-900 min-h-screen w-full text-white">
    <header class="fixed top-0 left-0 right-0 h-30 bg-gray-900 bg-opacity-90 z-50 flex 
                   items-center justify-center">
      
      <div class="absolute left-[5px]">
        <img src="../assets/logo.png" alt="logo" class="w-[150px] h-auto mt-[5px]">
      </div>
      

      <nav class="relative flex gap-4 mt-[5px] py-[5px] px-[5px] 
                bg-[rgba(188,113,228,0.1)] rounded-[9999px] w-fit items-center" 
                  @mouseleave="activeIndex = -1">
    

        <div v-if="activeIndex !== -1" class="absolute top-[5px] 
             bottom-[5px] bg-[rgba(188,113,228,0.15)] border-none
           border-[#e7b4ff] rounded-[9999px] transition-all duration-300 
             pointer-events-none" :style="getButtonStyle(activeIndex)">
        </div>
    

        <button :ref="el => buttonRefs[0] = el as HTMLButtonElement"class="
                relative px-6 py-2 text-[#e7b4ff]
                transition-colors z-10" @mouseenter="activeIndex = 0" @click="router.push('/')">
            Home
        </button>
    
        <button :ref="el => buttonRefs[1] = el as HTMLButtonElement" class="relative
                px-6 py-2 text-[#e7b4ff] transition-colors 
                z-10" @mouseenter="activeIndex = 1" @click="router.push('/history')">
            History
        </button>

        <button :ref="el => buttonRefs[2] = el as HTMLButtonElement" class="relative
                px-6 py-2 text-[#e7b4ff] transition-colors 
                z-10" @mouseenter="activeIndex = 2" @click="router.push('/friends')">
            Friends
        </button>
    

      </nav>
      <div id="user-menu-button" class="bg-[rgba(188,113,228,0.15)] absolute right-10 flex justify-center items-center 
           w-[50px] h-[50px] rounded-full cursor-pointer mt-[5px]" @click="isOpen = !isOpen">
        <span class="material-symbols-rounded text-[#e7b4ff] rounded-full">
          account_circle
        </span>
      </div>

      
      <button v-if="isOpen" @click="goToSignUp" class="bg-[#7ed2ea] text-[#003641] h-10 rounded-[50px] 
              cursor-pointer hover:animate-pulse absolute right-10 w-[50px] mt-25">
        Exit
      </button>
      
    </header>

    <main class="pt-35 px-10 max-w-6xl mx-auto">
      <div class="mb-12">
        <input v-model="search" type="text" class="bg-[#e7b4ff] w-100 h-10 text-[#500075] rounded-[50px] 
                     p-5 outline-none hover:animate-bounce" placeholder="Enter password">
        
        <div v-if="showResults" class="mt-4 bg-gray-800/50 p-4 rounded-2xl border border-purple-500/20">
          <div v-for="user in filteredUsers" :key="user.id" class="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
            <span>{{ user.nickname }}</span>
              <div class="flex gap-2">
                <button v-if="isFriend(user.id)" @click="friendStore.deleteFriend(user.id)" 
                        class="text-gray-500 hover:text-red-500 transition flex justify-center">
                  <span class="material-symbols-rounded">person_remove</span>
                </button>

                <span v-else-if="isSent(user.id)" 
                      class="text-purple-300 text-sm italic py-2">
                  Sended
                </span>

                <span v-else-if="isIncoming(user.id)" 
                      class="text-[#7ed2ea] text-sm italic py-2">
                  Check Requests
                </span>

                
                <button v-else @click="friendStore.sendFriendRequest(user.id)" 
                        class="text-gray-500 hover:text-green-500 transition flex justify-center">
                  <span class="material-symbols-rounded">person_add</span>
                </button>
              </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section class="bg-gray-800/30 p-6 rounded-3xl border border-white/5">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-purple-300">
            <span class="material-symbols-rounded">notifications</span> Requests
          </h2>
          <div v-for="user in friendStore.incomingRequests" :key="user.id" 
               class="flex justify-between items-center bg-gray-900/40 p-4 rounded-xl mb-3">
            <span>{{ user.nickname }}</span>
            <button @click="friendStore.acceptFriendRequest(user.id)" 
                    class="text-gray-500 hover:text-green-500 transition flex justify-center">
              <span class="material-symbols-rounded">person_add</span>
            </button>
          </div>
          <p v-if="friendStore.incomingRequests.length === 0" class="text-gray-500 text-center py-4">No pending requests</p>
        </section>

        <section class="bg-gray-800/30 p-6 rounded-3xl border border-white/5">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-300">
            <span class="material-symbols-rounded">group</span> Friends
          </h2>
          <div v-for="friend in friendStore.friends" :key="friend.id" 
               class="flex justify-between items-center bg-gray-900/40 p-4 rounded-xl mb-3">
            <span>{{ friend.nickname }}</span>
            <button @click="friendStore.deleteFriend(friend.id)" 
                    class="text-gray-500 hover:text-red-500 transition flex justify-center">
              <span class="material-symbols-rounded">person_remove</span>
            </button>
          </div>
          <p v-if="friendStore.friends.length === 0" class="text-gray-500 text-center py-4">Your friends list is empty</p>
        </section>
      </div>
    </main>
  </div>
</template>