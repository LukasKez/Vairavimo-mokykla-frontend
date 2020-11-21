import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/users',
    name: 'user-list',
    component: () => import('../views/UserList.vue')
  },
  {
    path: '/users/:id',
    name: 'user-info',
    component: () => import('../views/User.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
