<template>
	<view class="chatDetailGroup">
		<view class="item">
			<uni-list>
				<uni-list-item v-if="chatMixin__chatListItem.type == 'group'" title="在线用户" />
				<uni-grid @change="chooseUserItem" :column="5" :showBorder="false" :square="false">
					<uni-grid-item  v-for="(item,index) in userList" :index="index" :key="index">
						<view class="item-user">
							<view class="item-user-face">
								<image class="image uni-boder-radius-circular" :src="item.face"
									mode=""></image>
							</view>
							<view class="item-user-name uni-ellipsis">
								{{item.name}}
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</uni-list>
		</view>
		<view v-if="chatMixin__chatListItem.type == 'group'" class="item">
			<uni-list>
				<uni-list-item title="群聊名称" :rightText="chatMixin__chatListItem.name"></uni-list-item>
			</uni-list>
		</view>
		<view v-if="chatMixin__chatListItem.type == 'group'" class="item">
			<uni-list>
				<uni-list-item title="群公告" note="暂无公告"></uni-list-item>
			</uni-list>
		</view>
		<view v-if="chatMixin__chatListItem.type == 'user'" class="item">
			<uni-list>
				<uni-list-item title="自我介绍" note="这个小可爱什么也没说"></uni-list-item>
			</uni-list>
		</view>
		<view class="item">
			<uni-list>
				<uni-list-item title="消息免打扰" :show-switch="true" :switchChecked="chatMixin__chatListItem.mute"
					@switchChange="switchChangeMute"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import {setMute} from '@/common/lib/chatListUtil.js'
	import chatMixin from "@/common/mixin/chatMixin.js"
	import {getOnlineList} from "@/common/api/chat.js"
	export default {
		mixins: [chatMixin],
		data() {
			return {
				userList:[]
			}
		},
		onLoad(option) {
			this.id = option.id
			this.setUserList();
			if(this.chatMixin__chatListItem.type == 'group'){
				this.getOnlineList()
			}
		},
		methods: {
			/**
			 * 设置成员列表
			 */
			setUserList(){
				let type = this.chatMixin__chatListItem.type;
				if(type == 'user'){
					this.userList.push({id:this.chatMixin__chatListItem.id,name:this.chatMixin__chatListItem.name,face:this.chatMixin__chatListItem.face})
				}else{
					this.userList = []
				}
			},
			/**选择某个成员
			 * @param {Object} val
			 */
			chooseUserItem(val){
				if(this.chatMixin__chatListItem.type != 'group') return;
				let index= val.detail.index
				let userInfo = this.userList[index]
				if(this.userInfo.clientid == userInfo.clientid) return;
				uni.navigateTo({
					url: `/pages/chatInfo/chatUserInfo?id=${userInfo.clientid}`
				});
			},
			/**是否设置消息不提醒
			 * @param {Object} type
			 */
			switchChangeMute(type) {
				let chatList = setMute(type.value,this.chatMixin__chatListItem,this.chatList);
				this.setChatList(chatList);
			},
			async getOnlineList(){
			 	this.userList = await getOnlineList()
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $uni-bg-color-chat;
	}
</style>
<style lang="scss" scoped>
	.chatDetailGroup {
		.item {
			margin-bottom: 10rpx;
			/deep/ .uni-switch-input-checked {
				border-color: $uni-color-theme !important;
				background-color: $uni-color-theme !important;
			}

			.item-user {
				width: 130rpx;
				display: block;
				margin: auto;
				.item-user-face{
					width: 100%;
					.image{
						width: 130rpx;
						height: 130rpx;
					}
				}
				.item-user-name{
					text-align: center;
				}
			}
		}
	}
</style>
