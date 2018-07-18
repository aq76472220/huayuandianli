
function _addZero(num) {
  return num < 10 ? '0' + num : num
}
 
 
function translateFormateDate(date) { 
  var year  = date.split('-')[0]
  var month = date.split('-')[1]
  return year + '年' + month + '月'
}
 
//输入年份，判断是润年还是平年
function is_leap(year) {
  return year % 400 === 0  || year % 4 === 0 && year % 100 !== 0 ? true : false
}

//输入年份，获取这一年每个月的天数
function m_days(year) {
  return [31,28+is_leap(year),31,30,31,30,31,31,30,31,30,31]
}

//输入年月，返回这个月的第一天是星期几 
function firstDay(date) { 
  return new Date(date + '-01').getDay()
}

//输入年月，返回一个数组
function generateDays(date, typeArr) {
  var year  = date.split('-')[0]
  var month = date.split('-')[1] - 1
  var arr = [] 

  //设置一个月的第一天的位置
  for(let j = 0; j < firstDay(date); j++) {
    arr.push({value: '', num: ''})
  }
 
  //循环日期
  for(let i = 0; i < m_days(year)[month]; i++) {
    let value = year + '-' + _addZero(month + 1) + '-' + _addZero(i+1);
     let type = typeArr[i] 
     arr.push({
         num: i+1,
         value: value,
         type: type
    })
  } 
  return arr
} 
module.exports = { 
    generateDays,
    translateFormateDate
}