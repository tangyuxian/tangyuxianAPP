<template>
	<view class="chat">
		<view class="content">
			<view v-if="onlineType != 'default'" class="online">
				<uni-notice-bar single="true" :text="onlineTypeFilter[onlineType]"></uni-notice-bar>
			</view>
			<view @click="openChatDetail(item)"  @longpress="showMoreMenu(item,index)" v-for="(item,index) in chatList" :key="index" class="item uni-flex uni-flex-between">
				<view class="item-head">
					<!-- <image :src="item.avatar" mode=""></image> -->
					<uni-badge size="small" :is-dot="true" :text="item.num" absolute="rightTop" type="error" :offset="[10,10]">
					   <image class="image  uni-boder-radius-circular" :src="item.face" mode=""></image>
					</uni-badge>
				</view>
				<view class="item-main">
					<view class="item-main-title uni-ellipsis">
						<text class="item-main-title-power">{{item.power == "admin"?'[官方]':''}}</text><text class="item-main-title-group">{{item.type == "group"?'[群]':''}}</text>{{item.name}}
					</view>
					<view class="item-main-mes uni-ellipsis">
						{{filterMessage(item)}}
					</view>	
				</view>
				<view class="item-time">
					{{filterTime(item.time)}}
				</view>
			</view>			
		</view>
		<uni-popup ref="dialog" type="dialog">
		    <uni-popup-dialog  title="提示"  :content="dialogContent" :duration="2000"   @confirm="chatMixin__removeChatList"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {clearNum} from '@/common/lib/chatListUtil.js'
	import chatMixin from "@/common/mixin/chatMixin.js"
	import time from "@/utils/time.js"
	export default {
		mixins:[chatMixin],
		data() {
			return {
				onlineTypeFilter:{
					loading:"[连接中...]正在建立连接",
					error:"[连接失败]请在尝试重连",
					success:"[在线]请尽情聊天吧"
				}
			};
		},
		methods:{
			/**打开聊天窗口
			 * @param {Object} item
			 */
			openChatDetail(item){
				if(!this.loginType){
					uni.showToast({
						title:"请先登录",
						icon:"none",
						mask:true
					})
					uni.navigateTo({
					    url: `/pages/login/login`
					});
					return;
				}
				if(!this.userInfo.face){
					uni.showToast({
						title:"请先设置头像",
						icon:"none",
						mask:true
					})
					uni.navigateTo({
					    url: `/pages/me/me`
					});
					return;
				}
				if(this.onlineType != "success"){
					uni.showToast({
						title:"当前正在离线状态",
						icon:"none",
						mask:true
					})
					return;
				}
				let chatList = clearNum(item,this.chatList);
				this.setChatList(chatList);
				uni.navigateTo({
				    url: `/pages/chatDetail/chatDetail?id=${item.id}`
				});
			},
			/** 处理预览消息
			 * @param {Object} item
			 */
			filterMessage(item){
				let message = "";
				if(item.list.length == 0) return ""
				let lastMsgListItem = item.list[item.list.length-1];
				if(lastMsgListItem.type == "system"){
					message = "[系统消息]"
				}else{
					switch (lastMsgListItem.msg.type){
						case 'text':
							message = lastMsgListItem.msg.content.text;
						break;
						case 'voice':
							message = "[语音]";
						break;
						case 'img':
							message = "[图片]";
						break;
						case 'redEnvelope':
							message = "[红包]";
					}
				}
				return message;
			},
			/** 过滤时间
			 * @param {Object} createtime	
			 */
			filterTime(createtime){
				if(!createtime) return "";
				let nowTime = time.getChatTime(new Date(createtime).getTime(),0);
				return nowTime
			},
			/** 长按显示更多菜单
			 * @param {Object} item
			 */
			showMoreMenu(item,index){
				if(item.power == "admin"){
					return;
				}
				let _this = this;
				uni.showActionSheet({
				    itemList: ['移除'],
				    success: function (res) {
						if(res.tapIndex == 0){
							_this.chatMixin__openRemoveChatListDialog(item)
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	.chat{
		.content{
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			.item{
				padding: 20rpx;
				box-sizing: border-box;
				border-bottom: 1rpx solid $uni-text-color-disable;
				.item-head{
					width: 110rpx;
					height: 110rpx;
					.image{
						width: 110rpx;
						height: 110rpx;
					}
				}
				.item-main{
					flex: 1;
					box-sizing: border-box;
					padding: 0 20rpx;
					.item-main-title{
						font-size: $uni-font-size-lg;
						.item-main-title-power{
							color: $uni-text-color-icon-power;
						}
						.item-main-title-group{
							color: $uni-text-color-icon-group;
						}
					}
					.item-main-mes{
						font-size: $uni-font-size-base;
						color: $uni-text-color-grey;
						box-sizing: border-box;
					}
				}
				.item-time{
					text-align: right;
					color: $uni-text-color-grey;
					font-size: $uni-font-size-sm;
				}
			}
		}
	}
</style>
