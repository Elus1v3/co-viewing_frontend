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
    const currentMovie = ref<Movie>()

    const movies = ref<Movie[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)




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
                console.error('Error fetching movies:', err)
            } finally {
                loading.value = false
        }
    }

    function setCurrentMovie(movie: Movie) {
        currentMovie.value = movie
    }

    return { 
        currentMovie, 
        movies, 
        loading, 
        error, 
        getAllMovies,
        setCurrentMovie
    }
})