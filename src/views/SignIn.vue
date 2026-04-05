<script setup lang="ts">
import { useRouter } from 'vue-router';
import btn from '@/components/btn.vue';
import { ref } from 'vue';


const router = useRouter()

const nickname = ref('')
const password = ref('')

const loading = ref(false)
const error = ref<string | null>(null)


const SignIn = async () => {
  
  if (!nickname.value || !password.value) {
    error.value = 'Заполните все поля'
    return
  }

  try {
    loading.value = true
    error.value = null

    const apiUrl = import.meta.env.VITE_API_URL

    const response = await fetch(`${apiUrl}/api/co-viewing/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: nickname.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    router.push('/')
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    console.error('Registration error:', err)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="bg-gray-900 w-screen h-screen flex items-center justify-center">
    <div class="p-4 bg-gray-800 text-white rounded-[50px] flex justify-center border
              border-gray-600 flex-col opacity-90 hover:opacity-100 transition-opacity 
                duration-[0.4s] ease">
      <h6 class="flex justify-center text-3xl m-[5px]">Sign In</h6>

      <div class="flex justify-center items-center">
        <h4 class="m-5 w-20 text-right text-lg">Nickname</h4>
        <input v-model="nickname" type="text" class="bg-[#e7b4ff] m-5 w-100 h-10 text-[#500075] rounded-[50px] 
                     p-5 outline-none hover:animate-bounce">
      </div>
      <div class="flex justify-center items-center">
        <h4 class="m-5 w-20 text-right text-lg">Password</h4>
        <input v-model="password" type="text" class="bg-[#e7b4ff] m-5 w-100 h-10 text-[#500075] rounded-[50px] 
                     p-5 outline-none hover:animate-bounce">
      </div>
        
        
      <div v-if="error" class="flex items-center mb-4 w-fit mx-auto h-[40px] p-[10px] bg-red-500 bg-opacity-20 text-white rounded-full text-sm">
        {{ error }}
      </div>
      <btn @click="SignIn">Sign In</btn>
      <div class="flex flex-row justify-center m-[5px]">
        <p>
          You haven't an account?
        </p>
        <router-link to="/signup" class="text-[#7ed2ea] hover:underline ml-1 cursor-pointer">
          Sign up
        </router-link>
      </div>
    </div>
  </div>
  
</template>
