import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Index.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue')
    },
    {
      path: '/form/view/:id',
      name: 'View Form',
      component: () => import('@/views/form/View.vue')
    },
    {
      path: '/form/answers/:id',
      name: 'Form Answers',
      component: () => import('@/views/form/Answers.vue')
    },
    {
      path: '/form/create',
      name: 'Create Form',
      component: () => import('@/views/form/Create.vue')
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        top: 120,
        el: to.hash
      }
    } else {
      return {
        top: 0
      }
    }
  }
})

export default router
