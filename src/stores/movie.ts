import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Movie {
  id: string
  primaryTitle: string
  originalTitle: string
  primaryImage: {
    url: string
    width: number
    height: number
  }
  startYear?: number
  genres?: string[]
  rating: {
    aggregateRating: number
  }
  plot: string
}

export const useMovieStore = defineStore('movie', () => {
  const currentMovie = ref<Movie | null>(null)

  const movies = ref<Movie[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)


  const selectedGenres = ref<string[]>([])

  async function getAllMovies() {
    try {
      loading.value = true
      error.value = null

      const response = await fetch('https://api.imdbapi.dev/titles?types=MOVIE')

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()
      movies.value = data.titles || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function setCurrentMovie(movie: Movie) {
    currentMovie.value = movie
  }

  function toggleGenre(genre: string) {
    const i = selectedGenres.value.indexOf(genre)
    if (i >= 0) {
      selectedGenres.value.splice(i, 1)
    } else {
      selectedGenres.value.push(genre)
    }
  }

  const allGenres = computed(() => {
    const set = new Set<string>()
    movies.value.forEach(m => m.genres?.forEach(g => set.add(g)))
    return Array.from(set)
  })

  const filteredMovies = computed(() => {
    if (selectedGenres.value.length === 0) return movies.value

    return movies.value.filter(movie =>
      movie.genres?.some(g => selectedGenres.value.includes(g))
    )
  })

  return {
    currentMovie,
    movies,
    loading,
    error,
    getAllMovies,
    setCurrentMovie,
    selectedGenres,
    toggleGenre,
    allGenres,
    filteredMovies
  }
})