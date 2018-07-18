const app = getApp();
import util from '../../utils/api'
import { formatTime} from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',//公告标题
    startDate: '',//公告时间
    noticeBody:'',//公告内容
  }, 
  onLoad: function (options) {
    var startDate = formatTime(new Date(parseInt(options.startDate))) 
      this.setData({
        title: options.title,
        startDate: startDate,
        noticeBody: options.noticeBody,
      })
  }
})