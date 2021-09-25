import $U from '@/common/lib/util.js';
import $H from '@/common/lib/request.js';
import {
	hasValueFromArray
} from '@/utils/format_array'
export default {
	state: {
		chatList: [{
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
	},
	mutations: {
		setChatList(state, event) {
			state.chatList = event
		}
	},
	actions: {
		// 获取聊天列表
		getChatList({
			commit,
			state
		}, event) {
			return new Promise((resolve, reject) => {

			})
		},
		handerSocketMessage({
			commit,
			state,
			dispatch,
			rootState
		}, event) {
			let msg = JSON.parse(event)
			let type = Number(msg.type);
			switch (type) {
				case 2:
					let {
						chatMessageContent: {
							chatMessage,
							chaMess,
							chatContent,
							fromUser,
							toUser
						}, clientId
					} = msg;
					console.log(type, chatMessage, chatContent, fromUser, toUser, clientId);
					if (rootState.user.userInfo.clientid != clientId) {
						let chatList = state.chatList
						let messageItem = {
							type: chatMessage.issystem && chatMessage.issystem == 1 ? 'system' : 'user',
							msg: {
								...chatMessage,
								content: chatContent,
								userinfo: fromUser
							}
						}
						//---系统群
						if (chatMessage.toid == 0) {
							chatList[0].num  = chatList[0].num + 1;
							chatList[0].list.push(messageItem)
							if (!chatList[0].mute) {
								dispatch("messagePush")
							}
						//---普通用户
						} else {
							let index = hasValueFromArray(chatList, "id", clientId).index;
							console.log(index)
							if (index != -1) {
								let item = chatList[index]
								item.num = item.num + 1;
								item.list.push(messageItem)
								chatList.splice(index, 1)
								chatList.splice(1, 0,item)
								if (!item.mute) {
									dispatch("messagePush")
								}
							} else {
								let item = {
									id: clientId,
									name: fromUser.name,
									message: "其它信息",
									type: "user",
									face: fromUser.face,
									time: "",
									power: "user",
									userid: clientId,
									mute: false,
									num: 1,
									list: [{
										type: "system",
										msg: {
											id: 0,
											type: "text",
											content: {
												text: "已经与" + fromUser.name + "建立聊天"
											}
										}
									}],
								}
								item.list.push(messageItem);
								chatList.splice(1, 0, item)
								dispatch("messagePush")
							}
						}

						uni.$emit('onMessage', messageItem)
						commit('setChatList', chatList)
					}


					break;
				case 4:
					dispatch('loginOut', {},{root:true});
					uni.showToast({
						title: '账号已在其它地方登录',
						icon: 'none'
					});
					// token不存在时跳转
					uni.switchTab({
						url: '/pages/chat/chat'
					});
					break;
				default:
					break;
			}
		},
		messagePush({
			commit,
			state,
			dispatch,
			rootState
		}, event){
			console.log("震动加推送")
			// #ifdef APP-PLUS
			uni.vibrateLong();
			plus.push.createMessage( '您有一条新消息', {})
			// #endif
		}
	}
}
