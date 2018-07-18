 
import util from './utils/api' 
App({
  onLaunch: function () {
   
    //调用微信登录接口    
    wx.login({
      success: function (res) { 
        if (res.code) { 
          util.$post(util.GETSESSIONCODE_API,{
            code: res.code
          }).then((res)=>{
            if (res.resultCode == 200) {
              //缓存存储openId
              wx.setStorageSync('openId', res.data.data.openid);  
            } else if (res.resultCode == 202) {
              //后返回的 错误提示
              wx.showToast({
                title: res.data.error,
                icon: 'none',
                duration: 2000
              })
            };
          })  
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    punchTime: 9 //打卡时间
  }
})