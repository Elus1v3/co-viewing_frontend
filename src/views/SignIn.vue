<script setup lang="ts">
import { useRouter } from 'vue-router';
import btn from '@/components/btn.vue';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()

const nickname = ref('')
const password = ref('')

const SignIn = () => {
  userStore.signIn(nickname.value, password.value)
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
                     p-5 outline-none hover:animate-bounce" placeholder="Enter nickname">
      </div>
      <div class="flex justify-center items-center">
        <h4 class="m-5 w-20 text-right text-lg">Password</h4>
        <input v-model="password" type="text" class="bg-[#e7b4ff] m-5 w-100 h-10 text-[#500075] rounded-[50px] 
                     p-5 outline-none hover:animate-bounce" placeholder="Enter password">
      </div>
        
        
      <div v-if="userStore.error" class="flex items-center mb-4 w-fit mx-auto h-[40px] p-[10px] bg-red-500 bg-opacity-20 text-white rounded-full text-sm">
        {{ userStore.error }}
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
