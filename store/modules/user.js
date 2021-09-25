import $U from '@/common/lib/util.js';
import $H from '@/common/lib/request.js';
import chatSocket from '@/common/lib/chatSocket.js'
import {
	loginApi,
	getUserInfoApi,
	validatorLoginApi
} from '@/common/api/user.js'
export default {
	state: {
		userInfo: {},
		chatSocket: null,
		onlineType: "default", //default,error,loading,success
		loginType: false
	},
	mutations: {
		setUserInfo(state, event) {
			state.userInfo = event
		},
		setLoginType(state, event) {
			state.loginType = event
		},
		setChatSocket(state, event) {
			state.chatSocket = event
		},
		setOnlineType(state, event) {
			state.onlineType = event
		}
	},
	actions: {
		/**
		 * 登录初始化
		 */
		loginInit({
			commit,
			state,
			dispatch
		}, event) {
			if (!state.loginType) return;
			dispatch("getUserInfoStore")
			commit('setChatSocket', new chatSocket())
		},
		/**
		 * 退出登录
		 */
		loginOut({
			commit,
			state,
			rootState,
			dispatch
		}, event) {
			commit('setLoginType', false)
			commit('setUserInfo', {})
			$U.removeStorage('xAuthToken')
			$U.removeStorage('jtwToken')
			rootState.chat.chatList = [{
				id: "0",
				name: "聊天室",
				message: "官方聊天室",
				type: "group",
				face: "https://cdn.jsdelivr.net/gh/tangyuxian/blog_image@master/head/head.jpg",
				time: "",
				power: "admin",
				mute: true,
				num: 1,
				list: [{
					type: "system",
					msg: {
						id: 0,
						type: "text",
						createtime: "",
						content: {
							text: "欢迎进入官方聊天室"
						}
					}
				}]
			}]
			if (state.onlineType == 'success') {
				try {
					state.chatSocket.closeSocket()
				} catch (e) {
					//TODO handle the exception
				}
				commit("setOnlineType", "default")
			}
		},
		// 登录信息
		loginStore({
			commit,
			state,
			dispatch
		}, event) {
			return new Promise((resolve, reject) => {
				loginApi(event).then(() => {
					return validatorLoginApi();
				}).then(() => {
					return getUserInfoApi();
				}).then(res => {
					commit('setLoginType', true)
					commit('setUserInfo', res)
					let socket = new chatSocket();
					commit('setChatSocket', socket)
					resolve(res)
				}).catch(e => {
					console.log(e)
					commit('setLoginType', false)
					commit('setUserInfo', {})
					reject(e)
				})
			})
		},
		//获取用户信息
		getUserInfoStore({
			commit,
			state,
			dispatch
		}, event) {
			return new Promise((resolve, reject) => {
				getUserInfoApi().then((res) => {
					commit('setLoginType', true)
					commit('setUserInfo', res)
					resolve(res)
				}).catch(e => {
					console.log(e)
					dispatch("loginOut")
					reject(e)
				})
			})
		},
		//发送消息
		sendMessageForScoket({
			commit,
			state
		}, event){
			state.chatSocket.sendMessage(event)
		}
	}
}
