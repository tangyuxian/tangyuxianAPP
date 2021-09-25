//******输入文字校验文件 */
const isChineseChar = str => {
  var reg = /[u4e00-u9fa5]/
  return !reg.test(str)
};

const isEnglishChar = str => {
  var reg = /[A-Za-z]/
  return reg.test(str)
};

const isPhone = str => {
  let type = true
  if (!(/^1[0-9]{10}$/.test(str))) {
    type = false
  }
  return type
}

const isEmail = str => {
  let type = true
  if (!(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(str))) {
    type = false
  }
  return type
}

const isNumber = places => {
  let type = true
  if (!(/(^[\+\-]?[1-9]([0-9]*)$|^[0-9]$)/.test(places))) {
    type = false
  }
  return type
}
const isDigitr = places => {
  let type = true
  if (!(/(^([1-9]|\-[1-9])(([0-9])*\.?[0-9]*)$)|(^([0-9]|\-[0-9])\.?[0-9]*$)/.test(places))) {
    type = false
  }
  return type
}


const isCardNo = card => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(card) === false) {
    return false;
  }
  return true
}





export {
  isChineseChar,
  isEnglishChar,
  isPhone,
  isEmail,
  isNumber,
  isDigitr,
  isCardNo
}
