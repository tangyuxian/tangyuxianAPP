import $U from '@/common/lib/util.js';
import $H from '@/common/lib/request.js';
import {getConfigApi} from '@/common/api/user.js'
import configObj from '@/config/config.js'
export default {
	state:{
		configObj
	},
	mutations:{
		setConfigObj(state,event){
			state.configObj = event
		}
	},
	actions:{
		// 获取配置信息
		getConfigObj({commit,state},event) {
			return new Promise((resolve, reject) => {
				getConfigApi().then(res=>{
					let configObj = {...state.configObj,...res}
					resolve(configObj)
					commit('setConfigObj',configObj)
				})
			})
		},
	}
}