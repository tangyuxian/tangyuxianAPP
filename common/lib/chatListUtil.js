import {hasValueFromArray} from '@/utils/format_array'
/**
 * 清除列表中的消息角标
 */
const clearNum = (item,chatList) =>{
	const index = hasValueFromArray(chatList,"id",item.id).index;
	if(index == -1) return chatList;
	chatList[index].num = 0;
	return chatList;
}
/**
 * 是否不提醒当前会话
 */
const setMute = (muteType,item,chatList) =>{
	const index = hasValueFromArray(chatList,"id",item.id).index;
	chatList[index].mute = muteType;
	return chatList;
}


const messageObject = {
	type: "user", //system:系统消息  user:用户消息
	msg: {
		id: 1,
		type: "text", //text:文本消息 voice:音频 img:图片 redEnvelope:红包
		time: "12:56", //消息时间
		createTime:"2021-7-4 18:11:18",
		userinfo: { //用户信息
			uid: 0, //用户标识
			username: "大黑哥", //用户名
			face: "/static/images/img/face.jpg" //用户头像
		},
		content: {
			text: "为什么温度会相差那么大？", //文本内容
			url: "/static/voice/1.mp3", //图片或音频地址
			length: "00:06", //音频长度
			w: 200, //图片宽度
			h: 200, //图片高度
			blessing: "恭喜发财，大吉大利，万事如意", //红包描述
			rid: 0, //红包标识
			isReceived: false //是否已领取
		}
	}
}
const messageParams = {
	msgtype:"user",//主体消息类型(group 群消息;user 用户消息)
	type:"text", //text:文本消息 voice:音频 img:图片 redEnvelope:红包
	fromid:"", //来源id
	toid:"", //接收者id
	text:"",//文本内容
	url:"", //图片或音频地址
	length:"", //音频长度
	w:"",//图片宽
	h:"",//图片高
	blessing:"",//红包描述
	rid:"",//红包标识
	isreceived:"",//是否已被领取
}
export {
	clearNum,
	setMute
}