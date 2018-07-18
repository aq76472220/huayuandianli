 

const app = getApp();
import util from '../../utils/api' 
import { getCurrentDate } from '../../utils/util'



Page({
  data: {
    navdata: [{ id: 1, name: '请假单' }, { id: 2, name: '未打卡单' }],
    currentTab: 0, //当前tab选中的位置
    pageList1: [],
    pageList2: [],
    hasMore: false,// 判断 数据是否全部加载完
    isLodingLock1: true, //锁 防止数据加载不出来多次请求
    isLodingLock2: true,
    page1: 1,
    page2: 1, 
    height:0, //设置高度

    // 缓存存储用户类型 (2：作业人员3：项目管理员)
    userType:''
  },
  onLoad: function () {
    // 系统获取设备高度
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        }) 
      }
    }); 

    //缓存获取缓存存储用户类型
    this.setData({
      userType: wx.getStorageSync('UserInfor').user.userType
    }); 

    this.getDataServer(1, util.GETAPPROVALLIST_API,1) //列表初始化
    this.getDataServer(2, util.GETAPPROVALLIST_API,2) //列表初始化
  },
 
  swichNav: function (e) { // tab切换 
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current,
      });
    }
  },

  // 加载更多01
  loadingMore1: function () {
    if (this.data.isLodingLock1) {
      this.setData({
        isLodingLock1: false
      })
      this.getDataServer(1, util.GETAPPROVALLIST_API,1)
    }
  },

  // 加载更多02
  loadingMore2: function () {
    if (this.data.isLodingLock2) {
      this.setData({
        isLodingLock2: false
      })
      this.getDataServer(2, util.GETAPPROVALLIST_API,2)
    }
  },

  //获取网络数据的方法
  getDataServer: function (idx, url, approvalType) { 
    this.setData({
      hasMore: true //当进来数据最下面显示‘玩了命的加载中’
    })
    //调用网络请求  
    util.$post(url,{
      approvalType: approvalType,
      userId: wx.getStorageSync('UserInfor').user.id,
      startPage: this.data['page' + idx],
      pageSize:20
    }).then((data) => {
        console.log(data)
        if (data.rows.list.length > 0 ) {
        this.setData({
            ['pageList' + idx]: this.data['pageList' + idx].concat(data.rows.list), //当前某个更新数据
            ['page' + idx]: this.data['page' + idx] + 1,//当前某个更新页码
            ['isLodingLock' + idx]: true, // 当前某个锁关闭 
          }); 

          if (data.rows.list.length < 20) {//数据小与20时候最下面显示‘没有跟多数据了’
            this.setData({
              hasMore: false //当加载完所有数据最下面显示‘没有跟多数据了’
            })
          }
        } else {
          this.setData({
            hasMore: false //当加载完所有数据最下面显示‘没有跟多数据了’
          })
        }
    }) 
  }, 
  // 同意请假
  agreeLeaveHandle:function(e){
    var id = e.target.dataset.id;
    var userId = e.target.dataset.userid;
    var idx = e.target.dataset.idx;  
    util.$post(util.APPROVAL_API,{
      id:id,
      userId: userId,
      state: 1
    }).then((res)=>{  
      if (res.resultCode == 200) {
        var pageList1 = this.data.pageList1
        console.log(e.target.dataset)
        pageList1[idx].state = 1;
        this.setData({
          pageList1
        }); 
        wx.showToast({
          title: '已同意',
          icon: 'none',
          duration: 2000
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

  // 同意未打卡申请
  agreePunchHandle: function (e) {
    var id = e.target.dataset.id;
    var userId = e.target.dataset.userid;
    var idx = e.target.dataset.idx;
    util.$post(util.APPROVAL_API, {
      id: id,
      userId: userId,
      state: 1
    }).then((res) => {
      if (res.resultCode == 200) {
        var pageList2 = this.data.pageList2
        console.log(e.target.dataset)
        pageList2[idx].state = 1;
        this.setData({
          pageList2
        });
        wx.showToast({
          title: '已同意',
          icon: 'none',
          duration: 2000
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
  }
})