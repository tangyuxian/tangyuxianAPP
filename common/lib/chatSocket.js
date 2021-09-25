import $store from '@/store/index.js';
import Socket from '@/utils/Socket.js'
import $H from './request.js';
import $C from './httpConfig.js';
class chatSocket {
	constructor(arg) {
		console.log("初始化")
		this.url = $C.socketUrl;
		this.socket = null
		this.online = false
	    this.connectSocket()
	}
	/**
	 * 建立连接
	 */
	connectSocket(){
		if(this.online){
			console.log("已经是在线状态");
			return;
		}
		$store.commit("setOnlineType","loading")
		let option = {
		   debug:true,
		   onOpenAutoSendMsg:JSON.stringify({type:0,clientId:$store.state.user.userInfo.clientid}),
		   openCallback:res=>{
			  this.online = true;
			  $store.commit("setOnlineType","success")
		      console.log("建立连接成功",res)
		      //...
		   },
		   messageCallback:res=>{
		      console.log("接收到的消息",res)
			  $store.dispatch("handerSocketMessage",res)
		      //...
		   },
		   errorCallback:res=>{
			   $store.commit("setOnlineType","error")
		   },
		   removeSocket:res=>{
			   this.online = false
			   this.socket = null
			    $store.commit("setOnlineType","default")
		   }
		   //...
		}
		console.log("连接")
		this.socket = new Socket(this.url,option)
	}
	/**
	 * 发送消息
	 * @param {Object} msg
	 */
	sendMessage(msg){
		this.socket.send(msg);
	}
	/**
	 * 关闭连接
	 */
	closeSocket(){
		this.socket.removeSocket()
	}
}

export default chatSocket




