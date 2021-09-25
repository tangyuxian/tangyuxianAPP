import {mapGetters,mapMutations} from 'vuex' 
import {hasValueFromArray} from "@/utils/format_array.js"
import {sendMessageApi} from "@/common/api/chat.js"
export default {
	data(){
		return{
			id:"", //单个消息id
			dialogContent: "确认移除该会话?",
			dialogItem: null
		}
	},
	methods:{
		...mapMutations(['setChatList']),
		chatMixin__addChatList(item){
			console.log("添加会话")
			let chatIndex = this.isIndexOfChatList(item);
			let chatList = this.chatList;
			if(chatIndex != -1) return chatList[chatIndex];
			chatList.push(item);
			this.setChatList(chatList);
			return item;
		},
		/**
		 * 弹出对话框
		 */
		chatMixin__openRemoveChatListDialog(item){
			this.dialogItem = item;
			this.$refs.dialog.open()
		},
		/**
		 * 删除会话
		 * @param {Object} item
		 */
		chatMixin__removeChatList(item = null){
			item = item || this.dialogItem;
			let chatIndex = this.isIndexOfChatList(item);
			let chatList = this.chatList;
			chatList.splice(chatIndex, 1);
			this.setChatList(chatList);
		},
		/**
		 * 发送信息
		 * @param {Object} msg
		 */
		async chatMixin__sendMessage(params){
			return  await sendMessageApi(params);
		},
		/**
		 * 获取小程序在列表位置
		 */
		isIndexOfChatList(item = null){
			let index = -1;
			if(item == null){
				return index;
			}
			index = hasValueFromArray(this.chatList, 'userid', item.userid).index
			return index
			
		}
	},
	computed: {
		...mapGetters(['chatList']),
		/**
		 * 当前聊天对象
		 */
		chatMixin__chatListItem(){
			let chatIndex =  hasValueFromArray(this.chatList,'id',this.id).index
			if(chatIndex == -1) return null;
			return this.chatList[chatIndex]
		}
	}
}