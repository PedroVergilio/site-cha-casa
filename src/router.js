import { createRouter, createWebHistory } from 'vue-router'
import GiftList from './components/GiftList.vue'
import Admin from './components/Admin.vue'

const routes = [
  { path: '/', component: GiftList },
  { path: '/admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router