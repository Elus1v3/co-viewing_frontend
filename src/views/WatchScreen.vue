<script setup lang="ts">
import router from '@/router'
import { useMovieStore } from '@/stores/movie'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

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

const isOpen = ref(false)

const goToSignUp = () => {
  router.push('/signup')
}


const movieStore = useMovieStore()

const {currentMovie} = storeToRefs(movieStore) 

const playerUrl = ref(`https://vidsrc.icu/embed/movie/${currentMovie.value?.id}`);
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

    <div class="flex flex-col mt-10 w-full max-w-4xl mx-auto">
      <h2 class="text-2xl flex items-start pt-[120px] text-[#BC71E4]">
        {{ currentMovie?.originalTitle }}
      </h2>
      
      <div class="flex flex-row items-center justify-center">
        <img 
          :src="currentMovie?.primaryImage?.url || 'no image'" 
          class="w-[300px] h-[450px] mt-[10px] object-contain rounded-lg""
        >
        
        <p class="text-xl text-[#7ed2ea] text-center mx-[40px]">
          {{ currentMovie?.plot }}
        </p>

      </div>
      

      <div class="bg-[#ffb3b2] py-[5px] mt-[10px] w-fit flex justify-center items-center rounded-full px-[10px]">
        <span class="material-symbols-rounded text-[#5e151b]">
          star
        </span>
        <h1 class="text-base text-[#5e151b]  ml-[5px]">{{currentMovie?.rating.aggregateRating}}</h1>
      </div>
      
      <iframe 
        :src="playerUrl" 
        class="w-full h-[480px] rounded-[50px] shadow-lg mt-[10px] mb-[150px]"
        scrolling="no"
        allowfullscreen="true">
      </iframe>

      <div></div>
    </div>
  </div>

  
  
</template>
