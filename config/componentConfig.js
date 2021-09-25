/**** 此文件说明请看注释 *****/
// 可以用自己项目的请求方法
// 请求配置说明：https://ext.dcloud.net.cn/plugin?id=822
import $http from '@/common/lib/request.js';
/**** 结束 *****/
const platform = uni.getSystemInfoSync().platform;
export default {
    // 发起ajax请求获取服务端版本号
    getServerNo: (version, isPrompt = false, callback) => {
        let httpData = {
            version: version.versionCode,
            // 版本名称
            versionName: version.versionName,
            // setupPage参数说明（判断用户是不是从设置页面点击的更新，如果是设置页面点击的更新，有不要用静默更新了，不然用户点击没反应很奇怪的）
            setupPage: isPrompt   
        };
        if (platform == "android") {
            httpData.type = 1101;
        } else {
            httpData.type = 1102;
        }
        /* 接口入参说明
         * version: 应用当前版本号（已自动获取）
         * versionName: 应用当前版本名称（已自动获取）
         * type：平台（1101是安卓，1102是IOS）
         */
        /****************以下是示例*******************/
        // 可以用自己项目的请求方法（接口自己找后台要，插件不提供）
        $http.get("/AppUpdateController/updateApp", httpData,{
            isPrompt: isPrompt
        }).then(res => {
            /* res的数据说明
             * | 参数名称        | 一定返回     | 类型        | 描述
             * | -------------|--------- | --------- | ------------- |
             * | versionCode     | y        | int       | 版本号        |
             * | versionName     | y        | String    | 版本名称      |
             * | versionInfo     | y        | String    | 版本信息      |
             * | updateType      | y        | String    | forcibly = 强制更新, solicit = 弹窗确认更新, silent = 静默更新 |
             * | downloadUrl     | y        | String    | 版本下载链接（IOS安装包更新请放跳转store应用商店链接,安卓apk和wgt文件放文件下载链接）  |
             */
            if (res && res.downloadUrl) {
                // 兼容之前的版本（updateType是新版才有的参数）
                if(res.updateType){
                    callback && callback(res);
                } else {
                    if(res.forceUpdate){
                        res.updateType = "forcibly";
                    } else {
                        res.updateType = "solicit";
                    }
                    callback && callback(res);
                }
            } else if (isPrompt) {
                uni.showToast({
                    title: "暂无新版本",
                    icon: "none"
                });
            }
        }).catch(e=>{
			console.log(e)
			uni.showToast({
			    title: "版本检查失败",
			    icon: "none"
			});
		});
        /****************以上是示例*******************/
    },
    // 弹窗主颜色（不填默认粉色）
    appUpdateColor: "e67249",
    // 弹窗图标（不填显示默认图标，链接配置示例如： '/static/demo/ic_attention.png'）
    appUpdateIcon: '/static/app/logo.png'
}