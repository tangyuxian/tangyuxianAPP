import $U from '@/common/lib/util.js';
import $H from '@/common/lib/request.js';
import {getArticleListApi} from '@/common/api/article.js'
import {parseXml,xml2json} from '@/utils/xml2json.js'
import { DOMParser } from 'xmldom'
export default {
	state:{
		articleList:[],
		time:"",
		thresholdTime:24*60*60*1000
	},
	mutations:{
		setArticleList(state,event){
			state.articleList = event
		},
		setArticleTime(state,event){
			state.time = event
		}
	},
	actions:{
		// 获取文章列表
		getArticleList({commit,state},event) {
			return new Promise((resolve, reject) => {
				let thresholdTimeEd = new Date().getTime() - state.time; //与缓存对比过去的时间
				if((thresholdTimeEd<state.thresholdTime) && event != 'again' && state.articleList.length>0){
					resolve(state.articleList);
					return;
				}
				getArticleListApi().then(res=>{
					let  xmlParser = xml2json(new DOMParser().parseFromString(res.data),"");
					resolve(JSON.parse(xmlParser).search.entry)
					commit('setArticleList',JSON.parse(xmlParser).search.entry)
					commit('setArticleTime',new Date().getTime())
				})
			})
		},
	}
}