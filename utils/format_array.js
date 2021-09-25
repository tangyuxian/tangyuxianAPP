// 把一个数组按照一定长度分割成若干数组
const group = (array, subGroupLength)=> {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
const hasValueFromArray=(arr, origin, value)=>{
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
export {
	group,
	hasValueFromArray
}