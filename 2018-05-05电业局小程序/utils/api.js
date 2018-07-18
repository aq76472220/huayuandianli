'use strict';
import Promise from './es6-promise.min'
 var URL = 'https://xxdyj.fengqianglife.com' //正式全局域名url
 //var URL = 'https://xxdyj.fengqianglife.com/pm' //测试01全局域名url
//var URL = 'http://118.190.155.115/pm' //测试02全局域名url

module.exports = {
  URL: URL,
  GETUSERBYOPENID_API: URL + '/wap/user/getUserByOpenId.mvc', //查询根据 OPENID查下微信号是否绑定
  GETSESSIONCODE_API: URL + '/wap/getSessionCode.mvc', //提交注册
  REGISTER_API: URL +'/wap/user/register.mvc', //提交注册
  BATCHCLOCK_API: URL + '/wap/batchClock.mvc', // 提交打卡（个人/班长）
  GETAPPROVALLIST_API: URL + '/wap/getApprovalList.mvc', // 获取 根据用户ID查询打卡、请假列表(打卡和请假情况，个人和班长)
  GETNOTICELIST_API: URL + '/wap/getNoticeList.mvc', // 获取首页公告列表
  GETCHECKWORKLIST_API: URL + '/wap/getCheckWorkList.mvc', // 获取考勤列表 （个人/班长） 
  CREATEAPPROVAL_API: URL + '/wap/createApproval.mvc', // 提交请假、补卡单申请 （个人）
  APPROVAL_API: URL + '/wap/approval.mvc', // 提交项目管理人员审批 请假、补卡单 （班长）
  GETUSERFORPROJECTID_API: URL +'/wap/user/getUserForProjectId.mvc', //获取该项目下的所有用户
  GETUSERDETAIL_API: URL +'/wap/user/getUserDetail.mvc', //获取用户信息
  GETPROJECTLIST_API: URL + '/wap/user/getProjectList.mvc',//获取项目信息列表
  GETCOMPANYLIST_API:  URL + '/wap/user/getCompanyList.mvc',//获取分包公司信息列表
  CREATEUSER_API: URL + '/wap/user/createUser.mvc',//提交新员工入职操作
  UPLOADFIL_API: URL + '/attachment/uploadFile.mvc',//提交图片上传


  $post(url, data) {
    wx.showLoading({
      title: '加载中...', //全局设置加载中
    });
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        header: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) { 
          resolve(res.data); 
          wx.hideLoading();//全局设置加载结束 
        },
        fail: function (res) {
          reject(res.data)
        }
      })
    })
  },
  $get(url) {
    return new Promise((resolve, reject) => {
      console.log(url)
      wx.request({
        url: url,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          resolve(res.data)
        },
        fail: function (res) {
          reject(res.data)
        }
      })
    })
  },
};
