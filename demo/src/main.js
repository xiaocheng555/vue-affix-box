import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResponseSize from '../../src/vue-response-size'

Vue.config.productionTip = false

Vue.use(VueResponseSize)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
