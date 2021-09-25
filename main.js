import Vue from 'vue'
import App from './App'
import store from './store';
import globalMixin from "@/common/mixin/globalMixin.js"
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
Vue.mixin(globalMixin)
const app = new Vue({
	store,
    ...App
})
app.$mount()
