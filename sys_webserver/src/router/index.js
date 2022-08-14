import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// const NotFound = { template: "<div>not found</div>" };

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
  {
    path: '/product-description',
    name: 'Product Description',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProductDescription.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp.vue')
  },
  {
    path: '/activate-account',
    name: 'Activate Account',
    component: () => import(/* webpackChunkName: "about" */ '../views/ActivateAccount.vue')
  },
  {
    path: '/email-activation',
    name: 'Email Activation',
    component: () => import(/* webpackChunkName: "about" */ '../views/EmailActivation.vue')
  },
  {
    path: '/account-created',
    name: 'Account Created',
    component: () => import(/* webpackChunkName: "about" */ '../views/AccountCreated.vue')
  },
  {
    path: '/login',
    name: 'Log In',
    component: () => import(/* webpackChunkName: "about" */ '../views/LogIn.vue')
  },
  // { path: "*", component: NotFound }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
