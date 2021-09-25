import request from "../lib/request.js"
/**
 * 发送消息
 */
const sendMessageApi = data =>{
	return request.post("/ChatMessageController/sendMessage",data,{token:true})
}
/**
 * 发送消息
 */
const getOnlineList = data =>{
	return request.get("/ChatMessageController/getOnlineList",data,{token:true})
}
export {
	sendMessageApi,
	getOnlineList
}
