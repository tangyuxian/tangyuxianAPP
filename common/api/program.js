import request from "../lib/request.js"
/**
 * 获取小程序列表
 */
 const getProgramListApi  = data=>{
	return request.get("/AppProgramController/selectPage",data)
}

/**
 * 获取小程序详情
 */
const getProgramDetailApi = data =>{
	return request.get("/AppProgramController/selectById",data)
}

export {
	getProgramListApi,
	getProgramDetailApi
}