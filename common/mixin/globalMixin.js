import { mapGetters,mapMutations,mapActions } from 'vuex'
export default {
	data(){
		return{
			
		}
	},
	mounted(){
		
	},
	methods:{
		...mapMutations(['setUserInfo','setLoginType']),
		...mapActions(['getUserInfoStore','loginOut']),
		/**
		 * 返回上一页
		 */
		navigateBack(){
			uni.navigateBack()
		},
	},
	computed: {
		...mapGetters(['loginType','onlineType','userInfo','configObj']),
	}
}