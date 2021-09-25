<template>
	<view class="article-detail">
		<!-- <web-view :webview-styles="webviewStyles" :src="url"></web-view> -->
		<iframe v-show="show" :webview-styles="webviewStyles" :src="url"></iframe>
		<view v-show="!show" class="article-loading uni-flex uni-column uni-flex-center">
			<view class="image">
				<image src="../../static/images/other/loading.gif" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {articleBaseUrl} from '@/common/api/article.js'
	import {mapGetters} from 'vuex' 
	import {css,js} from '@/utils/webapp.js'
	import {creatNativeLoading} from '@/utils/NativeView.js'
	export default {
		data() {
			return {
				show:false,
				url:"",
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			};
		},
		onLoad(options) {
			console.log(this.configObj)
			this.url = this.configObj.articleBaseUrl+'/'+options.url+'?from=app'
			setTimeout(()=>{
				uni.setNavigationBarTitle({
				　　title:options.name?options.name:"文章详情"
				})
				this.show = true
			},1200)
			// #ifdef APP-PLUS
			//this.changeWebView()
			// #endif
			
		},
		computed:{
			...mapGetters(['configObj'])
		},
		methods:{
			changeWebView(){
				let nativeView = creatNativeLoading();
				let wv;
				let  currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
				this.show = true
				setTimeout(function() {
					wv = currentWebview.children()[0]
					wv.setCssText(css)
					wv.evalJS(js);
					
				}, 600); //如果是页面初始化调用时，需要延时一下
				setTimeout(()=>{
					nativeView.close()
				},2000)
			}
		}
	}
</script>

<style lang="scss">
	.article-detail{
		.article-loading{
			position: absolute; 
			width: 100%;
			height: 100%;
			background-color: #e6dedc;
			.image{
				width: 266rpx;
				height: 200rpx;
				margin: auto;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		
		
	}
	iframe{
		width: 100%;
		height:100%;
		position: absolute; 
		display: block; 
		border: 0px; 
	}
</style>
