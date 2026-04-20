<script setup lang="ts">
import { useMovieStore, type Movie } from '@/stores/movie'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import router from '@/router'

const activeIndex = ref(-1)
const buttonRefs = ref<(HTMLButtonElement | null)[]>([])

const getButtonStyle = (index: number) => {
  const button = buttonRefs.value[index]
  const nav = button?.parentElement

  if (!button || !nav) return { left: '0px', width: '0px' }

  const navRect = nav.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()

  return {
    left: `${buttonRect.left - navRect.left}px`,
    width: `${buttonRect.width}px`
  }
}

const isOpen = ref(false)
const showFilters = ref(false)

const goToSignUp = () => {
  router.push('/signup')
}

const movieStore = useMovieStore()


const {
  loading,
  error,
  filteredMovies,
  allGenres,
  selectedGenres
} = storeToRefs(movieStore)

const toggleGenre = (genre: string) => {
  movieStore.toggleGenre(genre)
}

onMounted(() => {
  movieStore.getAllMovies()
})

const goToWatchScreen = (movie: Movie) => {
  movieStore.setCurrentMovie(movie)
  router.push('/watch')
}
</script>

<template>
  <div class="bg-gray-900 min-h-screen w-full relative">

    <header class="fixed top-0 left-0 right-0 h-30 bg-gray-900 bg-opacity-90 z-50 flex 
                   items-center justify-center">

      <div class="absolute left-[5px]">
        <img src="../assets/logo.png" alt="logo" class="w-[150px] h-auto mt-[5px]">
      </div>

      <div class="bg-[rgba(188,113,228,0.15)] absolute right-205 flex justify-center items-center 
           w-[50px] h-[50px] rounded-full cursor-pointer mt-[5px]"
           @click="showFilters = !showFilters">
        <span class="material-symbols-rounded text-[#e7b4ff]">
          filter_alt
        </span>
      </div>

      <nav class="relative flex gap-4 mt-[5px] py-[5px] px-[5px] 
                bg-[rgba(188,113,228,0.1)] rounded-[9999px] w-fit items-center"
            @mouseleave="activeIndex = -1">

        <div v-if="activeIndex !== -1"
             class="absolute top-[5px] bottom-[5px] bg-[rgba(188,113,228,0.15)] 
                    rounded-[9999px] transition-all duration-300 pointer-events-none"
             :style="getButtonStyle(activeIndex)">
        </div>

        <button :ref="el => buttonRefs[0] = el as HTMLButtonElement"
                class="relative px-6 py-2 text-[#e7b4ff] z-10"
                @mouseenter="activeIndex = 0"
                @click="router.push('/')">
          Home
        </button>

        <button :ref="el => buttonRefs[1] = el as HTMLButtonElement"
                class="relative px-6 py-2 text-[#e7b4ff] z-10"
                @mouseenter="activeIndex = 1">
          History
        </button>

        <button :ref="el => buttonRefs[2] = el as HTMLButtonElement"
                class="relative px-6 py-2 text-[#e7b4ff] z-10"
                @mouseenter="activeIndex = 2"
                @click="router.push('/friends')">
          Friends
        </button>

      </nav>

      <div id="user-menu-button"
           class="bg-[rgba(188,113,228,0.15)] absolute right-10 flex justify-center items-center 
                  w-[50px] h-[50px] rounded-full cursor-pointer mt-[5px]"
           @click="isOpen = !isOpen">
        <span class="material-symbols-rounded text-[#e7b4ff]">
          account_circle
        </span>
      </div>

      <button v-if="isOpen"
              @click="goToSignUp"
              class="bg-[#7ed2ea] text-[#003641] h-10 rounded-[50px] 
                     cursor-pointer absolute right-10 w-[50px] mt-25">
        Exit
      </button>
    </header>

    
    <div v-if="showFilters"
         class="absolute top-[100px] right-155 bg-gray-800 p-4 rounded-lg shadow-lg z-50 w-[250px]">

      <div v-for="genre in allGenres" :key="genre" class="flex items-center gap-2 mb-2">
        <input type="checkbox"
               :checked="selectedGenres.includes(genre)"
               @change="toggleGenre(genre)" />
        <span class="text-white">{{ genre }}</span>
      </div>

    </div>


    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-[#7ed2ea] text-xl">Loading...</div>
    </div>


    <div v-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>


    <div v-if="!loading && !error"
         class="grid grid-cols-6 gap-4 px-[100px] pt-[150px] min-h-screen pb-30 bg-gray-900">

      <div v-for="movie in filteredMovies"
           :key="movie.id"
           class="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-90
                  hover:rotate-3 border border-[#ffb3b2] cursor-pointer"
           @click="goToWatchScreen(movie)">

        <div class="aspect-2/3">

          <img
            :src="movie.primaryImage?.url || 'https://via.placeholder.com/300x450?text=No+Image'"
            :alt="movie.primaryTitle"
            class="w-full h-full object-cover"
          />

        </div>

        <div class="p-4">
          <h3 class="text-[#BC71E4] text-lg font-bold truncate">
            {{ movie.primaryTitle }}
          </h3>

          <p class="text-[#7ed2ea] text-sm mb-2">
            {{ movie.startYear || 'N/A' }}
          </p>

          <div v-if="movie.genres" class="flex flex-wrap gap-1">
            <span v-for="genre in movie.genres"
                  :key="genre"
                  class="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
              {{ genre }}
            </span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>