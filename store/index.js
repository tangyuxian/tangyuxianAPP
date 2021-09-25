import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'
import util from '@/common/lib/util.js'
Vue.use(Vuex)


import article from '@/store/modules/article.js';
import chat from '@/store/modules/chat.js';
import program from '@/store/modules/program.js';
import user from '@/store/modules/user.js';
import config from '@/store/modules/config.js';
import getters from './getters'
export default new Vuex.Store({
	modules:{
		article,
		chat,
		program,
		user,
		config
	},
	getters,
	 plugins: [
	     persistedState({
	       storage: {
	         getItem: key => util.getStorage(key),
	         setItem: (key, value) => util.setStorage(key, value, { expires: 7 }),
	         removeItem: key => util.removeStorage(key)
	       },
	     })
	   ]
})