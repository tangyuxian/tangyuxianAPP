<template>
	<view class="home uni-flex uni-column">
		<view class="top uni-flex uni-flex-between">
			<view class="left">
				<view class="left_top">
					{{date}}
				</view>
				<view class="left_bottom">
					{{week}}
				</view>
			</view>
			<view class="right uni-flex uni-column uni-flex-center">
				<view @click="goToMe" class="right_face uni-boder-radius-circular">
					<image class="uni-image" :src="loginType && userInfo.face?userInfo.face:'/static/images/icon/icon-user.png'" mode=""></image>
				</view>
			</view>
		</view>
		<view class="list uni-flex-item">
			<tyx-article @choose="goToDetail" :list="articleList"></tyx-article>
		</view>
		<uni-load-more :status="status" :content-text="contentText" />
	</view>
</template>

<script>
	import { mapActions } from 'vuex'
	import {group} from '@/utils/format_array.js'
	import time from '@/utils/time.js'
	export default {
		data() {
			return {
				date:"-",
				week:"星期 - ",
				status: 'loading',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				articleList	:[], //文章列表
				groupList:[], //分组
				page:1,
				limit:5
			}
		},
		computed: {
			
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			this.articleList=[];
			this.status = "loading"
			setTimeout(()=>{
				this.getList('again')
				uni.stopPullDownRefresh();
			}, 1000);
		},
		/**
		 * 上拉加载
		 */
		onReachBottom() {
			this.page ++;
			setTimeout(()=>{
				if(this.page<=this.groupList.length){
					this.articleList = this.articleList.concat(this.groupList[this.page-1])
				}
				if(this.page>=this.groupList.length){
					this.status = 'noMore'
				}
			},600)
		},
		onLoad() {
			this.getList()
		},
		onShow(){
			this.getTime();
		},
		methods:{
			...mapActions(['getArticleList']),
			/**
			 * 获取列表信息
			 */
			getList(action='default'){
				this.page = 1;
				this.getArticleList(action).then(res=>{
					this.groupList = group(res,this.limit);
					this.articleList = this.groupList[this.page-1];
				})
			},
			/**
			 * 跳转到详情
			 */
			goToDetail(info){
				uni.navigateTo({
				    url: `/pages/articleDetail/articleDetail?name=${info.title}&url=${info.url}`
				});
			},
			/**
			 * 获取时间
			 */
			getTime(){
				this.date = time.dateFormat(new Date(),"{Mon}月{DD}日");
				this.week = time.dateFormat(new Date(),"星期{W}");
			},
			/**
			 * 打开用户中心
			 */
			goToMe(){
				if(this.loginType){
					uni.navigateTo({
					    url: `/pages/me/me`
					});
				}else{
					uni.navigateTo({
					    url: `/pages/login/login`
					});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.home {
		padding-top: 60rpx;
		.top {
			padding:$uni-spacing-col-card;
			.left {
				.left_top {
					color: $uni-text-color-grey;
					font-size: $uni-font-size-sm;
				}

				.left_bottom {
					font-size: $uni-font-size-big;
				}
			}
			.right{
				.right_face{
					width: 80rpx;
					height: 80rpx;
					box-shadow: $uni-box-shadow-base;
				}
			}
		}
	}
</style>
