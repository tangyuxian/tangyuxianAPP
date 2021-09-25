import $C from './httpConfig.js';
import $U from './util.js';
import $store from '@/store/index.js';
export default {
	// 全局配置
	common: {
		baseUrl: $C.baseUrl,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: {},
		method: 'GET',
		dataType: 'json',
		token: false
	},
	// 请求 返回promise
	request(options = {}) {
		// 组织参数
		options.url = (options.baseUrl || this.common.baseUrl) + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		options.token = options.token || this.common.token

		// 请求之前验证...
		// token验证
		if (options.token) {
			let xAuthToken = $U.getStorage('xAuthToken');
			let jtwToken =  $U.getStorage('jtwToken');
			// 二次验证
			if (!xAuthToken) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				// token不存在时跳转
				return uni.navigateTo({
					url: '/pages/login/login',
				});
			}
			// 往header头中添加token
			options.header['x-auth-token'] = xAuthToken;
			options.header['jtw-token'] = jtwToken;
		}else{
			Reflect.deleteProperty(options.header,'x-auth-token')
			Reflect.deleteProperty(options.header,'jtw-token')
		}
		// 请求
		return new Promise((res, rej) => {
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					// 返回原始数据
					if (options.native) {
						return res(result)
					}

					if(options.dataType == "xml"){
						return res(result.data)
					}
					// 访问错误
					if (!result.data.success) {
						uni.showToast({
							title: result.data.data || '服务端失败',
							icon: 'none'
						});
						if(result.data.code == "ACCOUNT_UNAUTHENTICATED"){
							uni.navigateTo({
							    url: `/pages/login/login`
							});
						}
						//$store.dispatch('logout')
						return rej(result.data)
					}


					// 服务端失败
					if (result.statusCode !== 200) {
						if (options.toast !== false) {
							uni.showToast({
								title: result.data.data || '服务端失败',
								icon: 'none'
							});
						}

						// token不合法，直接退出登录
						if (result.data.data === 'Token 令牌不合法!') {
							$store.dispatch('logout')
						}
						return rej(result.data)
					}
					console.log(result)
					// 其他验证...
					if(result.header["jtw-token"]){
						$U.setStorage('jtwToken',result.header["jtw-token"])
						
					}
					if(result.header["x-auth-token"]){
						$U.setStorage('xAuthToken',result.header["x-auth-token"])
					}
					if(result.header["X-Auth-Token"]){
						$U.setStorage('xAuthToken',result.header["X-Auth-Token"])
					}
					// 成功
					let data = result.data.data
					res(data)
				},
				fail: (error) => {
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej(error)
				}
			});
		})
	},
	// get请求
	get(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	// delete请求
	del(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	// 上传文件
	upload(url, data, onProgress = false) {
		return new Promise((result, reject) => {
			// 上传
			let xAuthToken = $U.getStorage('xAuthToken');
			let jtwToken =  $U.getStorage('jtwToken');
			// 二次验证
			if (!xAuthToken) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				// token不存在时跳转
				return uni.navigateTo({
					url: '/pages/login/login',
				});
			}

			const uploadTask = uni.uploadFile({
				url: this.common.baseUrl + url,
				filePath: data.filePath,
				name: "file",
				header: {
					// 'Content-Type': 'multipart/form-data',
					'x-auth-token':xAuthToken,
					'jtw-token':jtwToken
				},
				success: (res) => {
					let message = JSON.parse(res.data)
					if (!message.success) {
						return uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					}
				
					result(message.data);
				},
				fail: (err) => {
					console.log(err);
					reject(err)
				}
			})

			uploadTask.onProgressUpdate((res) => {
				if (typeof onProgress === 'function') {
					onProgress(res.progress)
				}
			});

		})
	}
}
