const app = getApp();
import util from '../../utils/api' 
import { getCurrentDate } from '../../utils/util'


Page({ 
  data: {
    index00: '',//职务
    entryArray00: ['力工', '劳务用工', '劳务配合人员', '安全员','安全负责人','工人','施工队长','特殊工种作业人员','现场负责人','队长（班组长）'],//职务 
    index01: '',//体检结果
    entryArray01: ['健康', '基本健康无职业禁忌', '有职业禁忌'],//体检结果 
    index02: '',//分包公司
    entryArray02: [],//分包公司
    index03: '',//隶属项目
    entryArray03: [], //隶属项目   
    index04: '',//工种/岗位
    entryArray04: ['分包安全员', '分包班长', '分包负责人', '力工','劳务协作人员', '劳务配合','施工队长','普工','木工','登高作业','登高架设作业','钢筋工'],//工种/岗位 
    
    date01: '', //安规考试时间
    date02: '', //体检时间

    isPhotoUrl: '', //是否上传了一张图片
    uploadPhotoFont: '上传中...',//上传图片文字的提示

    getProjectList: [], //后台获取获取项目信息 
    getCompanyList: [], //后台获取获分包公司信息 

    //提交需要上传的参数
    userName: '', //姓名 (true)
    recordCode: '', //记录码 (true)
    userMobile: '', // 手机号 (true)
    userInsurancestatus: '', //保险状态?
    userIdcard: '', //身份证 (true)
    userPosition: '', //职务 (true)
    userSafeperformance: '', //安规成绩
    medicalTime: '', //体检时间yyyy-MM-dd
    userSafeTime: '', //安考时间 yyyy-MM-dd
    medicalResult: '', //体检结果
    userCompanyid: '', //分包公司ID (true)
    userCompany: '', //分包公司名称 (true)
    userProjectid: '', //项目ID(true)
    userProject: '', //项目名称(true)
    userWorktype: '', //工种 (true) 
    userPhoto: '', //照片附件上传返回的ID(true)
    createUser: '',// 当前登录人ID 
      
  },
  onLoad: function (options) {
      //后台获取 分包公司
      util.$post(util.GETCOMPANYLIST_API).then((res) => {
        var entryArray02 = res.data.list.map((item) => item.companyName)
        this.setData({
          entryArray02: entryArray02,
          getCompanyList: res.data.list
        });
      })

      //后台获取 所有项目部
      util.$post(util.GETPROJECTLIST_API).then((res)=>{ 
        var entryArray03 = res.data.list.map((item)=> item.projectName)
        this.setData({
          entryArray03: entryArray03,
          getProjectList: res.data.list
        }); 
      });  
  },

  bindPickerChange00: function (e) {//职务
    this.setData({
      index00: e.detail.value
    });
  },
  bindPickerChange01: function (e) {//体检结果
    this.setData({
      index01: e.detail.value
    });
  },
  bindPickerChange02: function (e) {//分包公司(ID)
    this.setData({
      index02: e.detail.value
    });
    this.setData({ 
      userCompanyid: this.data.getCompanyList[this.data.index02].id
    }); 
  },
  bindPickerChange03: function (e) {//所属项目部 (ID)
    this.setData({
      index03: e.detail.value
    });
    this.setData({ 
      userProjectid: this.data.getProjectList[this.data.index03].id
    }); 
  },
  bindPickerChange04: function (e) {//工种/岗位 
    console.log(e)
    this.setData({
      index04: e.detail.value
    })
  },
 

  bindDateChange01: function (e) {//体检时间
    this.setData({
      date01: e.detail.value
    })
  },
  bindDateChange02: function (e) {//入场安全考试时间
    this.setData({
      date02: e.detail.value
    })
  }, 

  bindUploadImg:function(){//上传传图片事件 
    wx.chooseImage({
    success: (res) => {
      var tempFilePaths = res.tempFilePaths 
      this.setData({
        isPhotoUrl:tempFilePaths[0]
      }) 
      wx.uploadFile({
        url: util.UPLOADFIL_API, //图片上传接口
        filePath: tempFilePaths[0],
        name: 'file',
        formData:{
          'user': 'test'
        },
        success: (res) =>{  
          this.setData({ 
              uploadPhotoFont:'上传成功',
              userPhoto: JSON.parse(res.data).id
          })
           
        }
      })
    }
  })
  },

  formSubmit: function(e) {   //最底部提交表单 
    var warn = "";//弹框时提示的内容  
    var flag = true;//判断信息输入是否完整   
    if(e.detail.value.userName==""){  
      warn = "请输入姓名!";  
    }else if(e.detail.value.recordCode==""){  
      warn = "请输入记录码!";  
    }else if(e.detail.value.userMobile==""){  
      warn = "请输入联系电话!";  
    }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.userMobile))){  
      warn = "手机号格式不正确";  
    }else if(e.detail.value.userIdcard==""){  
      warn = "请输入身份证!";  
    }else if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(e.detail.value.userIdcard))){  
      warn = "身份证格式不正确";  
    }else if(this.data.index00==""){  
      warn = "请选择职务!";  
    }else if(e.detail.value.userSafeperformance==""){  
      warn = "请输入考试成绩!";  
    }else if(this.data.index02==""){  
      warn = "请选择项所属单位!";  
    }else if(this.data.index03==""){  
      warn = "请选择项目部!";  
    }else if(this.data.index04==""){  
      warn = "请选择工种/岗位!";  
    }
    else if(this.data.isPhotoUrl==""){  
      warn = "请上传照片附件";  
    }else{  
       flag=false;//若必要信息都填写，则不用弹框， 
       // 提交给后台(这里是需要验证的)
      util.$post(util.CREATEUSER_API,{ 
            userName:e.detail.value.userName,
            recordCode:e.detail.value.recordCode,
            userMobile:e.detail.value.userMobile,
            userInsurancestatus:e.detail.value.userInsurancestatus,
            userIdcard:e.detail.value.userIdcard,
            userPosition:this.data.entryArray00[this.data.index00],
            userSafeperformance:e.detail.value.userSafeperformance,
            userSafeTime: this.data.date01,
            medicalTime: this.data.date02,
            medicalResult: this.data.entryArray01[this.data.index01],
            userCompanyid: this.data.userCompanyid,
            userCompany: this.data.entryArray02[this.data.index02],
            userProjectid: this.data.userProjectid,
            userProject: this.data.entryArray03[this.data.index03],
            userWorktype: this.data.entryArray04[this.data.index04],
            userPhoto:this.data.userPhoto,
            createUser: wx.getStorageSync('UserInfor').user.id
        }).then((res) => {  
           if (res.resultCode==200) { 
              wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
              }); 
              // 2s提交成功返回首页
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
           }   
      })  
    }    
    if(flag==true){//如果 参数不对提示相应的错误类型  
        wx.showToast({
          title: warn,
          icon: 'none',
          duration: 2000
       })
    } 
    

    
  },
})