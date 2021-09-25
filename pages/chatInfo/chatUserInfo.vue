<template>
	<view class="chatUserInfo">
		<view class="introduce item uni-flex">
			<view class="introduce-logo">
				<image class="image uni-boder-radius-circular" :src="info.face" mode=""></image>
			</view>
			<view class="introduce-main uni-flex-item">
				<view class="name">{{info.name}}</view>
				<view class="message">
					这个小可爱什么签名都没留下
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="uni-flex uni-flex-center">
				<wButton bgColor="#e67249" class="wbutton" text="发送消息" :rotate="false" v-on:click="sendMsg"></wButton>
			</view>
		</view>

	</view>

</template>

<script>
	import wButton from '../../components/watch-login/watch-button.vue'
	import chatMixin from "@/common/mixin/chatMixin.js"
	import $U from "@/common/lib/util.js"
	import {getUserInfoForClientIdApi} from "@/common/api/user.js"
	export default {
		mixins: [chatMixin],
		data() {
			return {
				uid: "",
				info: {
					name: "糖羽仙",
					face: "https://cdn.jsdelivr.net/gh/tangyuxian/blog_image@latest/head/head.jpg"
				}
			}
		},
		components: {
			wButton,
		},
		onLoad(option) {
			this.uid = option.id
			this.getOtherUserInfo();
		},
		methods: {
			async getOtherUserInfo(){
				let params = {id:this.uid}
				this.info =  await getUserInfoForClientIdApi(params)
			},
			sendMsg() {
				let item = {
					id: this.info.clientid,
					name: this.info.name,
					message: "其它信息",
					type: "user",
					face: this.info.face,
					time: "",
					power: "user",
					userid:this.uid,
					mute: false,
					num: 0,
					list: [{
						type: "system",
						msg: {
							id: 0,
							type: "text",
							content: {
								text: "已经与" + this.info.name + "建立聊天"
							}
						}
					}],
				}
				let chatItem = this.chatMixin__addChatList(item);
				uni.navigateTo({
					url: `/pages/chatDetail/chatDetail?id=${chatItem.id}`
				});
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
	.chatUserInfo {


		.introduce-logo,
		.image {
			width: 130rpx;
			height: 130rpx;
		}

		.introduce-main {
			margin-left: 20rpx;
			box-sizing: border-box;

			.name {
				font-size: $uni-font-size-lg;
				font-weight: bold;
			}
		}

	}

	.item {
		margin-bottom: 10rpx;
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.bottom {
		margin-top: 300rpx;
	}
</style>
