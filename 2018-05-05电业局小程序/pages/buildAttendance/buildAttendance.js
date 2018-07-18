// pages/buildAttendance/buildAttendance.js

const app = getApp();
import util from '../../utils/api'
import { getCurrentDate } from '../../utils/util'


Page({
  data: {
    pageList01:[],
    currentMonth:'',//管理人员用到的时间
    date01: '',//普通人员用到的时间

    UserInfor: '', //用户信息
    projectId: '', //项目ID
    userId: '',//用户ID
    userType: '',//用户类型
  },
  onLoad: function (options) {
    var UserInfor = wx.getStorageSync('UserInfor');
    var projectId = UserInfor ? UserInfor.user.userProjectid : '';
    var userId = UserInfor ? UserInfor.user.id : '';
    var userType = UserInfor ? UserInfor.user.userType : '';

    //缓存获取当前项目的ID
    this.setData({
      UserInfor: UserInfor, //缓存获取用户所有信息
      projectId: projectId, //缓存获取 项目ID
      userId: userId, //缓存获取用户ID
      userType: userType,//缓存获取用户类型  
      date01: getCurrentDate().getYearMonth()
    })


    if (this.data.userType==3){ //管理人员
      var currentMonth = options.searchDate.split('-')[1];
      this.setData({
        currentMonth
      })
      // 后台获取考勤列表
      util.$post(util.GETCHECKWORKLIST_API, {
        searchDate: options.searchDate,
        userIds: options.userIds,
        projectId: options.projectId
      }).then((res) => {
        this.setData({
          pageList01: res.data.list
        })
      })
    } else if (this.data.userType == 2){//普通人员
      this._changeAttendance();
    }
    
  },

  _changeAttendance:function(){
    // 后台获取考勤列表
    util.$post(util.GETCHECKWORKLIST_API, {
      searchDate: this.data.date01,
      userIds: this.data.userId,
      projectId: this.data.projectId
    }).then((res) => {
      this.setData({
        currentMonth: this.data.date01.split('-')[1],
        pageList01: res.data.list
      })
    })
  },

  bindDateChange01: function (e) { 
    this.setData({
      date01: e.detail.value, 
    });

    this._changeAttendance()
  },
})