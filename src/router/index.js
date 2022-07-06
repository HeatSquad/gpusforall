import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue')
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import(/* webpackChunkName: "about" */ '../views/Wishlist.vue')
  },
<<<<<<< HEAD
=======
  {
    path: '/product-description',
    name: 'Product Description',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProductDescription.vue')
  },
<<<<<<< HEAD
>>>>>>> 68c0c22a663d43a47506868515063dd323fb6155
=======
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp.vue')
  },
>>>>>>> f535827bb40e5541af033bbf37d1a622e59f1385
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
