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
    path: '/demo',
    name: 'demo',
    component: () => import('../views/demo.vue')
  },
  {
    path: '/size',
    name: 'size',
    component: () => import('../views/size.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
