<template>
	<view class="program">
		<view class="search" @click="goToSearchProgram">
			<uni-search-bar placeholder="搜索小程序" :radius="100"></uni-search-bar>
			<view class="search-disabled"></view>
		</view>
		<view class="main">
			<uni-grid  :column="4" :showBorder="false" :square="false">
				<uni-grid-item>
					<view @click="openShop" class="item-program">
						<view class="item-program-cover">
							<image class="image uni-boder-radius-radian" src="/static/images/app/app-shop.png" mode=""></image>
						</view>
						<view class="item-program-name uni-ellipsis">
							应用商店
						</view>
					</view>
				</uni-grid-item>
				<uni-grid-item v-for="(item,index) in programList" :key="index">
					<view @click="chooseprogramItem(item,index)" @longpress="showMoreMenu(item,index)" class="item-program">
						<view class="item-program-cover">
							<image class="image uni-boder-radius-radian" :src="item.logo" mode=""></image>
						</view>
						<view class="item-program-name uni-ellipsis">
							{{item.name}}
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<uni-popup ref="dialog" type="dialog">
		    <uni-popup-dialog  title="提示"  :content="dialogContent" :duration="2000"   @confirm="removeProgramItem"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import programMixin from "@/common/mixin/programMixin.js"
	export default {
		mixins:[programMixin],
		data() {
			return {

			};
		},
		methods: {
			...mapMutations(['getProgramList']),
			/**
			 * 点击跳转到搜索页面
			 */
			goToSearchProgram() {
				uni.navigateTo({
				    url: `/pages/program/programSearch`
				});
			},
			/**
			 * 打开应用商店
			 */
			openShop(){
				uni.showToast({
					title: '正在装修中,敬请期待',
					icon: 'none'
				});
			},
			/** 长按显示更多菜单
			 * @param {Object} item
			 */
			showMoreMenu(item,index){
				let _this = this;
				uni.showActionSheet({
				    itemList: ['关于', '移除'],
				    success: function (res) {
						if(res.tapIndex == 0){
							_this.goToProgramInfo(item);
						}else{
							if(_this.programList.length == 1){
								uni.showToast({
									title: '请至少保留一个小程序',
									icon: 'none'
								});
								return;
							}
							_this.openRemoveProgramDialog(item)
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

<style lang="scss" scoped>
	@import "../../common/style/program.scss";
	.program {
		.search {
			position: relative;

			.search-disabled {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
