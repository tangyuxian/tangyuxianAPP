import $U from '@/common/lib/util.js';
import $H from '@/common/lib/request.js';
import {getProgramListApi} from '@/common/api/program.js'
export default {
	state:{
		programList:[
		],
	},
	mutations:{
		setProgramList(state,event){
			state.programList = event
		}
	},
	actions:{
		// 获取小程序列表
		getProgramList({commit,state},event) {
			console.log(event)
			return new Promise((resolve, reject) => {
				getProgramListApi(event).then(res=>{
					resolve(res.records)
					commit('setProgramList',res.records)
				})
			})
		},
	}
}