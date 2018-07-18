// pages/leaveForm/leaveForm.js
const app = getApp();
import util from '../../utils/api' 
import { getCurrentDate } from '../../utils/util'
import { dateTimePicker, getMonthDay } from '../../utils/dateTimePicker'
 

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    startYear: 2018,
    endYear: 2030,
    dateTimeArray:[],
    arr:[],

    dateTimeArray: [],
    dateTime: [],

    dateTimeArray00:[],
    dateTime00:[],
    currentDate00:'',

    dateTimeArray01:[],
    dateTime01:[],
    currentDate01:'',
    //上级页面传来的参数
    userId:'',
  },
  onLoad: function (options) {
      // this.setData({
      //   userId: options.userId
      // })

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker(this.data.startYear, this.data.endYear); 
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop(); 
    this.setData({  
      dateTimeArray: obj.dateTimeArray,
      dateTime: obj.dateTime
    });


  }, 
  changeDateTimeColumn00(e) { //开始时间
    this._changeDate(e,0)
  },
  changeDateTimeColumn01(e) { //结束时间
    this._changeDate(e,1)
  },
   _changeDate:function(e,n){ 
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    console.log(n)
    this.setData({
      ['dateTimeArray0'+n]: dateArr,
      ['dateTime0'+n]: arr
    }); 
    this.setData({
      ['currentDate0'+n]: ((this.data['dateTimeArray0' + n][0][this.data['dateTime0' + n][0]]) + '-' + (this.data['dateTimeArray0' + n][1][this.data['dateTime0' + n][1]]) + '-' + (this.data['dateTimeArray0' + n][2][this.data['dateTime0' + n][2]]) + ' ' + (this.data['dateTimeArray0' + n][3][this.data['dateTime0' + n][3]]) + ':'+(this.data['dateTimeArray0' + n][4][this.data['dateTime0' + n][4]]))
    })
  },

   bindSubmissionLeave:function(e){
     var startTime = new Date(this.data.currentDate00).getTime();
     var endtTime = new Date(this.data.currentDate01).getTime()

      var warn = "";//弹框时提示的内容  
      var flag = true;//判断信息输入是否完整   
      if (this.data.currentDate00==''){ 
        warn = "请输入选择开始时间!";  
      } else if (this.data.currentDate01 == ''){  
        warn = "请输入选择结束时间!";  
      }else if(startTime>=endtTime){  
        warn = "开始时间不能大于或等于结束时间!";  
      } else if (e.detail.value.reasonLeave == "") {
        warn = "请假事由不能为空!";
      }else{ 
        flag=false;//若必要信息都填写，则不用弹框， 
        util.$post(util.CREATEAPPROVAL_API,{
          approvalType: 1,
          userId: wx.getStorageSync('UserInfor').user.id,
          remark: e.detail.value.reasonLeave,
          startDate: (this.data.currentDate00+':00'),
          endDate: (this.data.currentDate01+':00'),
        }).then((res) => {
              console.log(res) 
              if(res.resultCode==200){
                  wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                  }); 
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

     // 提交请假给后台
    // util.$post(util.CREATEAPPROVAL_API).then((res) => { 
    //   if (res.resultCode == 200) { 
    //     this.setData({
           
    //     })
    //   } else if (res.resultCode == 202) {
    //     //后返回的 错误提示
    //     wx.showToast({
    //       title: res.data.error,
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    // }) 
  }
})