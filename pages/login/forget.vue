<template>
	<view class="forget">
		
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">若你忘记了密码，可在此重置新密码。</view>
				<wInput
					v-model="userNameData"
					type="text"
					maxlength="30"
					placeholder="请输入邮箱"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="20"
					placeholder="请输入新密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="verCode"
					type="text"
					maxlength="5"
					placeholder="验证码"
					
					isShowCode
					codeText="获取重置码"
					setTime="30"
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
			</view>
			<view class="uni-flex uni-flex-center">
			<wButton 
				bgColor="#e67249"
				class="wbutton"
				text="重置密码"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>
			</view>

		</view>
	</view>
</template>

<script>
	let _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import {isEmail} from '@/utils/verifyUtil.js'
	import {getEmailCodeApi,forgetUserApi} from '@/common/api/user.js'
	export default {
		data() {
			return {
				userNameData: "", //电话
				passData: "", //密码
				verCode:"", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
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
					title: '验证码发送中'
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
			async startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (!isEmail(this.userNameData)) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '邮箱验证不正确'
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
					code:this.verCode
				}
				_this.isRotate=true
				try{
					await forgetUserApi(params)
					uni.showToast({
					    title: '重置成功',
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

