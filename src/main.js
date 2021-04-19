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

new Vue({
    router,
    vuetify,
    render: h => h(App),
},).$mount('#app')
