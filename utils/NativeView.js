
/**
 * 创建原生窗口加载动画
 */
const creatNativeLoading= ()=>{
	let loadingPic = "/static/images/other/loading.gif";
	let	view = new plus.nativeObj.View('test',{top:'0',left:'0',height:'100%',width:'100%',backgroundColor:'rgba(255,255,255,0.9)'});
	// 绘制图片
	view.drawBitmap( loadingPic, {top:'50%',left:'0',width:'20px',height:'20px'},{top:'50%',left:'30%',width:'100px',height:'100px'}  );
	view.show();
	return view;
}


export {
	creatNativeLoading
}