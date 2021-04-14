import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'
import Account from '../views/Account.vue'
import Silent from '../views/auth/silent'
import Callback from '../views/auth/callback'
import Logout from '../views/auth/logout'
import DatasetIds from '../views/DatasetIds'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home'
  },
  {
    path: '/:datasetIds',
    name: 'datasetIds',
    component: DatasetIds
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/account',
    name: 'account',
    component: Account
  },
  {
    path: '/auth/silent',
    component: Silent
  }, {
    path: '/auth/callback',
    component: Callback
  }, {
    path: '/auth/logout',
    component: Logout
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
