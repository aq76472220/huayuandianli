const app = getApp();
import util from '../../utils/api'
const API_URL = "http://apicloud.mob.com/v1/cook/menu/search?name=%E7%BA%A2%E7%83%A7%E8%82%89&cid=0010001007&key=17113fceca309&size=40&page="


Page({
  data: {
    pageList1: [],
    hasMore: false,// 判断 数据是否全部加载完
    isLodingLock1: true, //锁 防止数据加载不出来多次请求
    page1: 1,
  },
  onLoad: function (options) {
    this.getDataServer(1, API_URL) //列表初始化
  },
  // 加载更多01
  loadingMore1: function () {
    if (this.data.isLodingLock1) {
      this.setData({
        isLodingLock1: false
      })
      this.getDataServer(1, API_URL)
    }
  },
  //获取网络数据的方法
  getDataServer: function (idx, url) {
    console.log(idx)
    this.setData({
      hasMore: true //当进来数据最下面显示‘玩了命的加载中’
    })
    //调用网络请求
    util.$get(url + this.data['page' + idx]).then((data) => {
      if (data.result.list.length > 0) {
        this.setData({
          ['pageList' + idx]: this.data['pageList' + idx].concat(data.result.list), //当前某个更新数据
          ['page' + idx]: this.data['page' + idx] + 1,//当前某个更新页码
          ['isLodingLock' + idx]: true // 当前某个锁关闭
        });
      } else {
        this.setData({
          hasMore: false //当加载完所有数据最下面显示‘没有跟多数据了’
        })
      }
    })
  }
})