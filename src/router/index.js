import Vue from 'vue'
import VueRouter from 'vue-router'
import Silent from '../views/auth/silent'
import Callback from '../views/auth/callback'
import Logout from '../views/auth/logout'
import DatasetIds from '../views/DatasetIds'
import LocationId from '../views/datasetIds/LocationId'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home'
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
  }, {
    path: '/:datasetIds',
    component: DatasetIds,
    children: [{
      path: ':locationId',
      component: LocationId
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
