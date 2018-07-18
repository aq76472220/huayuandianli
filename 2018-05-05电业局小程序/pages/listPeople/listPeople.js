const app = getApp();
import util from '../../utils/api' 
import { getCurrentDate } from '../../utils/util'

Page({
  data: {
    UserForProjectList:[]
  },
  onLoad: function (options) { 
    // 设置标题栏标题
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('UserInfor').user.userProject
    });

  	//后台获取某项目下的所有用户
  	util.$post(util.GETUSERFORPROJECTID_API,{
        projectId:options.projectId
      }).then((res) => {
      		console.log(res)
         if (res.resultCode==200) { 
            this.setData({
                UserForProjectList:res.data.list
            }) 
         }else if(res.resultCode==202){
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