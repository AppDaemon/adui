import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from '../views/State.vue'
import AppManagement from "../views/AppManagement";
import Dashboards from "../views/Dashboards";
import Rules from "../views/Rules";
import Sequences from "../views/Sequences";
import Logs from "../views/Logs";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Admin',
    component: Admin
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
