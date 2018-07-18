// pages/attendanceSheet/attendanceSheet.js
const app = getApp();
import util from '../../utils/api'
import { getCurrentDate } from '../../utils/util'
Page({
  data: {
    checkboxList:[
      // { userName: '王小二', userName: '王小二', isChecked: 'true' }, 
    ],
    date01: '',
    checkedLength: 0,// 选中的个数
    isAllCheck: false,//全选 全不选 
   
  },
  onLoad: function (options) {

    var UserInfor = wx.getStorageSync('UserInfor');
    var projectId = UserInfor ? UserInfor.user.userProjectid : '';
    var userProject = UserInfor ? UserInfor.user.userProject : '';
    //缓存获取当前项目的ID
    this.setData({
      UserInfor: UserInfor, //缓存获取用户所有信息
      projectId: projectId, //缓存获取 项目ID
      userProject: userProject, //项目名称 
      date01: getCurrentDate().getYearMonth()
    });
    // 设置标题栏标题
    wx.setNavigationBarTitle({
      title: this.data.userProject
    });
    //循环该项目下的所有人员
    util.$post(util.GETUSERFORPROJECTID_API, {
      projectId: this.data.projectId
    }).then((res) => {
      if (res.resultCode == 200) {
        this.setData({
          checkboxList: res.data.list
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

  _calcLen: function () {//计算选中checkbox的个数
    var checkedLength = 0;
    this.data.checkboxList.filter((item) => {
      if (item.isChecked == true) {
        checkedLength++
      }
    })
    this.setData({
      checkedLength
    })
  },

  bindAllCheckHandle: function () {//全选全不选按钮
    var checkboxList = this.data.checkboxList;
    if (!this.data.isAllCheck) {
      checkboxList.forEach((item) => {
        item.isChecked = true
      });
      this.setData({
        checkboxList
      })
    } else {
      checkboxList.forEach((item) => {
        item.isChecked = false
      });
      this.setData({
        checkboxList
      })
    }
    this.setData({
      isAllCheck: !this.data.isAllCheck
    });

    this._calcLen()//计算选中checkbox的个数
  },
  // 点击每个列表事件
  bindItemCheckHandle: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var checkboxList = this.data.checkboxList;
    if (checkboxList[idx].isChecked) {
      checkboxList[idx].isChecked = false;
      this.setData({
        checkboxList
      })
    } else {
      checkboxList[idx].isChecked = true;
      this.setData({
        checkboxList
      })
    }; 
    this._calcLen()//计算选中checkbox的个数  
    //点击单个 全选或者不全选
    if (this.data.checkedLength == this.data.checkboxList.length) {
      this.setData({
        isAllCheck: true
      })
    }else{
      this.setData({
        isAllCheck: false
      })
    }

  },
 
  //select查询时间
  bindDateChange01: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date01: e.detail.value
    })
  }, 
  // 提交生成考勤表
    makeAttendanceHandle:function(){
      var newCheckboxList = this.data.checkboxList.filter((item, index) => {
        return item.isChecked == true;
      }); 
      // 选中人数的集合
      var mapNewCheckboxListStr = newCheckboxList.map((item) => {
        return item.id
      }).join(',')

      if (this.data.checkedLength == 0) {
        wx.showToast({
          title: '你未选择人员',
          icon: 'none',
          duration: 2000
        });
      }else{ 
        wx.navigateTo({
          url: '../buildAttendance/buildAttendance?searchDate=' + this.data.date01 + '&userIds=' + mapNewCheckboxListStr + '&projectId=' + this.data.projectId
        })
      }

    
  }
})