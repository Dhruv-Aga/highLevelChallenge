import Vue from 'vue'
import VueRouter from 'vue-router'

import SlotBooking from './pages/SlotBooking.vue'
import CheckBooking from './pages/CheckBooking.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/SlotBooking',
    name: 'SlotBooking',
    component: SlotBooking
  },
  {
    path: '/CheckBooking',
    name: 'CheckBooking',
    component: CheckBooking
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
