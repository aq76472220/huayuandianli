const app = getApp();
import util from '../../utils/api' 
import { getCurrentDate } from '../../utils/util'

Page({
  data: {
    msgList: [], //公告
    avatarUrl:'',//用户头像
    projectIdCode:'',//扫码得到的项目ID
    locationAddress:'',
    currentTime: '00/00 00:00:00', //日期时间
    currentTimeFixed: '00/00 00:00:00', //日期时间
    isShowModel01:0,//个人打卡组件模态框（隐藏)
    isShowModel02:1, //获取用户信息

    UserInfor:'', //用户信息
    projectId: '', //项目ID
    userId: '',//用户ID
    userType: '',//用户类型
    userName: '',//姓名
    userPosition:'', //职务
    userCompany: '', //隶属分包公司
  },
  onLoad: function (options) {

    // 缓存获取用户信息
    this._getUserInfor();

    // 如果有用户头像就获取缓存的
    var avatarUrl = wx.getStorageSync('avatarUrl'); 
    if (avatarUrl){
      this.setData({
        avatarUrl: avatarUrl,
        isShowModel02:0
      })
    }; 
     
    var Timer = setInterval(()=>{ //每秒执行获取日期和时间
      var currentDate = getCurrentDate();//获取日期的方法 
      this.setData({
        currentTime: (currentDate.getMonthDay() + ' ' + currentDate.getFullTime())
      }) 
    },1000);

    // 第一次加载的时候获取经纬度
    this._getLocation()

    // 后台获取公告列表
    util.$post(util.GETNOTICELIST_API).then((res) => { 
      if (res.resultCode == 200) {
        var msgList = res.data.list
        if (msgList.length>20){
          msgList.length = 20
        };
        this.setData({
          msgList: msgList
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
  //缓存获取用户信息
  _getUserInfor:function(){
    var UserInfor = wx.getStorageSync('UserInfor');
    var projectId = UserInfor ? UserInfor.user.userProjectid : '';
    var userId = UserInfor ? UserInfor.user.id : '';
    var userType = UserInfor ? UserInfor.user.userType : '';
    var userName = UserInfor ? UserInfor.user.userName : '';
    var userPosition = UserInfor ? UserInfor.user.userPosition : '';
    var userCompany = UserInfor ? UserInfor.user.userCompany : '';
    //缓存获取当前项目的ID
    this.setData({
      UserInfor: UserInfor, //缓存获取用户所有信息
      projectId: projectId, //缓存获取 项目ID
      userId: userId, //缓存获取用户ID
      userType: userType,//缓存获取用户类型
      userName: userName,//姓名
      userPosition: userPosition,//职务
      userCompany: userCompany//隶属分包公司
    })
  },

  // 获取用户信息 
  getUserInfoHandle:function(e){
    
    //查缓存有没有用户信息，如果没有，根据openid调用接口，看有没有绑定，如果绑定了。我就返回你绑定的信息存储到缓存，（就不用再注册了） 
    util.$post(util.GETUSERBYOPENID_API, {
      weChatId: wx.getStorageSync('openId')
    }).then((res) => {
      if (res.resultCode == 200) {
        wx.setStorageSync('UserInfor', res.data);
        // 缓存获取用户信息
        this._getUserInfor()
      }
    });
    
    var userInfo = e.detail.userInfo.detail.userInfo  
    if (userInfo){//如果用户授权设置头像
      wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
      this.setData({
        avatarUrl: userInfo.avatarUrl, //设置头像url
        //isShowModel02: 0 //关闭自定义模态框
      })
    }; 
    this.setData({ 
      isShowModel02: 0 //关闭自定义模态框
    })
        
  },

  

  // 普通模态框关闭
  IsShowHandle:function(){
    this.setData({
      isShowModel01: !this.data.isShowModel01
    })
  },

  // // 获取用户信息模态框关闭
  // bindGetUserInfo:function(){
  //   this.setData({
  //     isShowModel02: !this.data.isShowModel01
  //   })
  // },

  _getLocation:function(){//获取地理位置信息
    // 获取当前位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //缓存设置经纬度
        wx.setStorageSync('latLng', { lat: res.latitude, lng: res.longitude })
      }
    });
  }, 
  //01打卡(个人/管理员)
  punchHandle:function(){
    if (!this.data.UserInfor){ //未注册绑定注册
      wx.showToast({
        title: '未注册',
        icon: 'none',
        duration: 2000
      })
      return
    };

    if (getCurrentDate().getHour() >= app.globalData.punchTime) {
      wx.showToast({
        title: '9点之后不能打卡！',
        icon: 'none',
        duration: 2000
      });
      return //9点过后不能考勤  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    };

    //如果用户授权地址拒绝了重新获取
    var latLng = wx.getStorageSync('latLng')
    if (!latLng){ 
      wx.showModal({ 
        content: '还没有获取到你的地理位置，是否允许？',
        success: (res)=> {
          if (res.confirm) { 
            wx.openSetting({
              success:  (res)=>{ 
                if (res.authSetting['scope.userLocation']) {
                  // 已经授权，可以直接调用 getLocation 
                  this._getLocation() 
                }
              }
            })  
          }
        }
      }) 
      return; 
    }
    //如果用户授权地址拒绝了重新获取


    // 普通员/班长扫码
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)  
        var projectIdCode = JSON.parse(res.result).projectId; 
        if (projectIdCode !== this.data.projectId){
          wx.showToast({
            title: '你不在该项目下！',
            icon: 'none',
            duration: 2000
          }) 
          return
        }else{
          console.log(projectIdCode) 
          this.setData({
            projectIdCode,
          }); 

          if (this.data.userType == 2){//普通员工打卡  
            util.$post(util.BATCHCLOCK_API, {
              lat: wx.getStorageSync('latLng').lat,
              lng: wx.getStorageSync('latLng').lng,
              userIds: this.data.userId,
              projectId: this.data.projectIdCode
              //projectId: this.data.projectId
            }).then((res) => {
              var currentDate = getCurrentDate();//获取日期的方法 
              if (res.resultCode == 200) {
                this.setData({
                  isShowModel01: 1,
                  currentTimeFixed: (currentDate.getMonthDay() + ' ' + currentDate.getFullTime()),
                  locationAddress: res.data.admName
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
          } else if (this.data.userType == 3) {//项目管理员打卡
            wx.navigateTo({
              url: '../batchesCards/batchesCards?projectIdCode=' + this.data.projectIdCode
            })
          }    
        }

      }
    });  
  },
  
  // 02注册（个人/管理员）
  registerHandle:function(){ 
    if (!this.data.UserInfor){ 
      wx.navigateTo({
        url: '../register/register'
      })
    }else{
      wx.showToast({
        title: '你已注册了',
        icon: 'none',
        duration: 2000
      })
    }

  },

  // 03点击审批(个人/管理员)
  approvalHandle:function(){
    if (!this.data.UserInfor) { //未注册绑定注册
      wx.showToast({
        title: '未注册',
        icon: 'none',
        duration: 2000
      })
      return
    } 
    wx.navigateTo({
      url: '../examinationApproval/examinationApproval'
    })
  },


  // 04考勤表(个人/管理员)
  attendanceHandle: function () {
    if (!this.data.UserInfor) { //未注册绑定注册
      wx.showToast({
        title: '未注册',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (this.data.userType == 3) {//班长查看考勤表 
      wx.navigateTo({
        url: '../attendanceSheet/attendanceSheet'
      }) 
    } else if (this.data.userType == 2) {//作业人员查看考勤表 
      wx.navigateTo({
        url: '../buildAttendance/buildAttendance'
      })
    }

    
  },

  // 05人员一览(管理员)
  personLookHandle: function () {
    if (!this.data.UserInfor) { //未注册绑定注册
      wx.showToast({
        title: '未注册',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.navigateTo({
      url: '../listPeople/listPeople?projectId=' + this.data.projectId
    })
  },

  // 06员工入职(管理员)
  entryHandle: function () {
    if (!this.data.UserInfor) { //未注册绑定注册
      wx.showToast({
        title: '未注册',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.navigateTo({
      url: '../newEmployee/newEmployee'
    })
  },

  // 07请假单 (个人)
  leaveHandle: function(){
    if (!this.data.UserInfor) { //未注册绑定注册
      wx.showToast({
        title: '未注册',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.navigateTo({
      url: '../leaveForm/leaveForm?userId='+this.data.userId
    })
  },

  //点击底部‘个人信息’按钮
  inforHandle:function(){
    if (!this.data.UserInfor) { //未注册绑定注册
      wx.showToast({
        title: '未注册',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.navigateTo({
      url: '../personalInformation/personalInformation?userId='+this.data.userId
    })
  },

  
})