import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import titleMixin from './mixins/titleMixin'

Vue.config.productionTip = false
Vue.mixin(titleMixin)

import AD from './ad.js'

Vue.prototype.$AD = new AD()

new Vue({
  router,
  vuetify,
  render: h => h(App),
},).$mount('#app')
