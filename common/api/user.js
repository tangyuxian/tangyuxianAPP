import request from "../lib/request.js"
/**
 * 登录接口
 */
const loginApi  = data=>{
	return request.post("/AppController/login",data)
}

/**
 * 获取用户信息(需要登录)
 */
const getUserInfoApi = () =>{
	console.log("getUserInfoApi调用该方法了")
	return request.get("/GlobalUserController/getUserInfo",{},{token:true})
}
/**
 * 获取其它用户信息(需要登录)
 */
const getUserInfoForClientIdApi = data =>{
	return request.get("/GlobalUserController/getUserInfoForClientId",data,{token:true})
}
/**
 * 校验信息(需要登录)
 */
const validatorLoginApi = () =>{
	return request.get("/GlobalUserController/validatorLogin",{},{token:true})
}

/**
 * 更新用户信息(需要登录)
 */
const setUserInfoApi = data =>{
	return request.post("/GlobalUserController/update",data,{token:true})
}

/**
 * 发送邮箱验证码接口
 */
const getEmailCodeApi = data =>{
	return request.post("/GlobalUserController/getEmailCode",data)
}
/**
 * 注册用户
 */
const registerUserApi = data =>{
	return request.post("/GlobalUserController/registerUser",data)
}
/**
 * 重置密码
 */
const forgetUserApi = data =>{
	return request.post("/GlobalUserController/forgetUser",data)
}
/**
 * 获取配置信息
 */
const getConfigApi = data =>{
	return request.get("/GlobalConfigController/getAppConfig",data)
}



/**
 * 图片上传(需要登录)
 */
const uploadApi = filePath =>{
	return request.upload("/FileController/upload",{filePath})
}
export {
	loginApi,
	getUserInfoApi,
	getUserInfoForClientIdApi,
	validatorLoginApi,
	setUserInfoApi,
	getEmailCodeApi,
	registerUserApi,
	forgetUserApi,
	getConfigApi,
	uploadApi
}