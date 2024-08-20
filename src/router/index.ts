import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/Index.vue"),
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        top: 120,
        el: to.hash,
      };
    } else {
      return {
        top: 0,
      };
    }
  },
});

export default router;