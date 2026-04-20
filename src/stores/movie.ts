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
  const searchQuery = ref('')


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

  async function searchMovies(query: string) {
    try {
        loading.value = true
        error.value = null

        const res = await fetch(
        `https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(query)}&limit=50`
        )

        if (!res.ok) {
        throw new Error('Failed to search movies')
        }

        const data = await res.json()
        const shortList = data.titles || data.results || []

        
        const validList = shortList.filter((m: any) => m?.id)

        
        const fullMovies = await Promise.all(
        validList.map(async (m: any) => {
            const r = await fetch(`https://api.imdbapi.dev/titles/${m.id}`)

            if (!r.ok) {
            return null
            }

            return await r.json()
        })
        )

        
        movies.value = fullMovies.filter(Boolean) as Movie[]
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
        loading.value = false
    }
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
    filteredMovies,
    searchQuery,
    searchMovies
  }
})