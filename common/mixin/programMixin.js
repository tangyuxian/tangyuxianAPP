import {
	mapGetters,
	mapMutations
} from 'vuex'
import {
	hasValueFromArray
} from "@/utils/format_array.js"
import {
	getProgramDetailApi
} from "@/common/api/program.js"
export default {
	data() {
		return {
			dialogContent: "确认移除该小程序?",
			dialogItem: null
		}
	},
	methods: {
		...mapMutations(['setProgramList']),
		/**
		 * 获取小程序详情
		 * @param {Object} id
		 */
		async getProgramDetailInfo(id) {
			let params = {
				id
			}
			let info =  await getProgramDetailApi(params);
			return info;
		},
		/**打开某个小程序
		 * @param {Object} val
		 */
		async chooseprogramItem(item, index) {
			let info = await this.getProgramDetailInfo(item.id)
			if (info && info.state == 1) {
				uni.navigateTo({
					url: `/pages/programDetail/programDetail?id=${item.id}`,
					animationType: "slide-in-bottom"
				});
			} else {
				uni.showToast({
					title: '当前小程序暂不可用',
					icon: 'none'
				});
			}


		},
		/** 跳转到小程序详情页
		 * @param {Object} item
		 */
		async goToProgramInfo(item) {
			let info = await this.getProgramDetailInfo(item.id)
			if (info && info.state == 1) {
				uni.navigateTo({
					url: `/pages/program/programInfo?id=${item.id}`
				});
			} else {
				uni.showToast({
					title: '当前小程序暂不可用',
					icon: 'none'
				});
			}
		},
		/** 打开移除小程序的对话框
		 * @param {Object} item
		 */
		openRemoveProgramDialog(item) {
			this.dialogItem = item;
			this.$refs.dialog.open()
		},
		/**	移除某项
		 * @param {Object} item
		 */
		removeProgramItem(item = null) {
			item = item || this.dialogItem;
			let programIndex = this.isIndexOfProgram(item);
			let programList = this.programList;
			programList.splice(programIndex, 1);
			this.setProgramList(programList);
		},
		/**
		 * 新增小程序到列表
		 */
		addProgramItem(item = null){
			item = item || this.dialogItem;
			let programIndex = this.isIndexOfProgram(item);
			if(programIndex != -1){
				uni.showToast({
					title: '当前小程序已存在',
					icon: 'none'
				});
			}else{
				let programList = this.programList;
				programList.push(item);
				this.setProgramList(programList);
			}
		},
		/**
		 * 获取小程序在列表位置
		 */
		isIndexOfProgram(item = null){
			let index = -1;
			if(item == null){
				return index;
			}
			index = hasValueFromArray(this.programList, 'id', item.id).index
			return index
			
		}
	},
	computed: {
		...mapGetters(['programList'])

	}
}
