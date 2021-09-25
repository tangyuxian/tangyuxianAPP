<template>
	<view class="article">
		<view v-for="(item,index) in list" :key="index" class="item">
			<uni-card
			    mode="style"
			    :is-shadow="true"
			    :thumbnail="randomPicUrl+'?id='+index"
			    :note="item.categories.category"
				@click="choose(item)"
			>
			    <view class="main">
					<view class="title">
						{{item.title}}
					</view>
					<view class="extra">
						{{item.tags.tag.toString()}}
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex' 
	export default {
		props:{
			list:{
				type:Array,
				default () {
					return []
				}
			}
		},
		name:"tyx-article",
		data() {
			return {
			};
		},
		computed: {
			...mapGetters(['configObj']),
			randomPicUrl(){
				return this.configObj.articleRandomPicUrl
			}
		},
		methods:{
			choose(info){
				this.$emit("choose",info)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.article{
		.item{
			margin-bottom: 40rpx;
			.uni-card{
				border-radius: $uni-border-radius-big;
				overflow: hidden;
				/deep/ .uni-card__thumbnailimage{
					height: 428rpx;
				}
			}
			.uni-border{
				&::after{
					border-radius:  ($uni-border-radius-big*2);
				}
			}
			.uni-card--shadow{
				box-shadow: $uni-box-shadow-lg
			}
			.main{
				.title{
					font-size: $uni-font-size-big;
					font-weight: bold;
				}
			}
		}
	}
</style>
