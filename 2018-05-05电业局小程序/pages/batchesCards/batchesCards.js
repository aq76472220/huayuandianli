// pages/batchesCards/batchesCards.js 
const app = getApp();
import util from '../../utils/api'
import { getCurrentDate } from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxList: [
      // {  userName: '王小二', isChecked: true },
    ],
    isShowModel:0, //模态框
    isAllCheck: false,//全选 全不选
    checkedLength:0,// 选中的个数
    projectIdCode:'',// 参数获取项目ID
    //PunchList: [], //选中的人员
    currentDayTime: "00/00 00:00:00",//当实时显示的时间
    currentTimeFixed:"00/00 00:00:00", //当前打卡时间

    UserInfor: '', //用户信息
    projectId: '', //项目ID
    userProject: '', //项目名称
  },
  onLoad: function (options) { 
    this.setData({
      projectIdCode: options.projectIdCode
    })

    // 时间显示
    this._getcurrentDayTime()
    setInterval(()=>{
      this._getcurrentDayTime()
    },1000)

    var UserInfor = wx.getStorageSync('UserInfor');
    var projectId = UserInfor ? UserInfor.user.userProjectid : '';
    var userProject = UserInfor ? UserInfor.user.userProject : '';
    //缓存获取当前项目的ID
    this.setData({
      UserInfor: UserInfor, //缓存获取用户所有信息
      projectId: this.data.projectIdCode, //传参过来获取项目ID
      //projectId: projectId, //缓存获取 项目ID
      userProject: userProject, //项目名称 
    }); 
    // 设置标题栏标题
    wx.setNavigationBarTitle({
      title: this.data.userProject
    });
    //循环该项目下的所有人员
    util.$post(util.GETUSERFORPROJECTID_API,{
      projectId: this.data.projectId
    }).then((res) => {
      if (res.resultCode == 200) {
        var checkboxList = res.data.list.filter((item)=>{
          return item.auditType==0
        })

        this.setData({
          checkboxList: checkboxList
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
  _getcurrentDayTime:function(){//获取当前日期时间
    var currentDayTime = getCurrentDate().getMonthDay() + ' ' + getCurrentDate().getFullTime();
    this.setData({
      currentDayTime
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

  // 模态框
  IsShowHandle: function () {
    this.setData({
      isShowModel: !this.data.isShowModel
    });
    // 点击确定返回首页
    wx.navigateTo({
      url: '../index/index'
    })
  }, 
  // 点击每个列表事件
  bindItemCheckHandle: function (e){ 
    var idx = e.currentTarget.dataset.idx;
    var checkboxList = this.data.checkboxList; 
    if (checkboxList[idx].isChecked){
      checkboxList[idx].isChecked= false;
      this.setData({
          checkboxList
      })
    }else{
      checkboxList[idx].isChecked= true;
      this.setData({
          checkboxList
      })
    } 
    this._calcLen()//计算选中checkbox的个数
    //点击单个 全选或者不全选
    if (this.data.checkedLength == this.data.checkboxList.length) {
      this.setData({
        isAllCheck: true
      })
    } else {
      this.setData({
        isAllCheck: false
      })
    }
  },
 
  bindAllCheckHandle: function(){//全选全不选按钮
    var checkboxList=this.data.checkboxList;
    if(!this.data.isAllCheck){ 
        checkboxList.forEach((item)=>{
            item.isChecked =  true
        });
        this.setData({
          checkboxList
        })
    }else { 
        checkboxList.forEach((item)=>{
            item.isChecked =  false
        });
        this.setData({
          checkboxList
        })
    } 
    this.setData({
      isAllCheck:!this.data.isAllCheck
    });

    this._calcLen()//计算选中checkbox的个数
  },
  bindPunchHandle(){// 提交批量打卡
    var newCheckboxList = this.data.checkboxList.filter((item, index)=>{
      return item.isChecked==true;
    });

    var mapNewCheckboxListStr = newCheckboxList.map((item)=>{
      return item.id
    }).join(',')

    if (newCheckboxList.length==0){
      wx.showToast({
        title: '你未选择人员',
        icon: 'none',
        duration: 2000
      });
    }else{ 
      if (getCurrentDate().getHour() >= app.globalData.punchTime) {
        wx.showToast({
          title: '9点之后不能打卡！',
          icon: 'none',
          duration: 2000
        }) 
        return //9点过后不能考勤 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      } 

      util.$post(util.BATCHCLOCK_API, {
        lat: wx.getStorageSync('latLng').lat,
        lng: wx.getStorageSync('latLng').lng,
        userIds: mapNewCheckboxListStr,
        projectId: this.data.projectId
      }).then((res) => {
        var currentDate = getCurrentDate();//获取日期的方法 
        if (res.resultCode == 200) {
          this.setData({
            isShowModel: 1,
            currentTimeFixed: (currentDate.getMonthDay() + ' ' + currentDate.getFullTime()),
          });
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
   
  }
})