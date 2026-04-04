<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const SignUp = () => {
  router.push('/')
}


</script>

<template>
  <div class="bg-gray-900 w-screen h-screen flex items-center justify-center">
    
    <div class="p-4 bg-gray-800 text-white rounded-[50px] flex justify-center border
              border-gray-600 flex-col opacity-90 hover:opacity-100 transition-opacity 
                duration-[0.4s] ease">
      <h6 class="flex justify-center text-3xl m-[5px]">Sign Up</h6>
      <div class="flex justify-center items-center">
        <h4 class="m-5 w-15 text-right text-lg">Mail</h4>
        <input type="text" class="bg-[#e7b4ff] m-5 w-100 h-10 text-[#500075] rounded-[50px] 
                     p-5 outline-none hover:animate-bounce">
      </div>

      <div class="flex justify-center items-center">
        <h4 class="m-5 w-15 text-right text-lg">Password</h4>
        <input type="text" class="bg-[#e7b4ff] m-5 w-100 h-10 text-[#500075] rounded-[50px] 
                     p-5 outline-none hover:animate-bounce">
      </div>
        
      <button @click="SignUp" class=" mt-20 mx-30 mb-5 bg-[#7ed2ea] text-[#003641] h-10 rounded-[50px] 
                     cursor-pointer hover:animate-pulse">Sign up</button>
      <div class="flex flex-row justify-center m-[5px]">
        <p>
          You have an account?
        </p>
        <router-link to="/signin" class="text-[#7ed2ea] hover:underline ml-1 cursor-pointer">
          Sign in
        </router-link>
      </div>
      
    </div>
  </div>
  
</template>
