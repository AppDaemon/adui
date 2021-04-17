import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import State from '../views/State.vue'
import Events from '../views/Events.vue'
import AppManagement from "../views/AppManagement";
import Dashboards from "../views/Dashboards";
import Rules from "../views/Rules";
import Sequences from "../views/Sequences";
import Logs from "../views/Logs";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/state',
    name: 'State',
    component: State
  },
  {
    path: '/events',
    name: 'Events',
    component: Events
  },
  {
    path: '/appmanagement',
    name: 'App Management',
    component: AppManagement
  },
  {
    path: '/dashboards',
    name: 'Dashboards',
    component: Dashboards
  },
  {
    path: '/rules',
    name: 'Rules',
    component: Rules
  },
  {
    path: '/sequences',
    name: 'Sequences',
    component: Sequences
  },
  {
    path: '/logs',
    name: 'Lgs',
    component: Logs
  }
]

const router = new VueRouter({
  routes
})

export default router
