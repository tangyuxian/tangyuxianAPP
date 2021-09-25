<template>
	<view class="programInfo">
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
		<view class="item">
			<uni-list>
				<uni-list-item v-if="info.developtype == 'user'" title="开发者" :rightText="info.developer"></uni-list-item>
				<uni-list-item title="开发团队" :rightText="info.developteam"></uni-list-item>
			</uni-list>
		</view>
		<view class="item">
			<uni-list>
				<uni-list-item title="AppId" :rightText="info.appid"></uni-list-item>
				<uni-list-item title="服务类型" :rightText="info.typename"></uni-list-item>
			</uni-list>
		</view>
		<view class="item">
			<uni-list>
				<uni-list-item direction="column"  title="主站网址">
					<view slot="footer" class="item-slot">
						<view  class="item-slot-url">
							{{info.mainurl}}
						</view>
					</view>
				</uni-list-item>
				<uni-list-item v-if="info.otherurls &&  info.otherurls.length>0" direction="column"  title="数据提供">
					<view slot="footer" class="item-slot">
						<view v-for="(item,index) in info.otherurls.split(',')" :key="index" class="item-slot-url">
							{{item}}
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		
	</view>

</template>

<script>
	import programMixin from "@/common/mixin/programMixin.js"
	export default {
		mixins:[programMixin],
		data() {
			return {
				id: "",
				info: {
					
				}
			}
		},
		async onLoad(option) {
			this.id = option.id
			this.info = await this.getProgramDetailInfo(this.id);

		},
		methods:{
		}
	}
</script>

<style lang="scss" >
	@import "../../common/style/program.scss";
	page {
		background-color: $uni-bg-color-chat;
	}
	.item{
		margin-bottom: 10rpx;
		.item-slot{
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
		}
	}
</style>
