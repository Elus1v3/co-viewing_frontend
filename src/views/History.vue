<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import { useMovieStore } from '@/stores/movie'
import { useUserStore } from '@/stores/user'

const movieStore = useMovieStore()
const userStore = useUserStore()

interface Movie {
  id: string
  primaryTitle: string
  primaryImage?: {
    url: string
  }
  startYear?: number
  rating?: {
    aggregateRating: number
  }
  plot?: string
  genres?: string[]
}

const isOpen = ref(false)

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

const goToSignUp = () => {
  router.push('/signup')
}

const movies = ref<Movie[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const isEmpty = ref(false)


const fetchHistory = async (userId: number) => {
  try {
    loading.value = true
    error.value = null
    const apiUrl = import.meta.env.VITE_API_URL

    const res = await fetch(
      `http://${apiUrl}/api/co-viewing/movies/${userId}`
    )

    if (!res.ok) {
      throw new Error('Failed to fetch history')
    }

    const history = await res.json()

    if (!Array.isArray(history) || history.length === 0) {
      movies.value = []
      isEmpty.value = true
      return
    }

    const fullMovies = await Promise.all(
      history.map(async (item: any) => {
        const r = await fetch(
          `https://api.imdbapi.dev/titles/${item.movie_id}`
        )

        if (!r.ok) return null

        return await r.json()
      })
    )

    movies.value = fullMovies.filter(Boolean)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

/**
 * 🔥 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
 * берём ТЕКУЩЕГО пользователя из store
 */
watch(
  () => userStore.currentUser?.id,
  (id) => {
    if (id) {
      fetchHistory(id)
    } else {
      movies.value = []
    }
  },
  { immediate: true }
)

const goToWatch = (movie: any) => {
  movieStore.setCurrentMovie({
    id: movie.id,
    primaryTitle: movie.primaryTitle,
    originalTitle: movie.originalTitle || movie.primaryTitle,
    primaryImage: movie.primaryImage,
    startYear: movie.startYear,
    genres: movie.genres,
    rating: movie.rating,
    plot: movie.plot
  })

  router.push('/watch')
}
</script>

<template>
  <div class="bg-gray-900 min-h-screen w-full">

    <header class="fixed top-0 left-0 right-0 h-30 bg-gray-900 bg-opacity-90 z-50 flex items-center justify-center">

      <div class="absolute left-[5px]">
        <img src="../assets/logo.png" alt="logo" class="w-[150px] h-auto mt-[5px]">
      </div>

      <nav
        class="relative flex gap-4 mt-[5px] py-[5px] px-[5px] 
               bg-[rgba(188,113,228,0.1)] rounded-[9999px] w-fit items-center"
        @mouseleave="activeIndex = -1"
      >

        <div
          v-if="activeIndex !== -1"
          class="absolute top-[5px] bottom-[5px] bg-[rgba(188,113,228,0.15)] 
                 rounded-[9999px] transition-all duration-300 pointer-events-none"
          :style="getButtonStyle(activeIndex)"
        />

        <button
          :ref="el => buttonRefs[0] = el as HTMLButtonElement"
          class="relative px-6 py-2 text-[#e7b4ff] z-10"
          @mouseenter="activeIndex = 0"
          @click="router.push('/')"
        >
          Home
        </button>

        <button
          :ref="el => buttonRefs[1] = el as HTMLButtonElement"
          class="relative px-6 py-2 text-[#e7b4ff] z-10"
          @mouseenter="activeIndex = 1"
          @click="router.push('/history')"
        >
          History
        </button>

        <button
          :ref="el => buttonRefs[2] = el as HTMLButtonElement"
          class="relative px-6 py-2 text-[#e7b4ff] z-10"
          @mouseenter="activeIndex = 2"
          @click="router.push('/friends')"
        >
          Friends
        </button>

      </nav>

      <div
        class="bg-[rgba(188,113,228,0.15)] absolute right-10 flex justify-center items-center 
               w-[50px] h-[50px] rounded-full cursor-pointer mt-[5px]"
        @click="isOpen = !isOpen"
      >
        <span class="material-symbols-rounded text-[#e7b4ff]">
          account_circle
        </span>
      </div>

      <button
        v-if="isOpen"
        @click="goToSignUp"
        class="bg-[#7ed2ea] text-[#003641] h-10 rounded-[50px] 
               cursor-pointer absolute right-10 w-[50px] mt-25"
      >
        Exit
      </button>

    </header>

    <div class="pt-[120px] px-[100px]">
      <h1 class="text-[#BC71E4] text-3xl font-bold mb-6">
        Watch History
      </h1>
    </div>

    <div v-if="isEmpty" class="text-center text-[#7ed2ea] mt-10">
      You haven't watched any movies yet
    </div>

    <div v-if="loading" class="text-center text-[#7ed2ea]">
      Loading...
    </div>

    <div v-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <div
      v-if="!loading && !error"
      class="grid grid-cols-6 gap-4 px-[100px] pb-30 bg-gray-900"
    >

      <div
        v-for="movie in movies"
        :key="movie.id"
        class="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-90
               hover:rotate-3 border border-[#ffb3b2] cursor-pointer"
        @click="goToWatch(movie)"
      >

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

          <p class="text-[#7ed2ea] text-sm">
            {{ movie.startYear || 'N/A' }}
          </p>
        </div>

      </div>

    </div>

  </div>
</template>