import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VTooltip from "v-tooltip";
import vuetify from './plugins/vuetify';
import titleMixin from './mixins/titleMixin'

Vue.config.productionTip = false
Vue.mixin(titleMixin)
Vue.use(VTooltip);

import AD from './js/ad.js'

Object.defineProperty(Vue.prototype, '$AD', {value: new AD});

new Vue({
    router,
    vuetify,
    render: h => h(App),
},).$mount('#app')
