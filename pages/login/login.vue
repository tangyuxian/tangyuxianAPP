<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="/static/images/app/logo.png"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput
					v-model="usernameData"
					type="text"
					maxlength="40"
					placeholder="请输入邮箱"
					:focus="isFocus"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="20"
					placeholder="密码"
				></wInput>
			</view>
			<view class="uni-flex uni-flex-center">
				<wButton
					bgColor="#e67249"
					class="wbutton"
					text="登 录"
					:rotate="isRotate" 
					@click="startLogin"
				></wButton>
			</view>
			
			
			<!-- 其他登录 -->
			<view v-if="false" class="other_login cuIcon">
				<view class="login_icon">
					<view class="cuIcon-weixin" @tap="login_weixin"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_weibo"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_github"></view>
				</view>
			</view>
			
			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import { mapActions } from 'vuex'
	export default {
		data() {
			return {
				usernameData:'', //用户/电话
				passData:'', //密码
				isRotate: false, //是否加载旋转
				isFocus: true // 是否聚焦
			};
		},
		components:{
			wInput,
			wButton,
		},
		computed:{
			
		},
		mounted() {
			
		},
		methods: {
			...mapActions(['loginStore']),
		    async startLogin(e){
				//登录
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.usernameData.length == "") {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '用户名不能为空'
				    });
				    return;
				}
		        if (this.passData.length == "") {
		            uni.showToast({
		                icon: 'none',
						position: 'bottom',
		                title: '请输入密码'
		            });
		            return;
		        }
				this.isRotate=true
				uni.showLoading({
					title: '登录中'
				});
				let params = {
					username:this.usernameData,
					password:this.passData
				}
				try{
					let res =  await this.loginStore(params);
					uni.switchTab({
						url: '/pages/home/home'
					});
					console.log("登录完毕")
				}catch(e){
					console.log("登录失败",e)
				}
				this.isRotate=false
				uni.hideLoading();
		    },
			login_weixin() {
				//微信登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_weibo() {
				//微博登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_github() {
				//github登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			}
		}
	}
</script>

<style scoped>
	@import url("@/components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>
