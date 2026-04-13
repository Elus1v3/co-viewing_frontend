import { createRouter, createWebHistory } from 'vue-router'
import SignInUp from '../views/SignUp.vue'
import SignUp from '../views/SignUp.vue'
import SignIn from '@/views/SignIn.vue'
import Home from '@/views/Home.vue'
import WatchScreen from '@/views/WatchScreen.vue'
import Friends from '@/views/Friends.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
    },
    {
      path: '/watch',
      name: 'watch',
      component: WatchScreen,
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends
    }
    
  ],
})

export default router
