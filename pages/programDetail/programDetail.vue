<template>
	<view class="program-detail  uni-flex uni-column">
		<!-- <web-view :webview-styles="webviewStyles" :src="url"></web-view> -->
		<uni-nav-bar v-if="info.showNav" color="#fff" backgroundColor="#e67249" :shadow="true" :title="info.name">
		</uni-nav-bar>
		<view class="view uni-flex-item">
			<iframe v-show="show" :webview-styles="webviewStyles" :src="info.mainurl"></iframe>
		</view>
		<view class="program-capsule uni-flex">
			<view @click="showMenu" class="program-capsule-item uni-flex-item uni-flex uni-column  uni-flex-center">
				<uni-icons type="more-filled"></uni-icons>
			</view>
			<view @click="closeView" class="program-capsule-item uni-flex-item uni-flex uni-column uni-flex-center">
				<uni-icons type="closeempty"></uni-icons>
			</view>
		</view>
		<view v-show="!show" class="program-loading uni-flex uni-column uni-flex-between">
			<view class="loading-top uni-flex uni-column uni-flex-center">
				<view class="loading-top-logo">
					<image class="image uni-boder-radius-radian" :src="info.logo" mode=""></image>
				</view>
				<view class="loading-top-text">
					{{info.name}}
				</view>
			</view>
			<view class="loading-bottom">
				本程序由{{info.developer}}提供服务
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-menu">
				<view class="popup-menu-title programInfo">
					<view class="introduce item uni-flex">
						<view class="introduce-logo">
							<image class="image uni-boder-radius-radian" :src="info.logo" mode=""></image>
						</view>
						<view class="introduce-main uni-flex-item">
							<view class="name">{{info.name}}</view>
							<view class="message">
								{{info.introduce}}
							</view>
						</view>
					</view>
				</view>
				<view class="popup-menu-item program">
					<uni-grid  :column="5" :showBorder="false" :square="false">
						<uni-grid-item>
							<view @click="addProgramItem(info)" class="item-program">
								<view class="item-program-cover ">
									<view class="icon collect item-program-cover-view" :class="{'unlock':isIndexOfProgram(info) != -1}">&#xe604;</view>
								</view>
								<view class="item-program-name  uni-ellipsis">
									{{isIndexOfProgram(info) != -1?'已':''}}收藏
								</view>
							</view>
						</uni-grid-item>
						<uni-grid-item>
						<view @click="reload" class="item-program">
							<view class="item-program-cover ">
								<view class="icon reload item-program-cover-view">&#xe639;</view>
							</view>
							<view class="item-program-name  uni-ellipsis">
								刷新
							</view>
						</view>
						</uni-grid-item>
						<uni-grid-item>
						<view @click="goToProgramInfo(info)" class="item-program">
							<view class="item-program-cover">
								<view class="icon about item-program-cover-view">&#xe659;</view>
							</view>
							<view class="item-program-name uni-ellipsis">
								关于
							</view>
						</view>
						</uni-grid-item>
						</uni-grid>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		articleBaseUrl
	} from '@/common/api/article.js'
	import {
		css,
		js
	} from '@/utils/webapp.js'
	import {
		creatNativeLoading
	} from '@/utils/NativeView.js'
	import programMixin from "@/common/mixin/programMixin.js"
	export default {
		mixins:[programMixin],
		data() {
			return {
				id:"",
				show: false,
				info: {
					
				},
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			};
		},
		async onLoad(options) {
			this.id = options.id
			this.info = await this.getProgramDetailInfo(this.id);
			setTimeout(() => {
				this.show = true
			}, 2000)

		},
		methods: {
			/**
			 * 显示菜单
			 */
			showMenu() {
				console.log("显示菜单")
				this.$refs.popup.open('bottom')

			},
			/**
			 * 关闭窗口
			 */
			closeView() {
				uni.switchTab({
					url: '/pages/program/program'
				});
			},
			/**
			 * 刷新界面
			 */
			reload(){
				uni.reLaunch({
					url: `/pages/programDetail/programDetail?id=${this.id}`,
					animationType: "slide-in-bottom"
				});
			}
		}
	}
</script>
<style lang="scss">
	@import "../../common/style/program.scss";
	page {
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.program-detail {
		width: 100%;
		height: 100%;

		.program-loading {
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: #fff;
			padding: 30% 0;
			box-sizing: border-box;

			.loading-top {
				.loading-top-logo {
					.image {
						width: 266rpx;
						height: 266rpx;
						display: block;
						margin: auto;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}

				.loading-top-text {
					margin-top: 90rpx;
					font-size: 38rpx;
					text-align: center;
				}
			}

			.loading-bottom {
				text-align: center;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
			}


		}

		.program-capsule {
			position: absolute;
			z-index: 99;
			right: 40rpx;
			top: 60rpx;
			width: 180rpx;
			height: 60rpx;
			font-size: 32rpx;
			background-color: rgba(255, 255, 255, .9);
			border: 1rpx solid $uni-text-color-disable;
			border-radius: $uni-border-radius-big;

			.program-capsule-item {
				margin: 10rpx 0;
				box-sizing: border-box;

				&:first-child {
					border-right: 1rpx solid $uni-text-color-disable;
					;
				}
			}
		}

	}

	.popup-menu {
		background-color: #fff;
		.popup-menu-title {
		}
		.popup-menu-item{
			.item-program {
			width: 100rpx;
			.item-program-cover{
				width: 100%;
				background-color: $uni-bg-color-grey;
				border-radius: $uni-border-radius-lg;
				.item-program-cover-view{
					text-align: center;
				}
				.collect{
					color: $uni-color-success;
				}
				.reload{
					color: $uni-color-warning;
				}
				.about{
					color: $uni-color-theme;
				}
				.unlock{
					color:$uni-text-color-grey
				}
			}
			.item-program-name{
				font-size: $uni-font-size-sm;
			}
			}
		}

	}

	iframe {
		width: 100%;
		height: 100%;
		display: block;
		border: 0px;
	}
</style>
