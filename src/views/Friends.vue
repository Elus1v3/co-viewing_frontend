<script setup lang="ts">
import router from '@/router'
import { useMovieStore } from '@/stores/movie'
import { storeToRefs } from 'pinia'
import { useFriendStore } from '@/stores/friend'
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const activeIndex = ref(-1)
const buttonRefs = ref<(HTMLButtonElement | null)[]>([])

const getButtonStyle = (index: number) => {
  if (buttonRefs.value[index]) {
    const button = buttonRefs.value[index]
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


const friendStore = useFriendStore()
const userStore = useUserStore()

const search = ref('')


const showResults = computed(() => search.value.trim().length > 0)

const filteredUsers = computed(() => {
  return friendStore.users.filter(u => {
    const matches = u.nickname
      .toLowerCase()
      .includes(search.value.toLowerCase())

    const notMe = u.id !== userStore.currentUser?.id

    return matches && notMe
  })
})

onMounted(() => {
  friendStore.fetchUsers()
  friendStore.fetchIncomingRequests()
})

</script>

<template>
  <div class="bg-gray-900 min-h-screen w-full relative inset-0">
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
                z-10" @mouseenter="activeIndex = 1">
            History
        </button>

        <button :ref="el => buttonRefs[2] = el as HTMLButtonElement" class="relative
                px-6 py-2 text-[#e7b4ff] transition-colors 
                z-10" @mouseenter="activeIndex = 2">
            Friends
        </button>
    

      </nav>
    </header>

   <div class="pt-50 text-white px-100">
    <input v-model="search" type="text" class="bg-[#e7b4ff] w-100 h-10 text-[#500075] rounded-[50px] 
                     p-5 outline-none hover:animate-bounce" placeholder="Search user...">


  <div v-if="showResults">
    <div
      v-for="user in filteredUsers"
      :key="user.id"
      class="flex justify-between mb-2"
    >
      <span>{{ user.nickname }}</span>
      <button
        @click="friendStore.sendFriendRequest(user.id)"
        class="bg-purple-500 px-2 py-1 rounded"
      >
        Add
      </button>
    </div>


    <div v-if="filteredUsers.length === 0" class="text-gray-400">
      No users found
    </div>
  </div>


  <h2 class="mt-6 text-xl">Requests</h2>

  <div
    v-for="user in friendStore.incomingRequests"
    :key="user.id"
    class="flex justify-between mt-2"
  >
    <span>{{ user.nickname }}</span>
    <button
      @click="friendStore.acceptFriendRequest(user.id)"
      class="bg-green-500 px-2 py-1 rounded"
    >
      Accept
    </button>
  </div>

</div>
  </div>

  
  
</template>
