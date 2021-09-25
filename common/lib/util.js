import $C from './httpConfig.js'
export default {
	// 获取存储列表数据
	getStorage(key) {
		let data = null;
		// #ifdef H5
		if ($C.env === 'dev') {
			data = window.sessionStorage.getItem(key)
		} else {
			data = uni.getStorageSync(key)
		}
		// #endif
		// #ifndef H5
		data = uni.getStorageSync(key)
		// #endif
		return data
	},
	// 设置存储
	setStorage(key, data) {
		// #ifdef H5
		if ($C.env === 'dev') {
			return window.sessionStorage.setItem(key, data)
		} else {
			return uni.setStorageSync(key, data)
		}
		// #endif
		// #ifndef H5
		return uni.setStorageSync(key, data)
		// #endif
	},
	// 删除存储
	removeStorage(key) {
		// #ifdef H5
		if ($C.env === 'dev') {
			return window.sessionStorage.removeItem(key);
		} else {
			return uni.removeStorageSync(key)
		}
		// #endif
		// #ifndef H5
		return uni.removeStorageSync(key)
		// #endif
	},
	uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	hasValueFromArray (arr, origin, value){
	      if (!Array.isArray) {
	        //Polyfill
	        Array.isArray = function (arg) {
	          return Object.prototype.toString.call(arg) === "[object Array]";
	        };
	      }
	      if (!Array.isArray(arr)) {
	        throw new Error("arr 不是一个数组");
	      } else {
	        let flag = false; //没有匹配
	        let temp = {};
	        let index = -1;
	        for (let i = 0; i < arr.length; i++) {
	          if (arr[i][origin] === value) {
	            flag = true;
	            temp = arr[i];
	            index = i;
	            break;
	          }
	        }
	        if (!flag) {
	          temp = null;
	        }
	        return {index: index, value: temp};
	      }
	    }

}
