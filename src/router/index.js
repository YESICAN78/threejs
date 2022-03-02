import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "about",
    component: () =>
      import( /* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () =>
      import( /* webpackChunkName: "about" */ "../views/Home.vue"),
  },

];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;