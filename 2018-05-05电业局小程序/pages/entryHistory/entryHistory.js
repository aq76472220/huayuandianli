const app = getApp();
import util from '../../utils/api'
import { getCurrentDate } from '../../utils/util' 
Page({
  data: {
    pageList1: [],

    UserInfor: '', //用户信息
    projectId: '', //项目ID
    userId: '',//用户ID
 
  },
  onLoad: function (options) {
    var UserInfor = wx.getStorageSync('UserInfor');
    var projectId = UserInfor ? UserInfor.user.userProjectid : '';
    var userId = UserInfor ? UserInfor.user.id : '';

    //缓存获取当前项目的ID
    this.setData({
      URL: util.URL, //获取全局url
      UserInfor: UserInfor, //缓存获取用户所有信息
      projectId: projectId, //缓存获取 项目ID
      userId: userId, //缓存获取用户ID
    })

    //后台获取该项目下的所有用户（入职历史记录）
    util.$post(util.GETUSERFORPROJECTID_API,{
      projectId: this.data.projectId,
      crateUser: this.data.userId
    }).then((res)=>{ 
      if (res.resultCode == 200) {
        console.log(res)
        this.setData({
          pageList1: res.data.list
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
  },
 
 
})