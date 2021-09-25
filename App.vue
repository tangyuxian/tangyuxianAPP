<script>
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif

	export default {
		onLaunch: function() {
			this.$store.dispatch('getConfigObj')
			// console.log(this.$store.state.program.programList)
			if(this.$store.state.program.programList.length == 0){
				this.$store.dispatch('getProgramList',{page:1,limit:5})
			}
			this.$store.dispatch('loginInit')
			// #ifdef APP-PLUS
			APPUpdate();
			// #endif
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./common/style/common.scss");
</style>
