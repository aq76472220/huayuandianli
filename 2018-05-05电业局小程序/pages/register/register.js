const app = getApp();
import util from '../../utils/api'  

Page({
  data: {
    index01: '',//所属项目部选择的第几个
    entryArray01: [], //所属项目部
    getProjectList: [], //后台获取获取项目信息  
    // 提交注册需要传的参数
    userName: '',//用户名
    mobileNo: '', //手机号 
    projectId: '', //项目ID
    weChatId: '', //微信号
  },
  onLoad: function (options) { 

    //后台获取 所有项目部
    util.$post(util.GETPROJECTLIST_API).then((res)=>{  
      var entryArray01 = res.data.list.map((item)=> item.projectName)
      this.setData({
        entryArray01: entryArray01,
        getProjectList: res.data.list
      }); 
    })
  },
  
  bindUserNameHandle:function(e){//姓名
    this.setData({
      userName: e.detail.value
    })
  },

  bindUserIdcard: function (e) {//身份证后四位
    this.setData({
      userIdcard: e.detail.value
    })
  },

  bindMobileNoHandle: function (e) {//手机号
    this.setData({
      mobileNo: e.detail.value
    })
  },

  bindPickerChange01: function (e) {//所属项目部(ID)
    this.setData({
      index01: e.detail.value
    }); 
    this.setData({ 
      projectId: this.data.getProjectList[this.data.index01].id
    }); 
  },

  // bindGetUserInfo: function(e) {//获取用户信息
  //   console.log(e.detail.userInfo)
  // },

  // 注册按钮注册
  bindRegisterformSubmit:function(e){
    console.log(e.detail.value)
    var warn = "";//弹框时提示的内容  
    var flag = true;//判断信息输入是否完整   
    if(e.detail.value.userName==""){  
      warn = "请输入姓名!";  
    } else if (e.detail.value.userIdcard == "") {
      warn = "请输入你身份证的后四位!";
    }else if(e.detail.value.mobileNo==""){  
      warn = "请输入手机号!";  
    }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.mobileNo))){  
      warn = "手机号格式不正确!";  
    }else if(this.data.projectId==""){  
      warn = "请选择所属项目部!";  
    }else{  
       flag=false;//若必要信息都填写，则不用弹框， 
       util.$post(util.REGISTER_API,{
          userName:this.data.userName,
          userIdcard: this.data.userIdcard,
          mobileNo:this.data.mobileNo,
          projectId:this.data.projectId,
          weChatId: wx.getStorageSync('openId')
       }).then((res) => { 
            if(res.resultCode==200){
                wx.showToast({
                  title: '注册成功',
                  icon: 'success',
                  duration: 2000
                });
              // 返回成功后把当前用户的状态存在缓存
              wx.setStorageSync('UserInfor', res.data);
              //直接跳转首页 
              setTimeout(()=>{
                wx.navigateTo({  
                    url: '../index/index'
                }) 
              },2000) 
          }else if(res.resultCode==202){
             //后返回的 错误提示
              wx.showToast({
                title: res.data.error,
                icon: 'none',
                duration: 2000
             })
           }; 
        })  
    }  
    //如果信息填写不完整，弹出输入框  
    if(flag==true){   
        wx.showToast({
          title: warn,
          icon: 'none',
          duration: 2000
       })
    }  
  }
})