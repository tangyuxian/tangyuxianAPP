<template>
	<view class="register">
	
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="/static/images/app/logo.png"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="userNameData"
					type="text"
					maxlength="30"
					placeholder="邮箱"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="20"
					placeholder="登录密码"
					isShowPass
				></wInput>
				<wInput
					v-model="name"
					type="text"
					maxlength="10"
					placeholder="用户昵称"
					isShowPass
				></wInput>
				<wInput
					v-model="verCode"
					type="text"
					maxlength="5"
					placeholder="验证码"
					
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
					
			</view>
			<view class="uni-flex uni-flex-center">	
			<wButton 
				bgColor="#e67249"
				class="wbutton"
				text="注 册"
				:rotate="isRotate" 
				@click.native="startReg()"
			></wButton>
			</view>
			<!-- 底部信息 -->
			<view class="footer">
				<text 
					@tap="isShowAgree" 
					class="cuIcon"
					:class="showAgree?'cuIcon-radiobox':'cuIcon-round'"
				> 同意</text>
				<!-- 协议地址 -->
				<view @click="goToDetail">《糖羽仙APP用户协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import {isEmail} from '@/utils/verifyUtil.js'
	import {getEmailCodeApi,registerUserApi} from '@/common/api/user.js'
	export default {
		data() {
			return {
				userNameData:'', // 用户/电话
				name:'', //昵称
				passData:'', //密码
				verCode:"", //验证码
				showAgree:true, //协议是否选择
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this= this;
		},
		methods: {
			/**
			 * 跳转到文章详情
			 */
			goToDetail(){
				let url = this.configObj.appAgreementUrl;
				uni.navigateTo({
				    url: `/pages/articleDetail/articleDetail?name=APP使用协议&url=${url}`
				});
			},
			isShowAgree(){
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
			async getVerCode(){
				//获取验证码
				if (!isEmail(_this.userNameData)) {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '邮箱验证不正确'
				    });
				    return false;
				}
				uni.showLoading({
					title: '验证码发送中',
					mask:true
				});
				let params = {
					email:_this.userNameData
				}
				try{
					await getEmailCodeApi(params);
					this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
					setTimeout(function(){
						_this.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
					},60*1000)
				}catch(e){
					//TODO handle the exception
				}
				uni.hideLoading();
				
			},
		    async startReg() {
				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请先同意《用户使用协议》'
				    });
				    return false;
				}
				if (!isEmail(_this.userNameData)) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '邮箱验证不正确'
				    });
				    return false;
				}
				if (!this.name) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请输入昵称'
				    });
				    return false;
				}
		        if (this.passData.length == "") {
		            uni.showToast({
		                icon: 'none',
						position: 'bottom',
		                title: '请输入密码'
		            });
		            return false;
		        }
				if (this.verCode.length == "") {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请输入验证码'
				    });
				    return false;
				}
				let params = {
					username:this.userNameData,
					password:this.passData,
					name:this.name,
					from:"app",
					code:this.verCode
				}
				_this.isRotate=true
				try{
					await registerUserApi(params)
					console.log("注册成功")
					uni.showToast({
					    title: '注册成功',
						mask:true
					});
					setTimeout(()=>{
						uni.navigateBack()
					},1500)
				}catch(e){
					//TODO handle the exception
				}
				_this.isRotate=false
		    }
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>