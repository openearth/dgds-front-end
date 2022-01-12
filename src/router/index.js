import Vue from 'vue'
import VueRouter from 'vue-router'
import Silent from '../views/auth/silent'
import Editor from '../views/Editor.vue'
import Callback from '../views/auth/callback'
import Logout from '../views/auth/logout'
import DatasetIds from '../views/data/DatasetIds'
import LocationId from '../views/data/datasetIds/LocationId'
import Stories from '../views/Stories'
import DataLayers from '../views/DataLayers'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/data'
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
    name: 'data',
    path: '/data',
    component: DataLayers,
    children: [{
      path: ':datasetIds',
      component: DatasetIds,
      children: [{
        path: ':locationId',
        component: LocationId
      }]
    }]
  }, {
    name: 'stories',
    path: '/stories',
    component: Stories
  },
  {
    name: 'editor',
    path: '/editor/:jobId',
    component: Editor
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
