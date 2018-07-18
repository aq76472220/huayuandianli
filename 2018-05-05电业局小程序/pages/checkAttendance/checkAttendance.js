import {  generateDays, translateFormateDate} from './calendarUtil'
const app = getApp();
import util from '../../utils/api'
import { getCurrentDate  } from '../../utils/util'

Page({
  data: {
    date: '',//2018-05
    today: '',//今天
    week: ['日', '一', '二', '三', '四', '五', '六'], //星期
    isChecked:true,
    year:'', //当前年

    // 查看考勤请求后台参数
    searchDate: '',//查下时间
    userIds: '', //用户ID
    projectId: '',//项目ID

    notCardList:[],//未打卡数据
    monthList: [{}],//每天的数据
    typeArr: []//后台返回的类型
  },

  onLoad: function (options) {  
    var currentDate = getCurrentDate();//获取日期的方法  
    this.setData({
      userIds:options.userId, //userId(单个过来就是1个)
      year: currentDate.getYear()//获取当年
    })

    
    
    // 第一次后台获取考勤列表  
    util.$post(util.GETCHECKWORKLIST_API, {
      searchDate: currentDate.getYearMonth(),
      userIds: options.userId,
      projectId: wx.getStorageSync('UserInfor').user.userProjectid,  
    }).then((res) => {
      console.log(res)
      if (res.resultCode == 200) { 
          var  typeArr = res.data.list[0].list.map((item)=>{
            return item.state
          }); 
          this.setData({
            date: currentDate.getYearMonth(),
            dateCN: translateFormateDate(currentDate.getYearMonth()),
            monthList: generateDays(currentDate.getYearMonth(), typeArr),
            today: currentDate.getFullDate()
          });
          this.getNotCardList()//取误打卡单的列表   

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
  getNotCardList: function(){ 
    // 取误打卡单的列表(状态是4为未打卡)
    let notCardList = this.data.monthList.filter((item, index) => {
      return item.type == 4;
    }); 
    this.setData({
      notCardList
    }) 
  },
 
  //点击月份选择年月
  bindPickerChange: function (e) {  
    // 选择月份后台获取考勤列表  
    util.$post(util.GETCHECKWORKLIST_API, {
      searchDate: e.detail.value,
      userIds: this.data.userIds,
      projectId: wx.getStorageSync('UserInfor').user.userProjectid,  
    }).then((res) => { 
      if (res.resultCode == 200) { 
          var  typeArr = res.data.list[0].list.map((item)=>{
            return item.state
          }); 
          this.setData({
            monthList: generateDays(e.detail.value,typeArr),
            date: e.detail.value,
            dateCN: translateFormateDate(e.detail.value)
          });
          this.getNotCardList()//取误打卡单的列表   

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

  //是否全部未打卡事件
  checkboxChange:function(){
    this.setData({
      isChecked: !this.data.isChecked
    });

    if (this.data.isChecked){
      this.getNotCardList()
    }else{
      this.setData({
        notCardList:[]
      })
    }  
  },

  //点击‘提交误打卡单’按钮异步提交
  submitNotCardListHandle:function(){ 
    var noClockDates = this.data.notCardList.map((item)=>{
      return item.value
    }) 
    //向后台提交未打卡
    util.$post(util.CREATEAPPROVAL_API,{
      approvalType:2,
      userId: this.data.userIds,
      remark:'补卡说明',
      noClockDates: noClockDates.join(',')
    }).then((res) => {
      if (res.resultCode == 200) {
        wx.showToast({
          title: '已提交，等待审核！',
          icon: 'none',
          duration: 2000
        });

        setTimeout(()=>{
          wx.navigateTo({
            url: '../index/index'
          })
        },2000)
        
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

})




