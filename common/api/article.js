import request from "../lib/request.js"
import store from "../../store/index.js"
/**
 * 请求文章列表
 */
 const getArticleListApi  = data=>{
	 console.log(store.getters.configObj.articleBaseUrl)
	return request.get("/search.xml",{},{
		baseUrl:store.getters.configObj.articleBaseUrl,
		native:true
	})
}

export {
	getArticleListApi
}