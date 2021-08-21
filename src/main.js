import Vue from 'vue'
import App from './App.vue'
import Utils from './js/utils'
import router from './router'
import vuetify from './plugins/vuetify';
import titleMixin from './mixins/titleMixin'

Vue.config.productionTip = false
Vue.mixin(titleMixin)

import Subscriptions from './js/subscriptions.js'

Object.defineProperty(Vue.prototype, '$SUBS', {value: new Subscriptions});
Object.defineProperty(Vue.prototype, '$UTILS', {value: new Utils});
Object.defineProperty(Vue.prototype, '$TABS',
    {value: [
        {title: 'Home', icon: 'mdi-home', nav: "/"},
        {title: 'State', icon: 'mdi-chemical-weapon', nav: "/state?tab=apps"},
        {title: 'Events', icon: 'mdi-arrow-collapse-down', nav: "/events"},
        {title: 'Logs', icon: 'mdi-database', nav: "/logs"},
        //{title: 'Dashboards', icon: 'mdi-tablet-dashboard', nav: "/dashboards"},
        //{title: 'App Management', icon: 'mdi-apps', nav: "/appmanagement"},
        //{title: 'Sequences', icon: 'mdi-step-forward-2', nav: "/sequences"},
        //{title: 'Rules', icon: 'mdi-ruler-square-compass', nav: "/rules"},
      ]},
    )

new Vue({
    router,
    vuetify,
    render: h => h(App),
},).$mount('#app')
