<template>
	<view class="me">
		<uni-list>
			<uni-list-item @click="getImage" title="头像" clickable showArrow="true">
				<view slot="footer" class="me__face uni-boder-radius-circular">
					<image class="uni-image"
						:src="loginType && userInfo.face?userInfo.face:'/static/images/icon/icon-user.png'" mode="">
					</image>
				</view>
			</uni-list-item>
			<uni-list-item @click="editName" title="昵称" clickable showArrow="true" :rightText="userInfo.name" />
			<uni-list-item @click="goToRegister" title="重置密码" clickable showArrow="true" />
			<uni-list-item @click="goToDetail" title="糖羽仙APP使用协议" clickable showArrow="true" />
			<uni-list-item @click="updateApp" title="版本更新" clickable showArrow="true" />
		</uni-list>
		<view class="bottom">
			<view class="uni-flex uni-flex-center">
				<wButton bgColor="#e67249" class="wbutton" text="退出登录" :rotate="false" v-on:click="goOut"></wButton>
			</view>
		</view>
		<uni-popup ref="dialog" type="dialog">
			<uni-popup-dialog mode="input" title="修改昵称" :value="userInfo.name" :duration="2000" @confirm="confirmName">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import wButton from '../../components/watch-login/watch-button.vue'
	import {
		setUserInfoApi,
		uploadApi
	} from '@/common/api/user.js'
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	export default {
		data() {
			return {

			};
		},
		components: {
			wButton,
		},
		onShow() {},
		methods: {
			//选照片 or 拍照
			getImage() {
				let _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					crop: {
						width: 100,
						height: 100
					},
					extension: ["png", "jpg", "jpeg"],
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							let resSize = res.tempFiles[i].size;
							if (resSize > 5000000) {
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
									if (image.type == "gif") {
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
									_this.uploadPic(res.tempFilePaths[i])
								}
							});
						}
					}
				});
			},
			/**
			 * 图片上传
			 */
			async uploadPic(filePath) {
				uni.showLoading({
					title: '图片上传中',
					mask: true
				});
				let face = await uploadApi(filePath);
				await this.updateUserInfo({
					face
				})
				uni.hideLoading();
				uni.showToast({
					title: "头像修改成功"
				})
			},
			/**
			 * 修改昵称
			 */
			editName() {
				this.$refs.dialog.open()
			},
			/**
			 * 确认输入昵称
			 * @param {Object} e
			 */
			async confirmName(e) {
				uni.showLoading({
					title: '昵称修改中',
					mask: true
				});
				let name = e;
				await this.updateUserInfo({
					name
				})
				uni.hideLoading();
				uni.showToast({
					title: "昵称修改成功"
				})
			},
			/** 更新用户信息
			 * @param {Object} user
			 */
			async updateUserInfo(user) {
				await setUserInfoApi(user)
				await this.getUserInfoStore()
			},
			/**
			 * 跳转到重置密码页面
			 */
			goToRegister() {
				uni.navigateTo({
					url: `/pages/login/forget`
				});
			},
			/**
			 * 检查新版本
			 */
			updateApp() {
				// #ifdef APP-PLUS
				APPUpdate(true);
				// #endif
			},
			/**
			 * 跳转到文章详情
			 */
			goToDetail(){
				let url = this.configObj.appAgreementUrl;
				uni.navigateTo({
				    url: `/pages/articleDetail/articleDetail?name=APP使用协议&url=${url}`
				});
			},
			/**
			 * 退出登录
			 */
			goOut() {
				// this.setUserInfo({});
				// this.setLoginType(false);
				this.loginOut()
				uni.redirectTo({
					url: `/pages/login/login`
				});
				uni.showToast({
					title:"您已退出登录",
					icon:"none"
				})
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
	.me {
		.me__face {
			width: 50rpx;
			height: 50rpx;
		}

		.bottom {
			margin-top: 300rpx;
		}
	}
</style>
