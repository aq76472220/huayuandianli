const app = getApp();
import util from '../../utils/api' 
import { getCurrentDate } from '../../utils/util'

Page({
  data: {
    // 要往一页传的用户ID
    userId:'',
 
    // 后台返回的格式供预览
    id:'', //用户ID
    userName:'', //姓名 
    personnelType:'', //人员类型
    national:'', //民族
    contact: '', //联系人
    medicalResult: '',//体检结果
    medicalTime:'',//体检时间
    userSafeTime:'', //安规考试时间
    recordCode:'',//记录码
    jobState:'', //在职状态 0在职 1离职
    userPwd:'',//密码
    userPosition:'',//职务
    userMobile:'',//手机号
    userIdcard:'',//身份证
    userWorktype: '',//工种
    userPhoto:'', //照片
    userRemark:'',// 备注
    userQrcode:'',//二维码
    weChatId:'',//微信号
    createUser:'',//
    userCompanyid:'', //隶属分包公司ID
    userCompany:'', //隶属分包公司
    userSafeperformance: '',//安规成绩
    userInsurancestatus:'',//保险状态
    userProjectid:'',//项目ID
    userProject:'', //项目名称
    userType: '', //用户类别（1：总部人员2：作业人员3：项目管理员)
    //以上是供自己看的

    //后台获取用户信息
    UserDetail:{}
  },
  onLoad: function (options) { 
    var UserInfor = wx.getStorageSync('UserInfor');
    var userType = UserInfor ? UserInfor.user.userType : '';
    this.setData({
      userId: options.userId,
      userType: userType
    });
 

    //后台获取用户信息
    util.$post(util.GETUSERDETAIL_API,{
      userId: options.userId
      }).then((res) => { 
         if (res.resultCode==200) {  
            this.setData({
                UserDetail:res.data.user
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