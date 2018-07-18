
const _formatNumber = n => {
  n = n.toString() 
  return n[1] ? n : '0' + n
}

function _addZero(num) {
  return num < 10 ? '0' + num : num
}
 
function getCurrentDate() {
  const today = new Date() //时间对象
  const year = today.getFullYear()//年
  const month = today.getMonth() + 1//月
  const day = today.getDate()//日
  const week = today.getDay()//天
  const hour = today.getHours()//时
  const minute = today.getMinutes()//分
  const second = today.getSeconds()//秒 
  function getFullDate() { //2018-01-01
    return [year, month, day].map(_formatNumber).join('-')
  } 
  function getYearMonth() {//2018-01
    return [year, month].map(_formatNumber).join('-')
  }

  function getYear() {//2018
    return year
  }

  function getMonthDay() {//01/01
    return [month, day].map(_formatNumber).join('/')
  }

  function getFullTime(){//09:00:00
    return [hour, minute, second].map(_formatNumber).join(':')
  }

  function getHour() {//09
    return hour
  }

  return {
    getFullDate,
    getYear,
    getYearMonth,
    getMonthDay,
    getFullTime,
    getHour,
  }
}



// 时间格式化
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate() 
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds(); 
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}


module.exports = {
  getCurrentDate,
  formatTime
}
