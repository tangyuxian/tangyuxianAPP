<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory"
				upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
				<view v-show="loadingMsg" class="loading" :style="`opacity: ${loadingMsg?'1':'0'};`">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.msg.id">
					<!-- 系统消息 -->
					<block v-if="row.type=='system'">
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.msg.type=='text'" class="text">
								{{row.msg.content.text}}
							</view>
							<!-- 领取红包消息 -->
							<view v-if="row.msg.type=='redEnvelope'" class="red-envelope">
								<image src="/static/images/img/red-envelope-chat.png"></image>
								{{row.msg.content.text}}
							</view>
						</view>
					</block>
					<!-- 用户消息 -->
					<view class="chat-time">
						{{filterCreateTime(row,index,msgList)}}
					</view>
					<block v-if="row.type=='user'">
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.msg.userinfo.clientid==myuid">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble">
									<rich-text :nodes="replaceEmoji(row.msg.content.text)"></rich-text>
								</view>
								<!-- 语言消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)"
									:class="playMsgid == row.msg.id?'play':''">
									<view class="length">{{row.msg.content.length}}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url"
										:style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}">
									</image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope"
									@tap="openRedEnvelope(row.msg,index)">
									<image src="/static/images/other/red-envelope.png"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>

							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="row.msg.userinfo.face"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.msg.userinfo.clientid!=myuid">
							<!-- 左-头像 -->
							<view @click="openChatInfo(row)" class="left">
								<image :src="row.msg.userinfo.face"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{row.msg.userinfo.name}}</view>
									<!-- <view class="time">{{row.msg.time}}</view> -->
								</view>
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="bubble">
									<rich-text :nodes="replaceEmoji(row.msg.content.text)"></rich-text>
								</view>
								<!-- 语音消息 -->
								<view v-if="row.msg.type=='voice'" class="bubble voice" @tap="playVoice(row.msg)"
									:class="playMsgid == row.msg.id?'play':''">
									<view class="icon other-voice"></view>
									<view class="length">{{row.msg.content.length}}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.msg.type=='img'" class="bubble img" @tap="showPic(row.msg)">
									<image :src="row.msg.content.url"
										:style="{'width': row.msg.content.w+'px','height': row.msg.content.h+'px'}">
									</image>
								</view>
								<!-- 红包 -->
								<view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope"
									@tap="openRedEnvelope(row.msg,index)">
									<image src="/static/images/other/red-envelope.png"></image>
									<view class="tis">
										<!-- 点击开红包 -->
									</view>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{hidden:hideEmoji}" indicator-dots="true" duration="150">
				<swiper-item v-for="(page,pid) in emojiList" :key="pid">
					<view v-for="(em,eid) in page" :key="eid" @tap="addEmoji(em)">
						<image mode="widthFix" :src="'/static/images/emoji/'+em.url"></image>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<view class="icon iconfont tupian"></view>
					</view>
					<view class="box" @tap="camera">
						<view class="icon paizhao"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view v-if="onlineType == 'success'" class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']"
					@touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd"
					@touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode" :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" />
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<view v-if="false" class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view class="icon" :class="isVoice?'jianpan':'yuyin'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']"
					@touchstart="voiceBegin" @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd"
					@touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode" :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" />
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<!-- #endif -->
			<view class="send" :class="isVoice?'hidden':''" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''">
				<view class="icon luyin"></view>
			</view>
			<view class="cancel" :class="willStop?'':'hidden'">
				<view class="icon chehui"></view>
			</view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<image src="/static/images/img/im/face/face_1.jpg"></image>
					</view>
					<view class="from">来自{{redenvelopeData.from}}</view>
					<view class="blessing">{{redenvelopeData.blessing}}</view>
					<view class="money">{{redenvelopeData.money}}</view>
					<view class="showDetails" @tap="toDetails(redenvelopeData.rid)">
						查看领取详情 <view class="icon to"></view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	import emojiList from "./emojiList.js"
	import $C from "@/common/lib/httpConfig.js"
	import chatMixin from "@/common/mixin/chatMixin.js"
	import time from "@/utils/time.js"
	import {uploadApi} from '@/common/api/user.js'
	import {
		hasValueFromArray,
		group
	} from "@/utils/format_array.js"
	export default {
		mixins: [chatMixin],
		data() {
			return {
				loadingMsg: true, //加载消息中
				//文字消息
				textMsg: '',
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollTop: 0,
				scrollToView: '',
				msgList: [],
				msgGroupList: [],
				msgImgList: [],
				id:"0",
				myuid: 0,

				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER: uni.getRecorderManager(),
				// #endif
				isVoice: false,
				voiceTis: '按住 说话',
				recordTis: "手指上滑 取消发送",
				recording: false,
				willStop: false,
				initPoint: {
					identifier: 0,
					Y: 0
				},
				recordTimer: null,
				recordLength: 0,

				//播放语音相关参数
				AUDIO: uni.createInnerAudioContext(),
				playMsgid: null,
				VoiceTimer: null,
				// 抽屉参数
				popupLayerClass: '',
				// more参数
				hideMore: true,
				//表情定义
				hideEmoji: true,
				emojiList: emojiList,
				//红包相关参数
				windowsState: '',
				redenvelopeData: {
					rid: null, //红包ID
					from: null,
					face: null,
					blessing: null,
					money: null
				}
			};
		},
		onLoad(option) {
			this.id = option.id
			this.myuid = this.userInfo.clientid;
			this.handleGroupOrUser()
			// 监听接收聊天信息
			uni.$on('onMessage',this.onMessage)
			//语音自然播放结束
			this.AUDIO.onEnded((res) => {
				this.playMsgid = null;
			});
			// #ifndef H5
			//录音开始事件
			this.RECORDER.onStart((e) => {
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e) => {
				this.recordEnd(e);
			})
			// #endif
			setTimeout(() => {
				uni.setNavigationBarTitle({
					title: this.chatMixin__chatListItem.name
				})
			}, 0)
		},
		onShow() {
			this.scrollTop = 9999999;
		},
		onNavigationBarButtonTap(e) {
			this.goToInfo()
		},
		destroyed() {
			// 销毁监听接收聊天消息
			uni.$off('onMessage',this.onMessage)
		},
		methods: {
			/**
			 * 处理群聊天或者个人聊天
			 */
			handleGroupOrUser() {
				let list = this.chatMixin__chatListItem.list.slice();
				list.reverse();
				this.msgGroupList = group(list, 10)
				let chatListItem = this.chatMixin__chatListItem;
				if (!chatListItem) return;
				let msgGroupListOnce = this.msgGroupList.shift();
				// 消息列表
				msgGroupListOnce = [...msgGroupListOnce].reverse();
				if (this.msgGroupList.length == 0) {
					this.loadingMsg = false;
				}
				this.getMsgList(msgGroupListOnce);
			},
			/**
			 * 将消息存入状态管理器中
			 */
			setMsgListToVuex() {
				let chatList = this.chatList
				let chatIndex = hasValueFromArray(this.chatList, 'id', this.id).index
				let list = [];
				for (let i = 0; i < this.msgGroupList.length; i++) {
					list = list.concat(this.msgGroupList[i].slice().reverse())
				}
				list = list.concat(this.msgList)
				chatList[chatIndex].list = list;
				chatList[chatIndex].time = list[list.length - 1].msg.createtime
				this.setChatList(chatList);
			},
			/**
			 * 群的情况下打开其它人的信息
			 */
			openChatInfo(row) {
				if(this.onlineType != 'success'){
					uni.showToast({
						title:"您正处于离线状态,请稍后重试",
						icon:"none"
					})
					return;
				}
				let userId = row.msg.userinfo.clientid
				uni.navigateTo({
					url: `/pages/chatInfo/chatUserInfo?id=${userId}`
				});
			},
			/**
			 * 跳转到聊天信息页面
			 */
			goToInfo() {
				uni.navigateTo({
					url: `/pages/chatInfo/chatInfo?id=${this.id}`
				});
			},
			/**
			 * 对时间进行处理
			 */
			filterCreateTime(row, index, msgList) {
				if (!row.msg.createtime) return;
				let v1 = new Date(row.msg.createtime).getTime();
				let v2 = index == 0 ? 0 : (new Date(msgList[index - 1].msg.createtime).getTime() || 0);
				let nowTime = time.getChatTime(v1, v2);
				return nowTime
			},
			/**
			 * 监听接收的消息
			 * @param {Object} msg
			 */
			onMessage(msg){
				console.log("收到推送信息",msg.msg.fromid,msg.msg.toid,this.id,msg)
				if(this.id == "0" && msg.msg.toid != this.id) return;
				if(this.id !="0" && msg.msg.fromid != this.id) return;
				this.screenMsg(msg);
			},
			// 接受消息(筛选处理)
			screenMsg(msg) {
				//从长连接处转发给这个方法，进行筛选处理
				if (msg.type == 'system') {
					// 系统消息
					switch (msg.msg.type) {
						case 'text':
							this.addSystemTextMsg(msg);
							break;
						case 'redEnvelope':
							this.addSystemRedEnvelopeMsg(msg);
							break;
					}
				} else if (msg.type == 'user') {
					// 用户消息
					switch (msg.msg.type) {
						case 'text':
							this.addTextMsg(msg);
							break;
						case 'voice':
							this.addVoiceMsg(msg);
							break;
						case 'img':
							this.addImgMsg(msg);
							break;
						case 'redEnvelope':
							this.addRedEnvelopeMsg(msg);
							break;
					}
				}
				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = 'msg' + msg.msg.id
				});
			},

			//触发滑动到顶部(加载历史信息记录)
			async loadHistory(e) {
				if (this.isHistoryLoading) {
					return;
				}
				if (this.msgGroupList.length == 0) {
					this.loadingMsg = false;
					return;
				}
				this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false; //关闭滑动动画
				let Viewid = this.msgList[0].msg.id; //记住第一个信息ID
				//本地模拟请求历史记录效果
				setTimeout(() => {
					let list = [...(this.msgGroupList.shift())].reverse();
					// 获取消息中的图片,并处理显示尺寸
					for (let i = 0; i < list.length; i++) {
						if (list[i].type == 'user' && list[i].msg.type == "img") {
							list[i].msg.content = this.setPicSize(list[i].msg.content);
							this.msgImgList.unshift(list[i].msg.content.url);
						}
						list[i].msg.id = Math.floor(Math.random() * 1000 + 1);

					}
					this.msgList = [...list, ...this.msgList]
					//这段代码很重要，不然每次加载历史数据都会跳到顶部
					this.$nextTick(function() {
						this.scrollToView = 'msg' + Viewid; //跳转上次的第一行信息位置
						this.$nextTick(function() {
							this.scrollAnimation = true; //恢复滚动动画
						});

					});
					this.isHistoryLoading = false;

				}, 1500)
			},
			// 加载初始页面消息
			getMsgList(list) {
				// 获取消息中的图片,并处理显示尺寸
				for (let i = 0; i < list.length; i++) {
					if (list[i].type == 'user' && list[i].msg.type == "img") {
						list[i].msg.content = this.setPicSize(list[i].msg.content);
						this.msgImgList.push(list[i].msg.content.url);
					}
				}
				this.msgList = list;
				// 滚动到底部
				this.$nextTick(function() {
					//进入页面滚动到底部
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});

				});
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = scale > 1 ? maxW : maxH * scale;
					content.h = scale > 1 ? maxW / scale : maxH;
				}
				return content;
			},

			//更多功能(点击+弹出) 
			showMore() {
				this.isVoice = false;
				this.hideEmoji = true;
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer() {
				this.popupLayerClass = 'showLayer';
			},
			// 隐藏抽屉
			hideDrawer() {
				this.popupLayerClass = '';
				setTimeout(() => {
					this.hideMore = true;
					this.hideEmoji = true;
				}, 150);
			},
			// 选择图片发送
			chooseImage() {
				this.getImage('album');
			},
			//拍照发送
			camera() {
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes() {
				uni.navigateTo({
					url: 'HM-hand/HM-hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			async getImage(type) {
				let _this = this;
				this.hideDrawer();
				uni.chooseImage({
					sourceType: [type],
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							let resSize = res.tempFiles[i].size;
							if(resSize > 5000000){
							    uni.showToast({
							        title: "上传的图片大小不超过5m",
							        icon: 'none',
							        duration: 2000,
							        mask: true
							    });
							return
							}
							
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image) => {
									if(image.type == "gif"){
										uni.showToast({
										    title: "不能上传动态图片",
										    icon: 'none',
										    duration: 2000,
										    mask: true
										});
										return;
									}
									let msg = {
										url: res.tempFilePaths[i],
										w: image.width,
										h: image.height
									};
									_this.uploadPic(msg)
								}
							});
						}
					}
				});
			},
			/**
			 * 图片上传
			 */
			async uploadPic(msg){
				uni.showLoading({
					title: '图片上传中',
					mask:true
				});
				let dataUrl =  await uploadApi(msg.url);
				msg.url = dataUrl;
				uni.hideLoading();
				this.sendMsg(msg,'img')
			},
			// 选择表情
			chooseEmoji() {
				this.hideMore = true;
				if (this.hideEmoji) {
					this.hideEmoji = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em) {
				this.textMsg += em.alt;
			},

			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus() {
				if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText() {
				this.hideDrawer(); //隐藏抽屉
				if (!this.textMsg) {
					return;
				}
				let content = this.textMsg;
				console.log(content)
				let msg = {
					text: content
				}
				this.sendMsg(msg, 'text');
				this.textMsg = ''; //清空输入框
			},
			//替换表情符号为图片
			replaceEmoji(str) {
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
					for (let i = 0; i < this.emojiList.length; i++) {
						let row = this.emojiList[i];
						for (let j = 0; j < row.length; j++) {
							let EM = row[j];
							if (EM.alt == item) {
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								let onlinePath = $C.emoticonUrl
								let imgstr = '<img src="' + onlinePath + EM.url + '">';
								return imgstr;
							}
						}
					}
				});
				return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
			},

			// 发送消息
			async sendMsg(content, type) {
				uni.showLoading({
					title: '请稍等'
				});
				//实际应用中，此处应该提交长连接，模板仅做本地处理。
				var nowDate = new Date();
				let createtime = time.dateFormat(nowDate, "{Y}-{MM}-{DD} {hh}:{ii}:{ss}");
				let lastid = this.msgList[this.msgList.length - 1].msg.id;
				lastid++;
				let msg = {
					type: 'user',
					msg: {
						id: lastid,
						createtime,
						type: type,
						userinfo: this.userInfo,
						content: content
					}
				}
				let params = {
					msgtype: this.chatMixin__chatListItem.type, //主体消息类型(group 群消息;user 用户消息)
					type, //text:文本消息 voice:音频 img:图片 redEnvelope:红包
					fromid: this.userInfo.clientid, //来源id
					toid: this.chatMixin__chatListItem.id, //接收者id
					...content
				}
				let data = await this.chatMixin__sendMessage(params)
				msg.msg.id = data.id;
				
				let chatList = this.chatList
				let chatIndex = hasValueFromArray(this.chatList, 'id', this.id).index
				chatList[chatIndex].list.push(msg);
				this.setChatList(chatList);
				// 发送消息
				try{
					this.screenMsg(msg);
				}catch(e){
					//TODO handle the exception
				}
				uni.hideLoading();
			},

			// 添加文字消息到列表
			addTextMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加语音消息到列表
			addVoiceMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg) {
				msg.msg.content = this.setPicSize(msg.msg.content);
				this.msgImgList.push(msg.msg.content.url);
				this.msgList.push(msg);
			},
			addRedEnvelopeMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg) {
				this.msgList.push(msg);
			},
			// 打开红包
			openRedEnvelope(msg, index) {
				let rid = msg.content.rid;
				uni.showLoading({
					title: '加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(() => {
					//加载数据
					if (rid == 0) {
						this.redenvelopeData = {
							rid: 0, //红包ID
							from: "大黑哥",
							face: "/static/images/img/im/face/face.jpg",
							blessing: "恭喜发财，大吉大利",
							money: "已领完"
						}
					} else {
						this.redenvelopeData = {
							rid: 1, //红包ID
							from: "售后客服008",
							face: "/static/images/img/im/face/face_2.jpg",
							blessing: "恭喜发财",
							money: "0.01"
						}
						if (!msg.content.isReceived) {
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({
								text: "你领取了" + (msg.userinfo.uid == this.myuid ? "自己" : msg.userinfo
									.username) + "的红包"
							}, 'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.msgList[index].msg.content.isReceived = true;
						}
					}
					uni.hideLoading();
					this.windowsState = 'show';

				}, 200)

			},
			// 关闭红包弹窗
			closeRedEnvelope() {
				this.windowsState = 'hide';
				setTimeout(() => {
					this.windowsState = '';
				}, 200)
			},
			sendSystemMsg(content, type) {
				let lastid = this.msgList[this.msgList.length - 1].msg.id;
				lastid++;
				let row = {
					type: "system",
					msg: {
						id: lastid,
						type: type,
						content: content
					}
				};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid) {
				uni.navigateTo({
					url: 'HM-details/HM-details?rid=' + rid
				})
			},
			// 预览图片
			showPic(msg) {
				uni.previewImage({
					indicator: "none",
					current: msg.content.url,
					urls: this.msgImgList
				});
			},
			// 播放语音
			playVoice(msg) {
				this.playMsgid = msg.id;
				this.AUDIO.src = msg.content.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			// 录音开始
			voiceBegin(e) {
				if (e.touches.length > 1) {
					return;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({
					format: "mp3"
				}); //录音开始,
			},
			//录音开始UI效果
			recordBegin(e) {
				this.recording = true;
				this.voiceTis = '松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(() => {
					this.recordLength++;
				}, 1000)
			},
			// 录音被打断
			voiceCancel() {
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true; //不发送录音
				this.RECORDER.stop(); //录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e) {
				if (!this.recording) {
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				} else {
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e) {
				if (!this.recording) {
					return;
				}
				this.recording = false;
				this.voiceTis = '按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop(); //录音结束
			},
			//录音结束(回调文件)
			recordEnd(e) {
				clearInterval(this.recordTimer);
				if (this.recordLength < 1) {
					uni.showToast({
						title: "录音时间过短",
						icon: "none"
					})
				} else if (this.recordLength > 30) {
					uni.showToast({
						title: "录音时间过长",
						icon: "none"
					})
				} else {
					if (!this.willStop) {
						console.log("e: " + JSON.stringify(e));
						let msg = {
							length: 0,
							url: e.tempFilePath
						}
						let min = parseInt(this.recordLength / 60);
						let sec = this.recordLength % 60;
						min = min < 10 ? '0' + min : min;
						sec = sec < 10 ? '0' + sec : sec;
						msg.length = min + ':' + sec;
						this.sendMsg(msg, 'voice');
					} else {
						console.log('取消发送录音');
					}
				}

				this.willStop = false;
			},
			// 切换语音/文字输入
			switchVoice() {
				this.hideDrawer();
				this.isVoice = this.isVoice ? false : true;
			},
			discard() {
				return;
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
	@import "./chatDetail.scss";
</style>
