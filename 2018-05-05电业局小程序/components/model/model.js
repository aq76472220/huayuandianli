// components/component-tag-name.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowModel:{
      type: Number,
      value: ''
    },
    ModelId:{
      type: String,
      value:''
    },
    isGetUser: {
      type: String,
      value: false
    }
  }, 
  data: {  
    ModelTitle: '提示',//弹窗标题 
  }, 
  methods: { 
    _confirm: function (e) {
      //普通关闭模态弹窗
      this.triggerEvent('IsShowHandle', {})
    },
      //获取用户信息关闭模态弹窗
    _bindGetUserInfo:function(e){
      this.triggerEvent('bindGetUserInfo', { 'userInfo': e})
    }
  }
})
