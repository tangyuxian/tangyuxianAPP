<template>
	<view class="programSearch">
		<view class="search">
			<uni-search-bar v-model="name" @confirm="search" focus placeholder="搜索小程序" :radius="100"></uni-search-bar>
		</view>
		<view class="list">
			<uni-list>
				<uni-list-item clickable @click="chooseprogramItem(item,index)" v-for="(item,index) in list"
					:key="index" :title="item.name" :note="item.introduce" :thumb="item.logo" thumb-size="lg">
				</uni-list-item>
			</uni-list>
		</view>
		<uni-load-more :status="status" :content-text="contentText" />
	</view>
</template>

<script>
	import programMixin from "@/common/mixin/programMixin.js"
	import {
		getProgramListApi
	} from "@/common/api/program.js"
	export default {
		mixins:[programMixin],
		data() {
			return {
				name: "",
				list: [],
				page: 1,
				limit: 20,
				status: 'loading',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				contentTextFav: {
					contentDefault: '添加',
					contentFav: '已添加'
				}
			};
		},
		mounted() {
			this.getListData();
		},
		methods: {
			/**
			 * 获取列表数据
			 */
			async getListData() {
				this.status = "loading"
				let params = {
					name: this.name,
					page: this.page,
					limit: this.limit
				}
				let data = await getProgramListApi(params);
				let total = data.total;
				this.list = [...this.list, ...data.records];
				if (this.list.length < total) {
					this.page = this.page + 1;
					this.status = "more"
				} else {
					this.status = 'noMore'
				}

			},
			/**
			 * 搜索
			 */
			search() {
				this.page = 1;
				this.list = [];
				this.getListData();
			}
		},
		/**
		 * 上拉加载
		 */
		onReachBottom() {
			this.getListData();
		},

	}
</script>

<style lang="scss" scoped>
	.list-solt-header {
		padding: 0 15rpx;
		box-sizing: border-box;

		.image {
			width: 133rpx;
			height: 133rpx;
		}
	}
</style>
