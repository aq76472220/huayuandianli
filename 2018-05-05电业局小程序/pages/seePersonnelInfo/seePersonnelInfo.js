const app = getApp();
import util from '../../utils/api'
import { getCurrentDate } from '../../utils/util'

Page({
  data: {
   //后台获取用户信息
    UserDetail: {},

    //往下个页面要传的参数 
    userId:''
  },
  onLoad: function (options) {
    
    this.setData({
      userId:options.id
    })

    //后台获取用户信息
    util.$post(util.GETUSERDETAIL_API, {
      userId: options.id
    }).then((res) => {
      if (res.resultCode == 200) {

        console.log(res.data)

        this.setData({
          UserDetail: res.data.user
        })
      } else if (res.resultCode == 202) {
        //后返回的 错误提示
        wx.showToast({
          title: res.data.error,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
 
})