//app.js
App({
  onLaunch: function() {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        if (!res.data) that.goToAuth();
        that.globalData.userInfo = res.data;
      },
      fail: function() {
        that.goToAuth();
      }
    });
  },
  globalData: {
    userInfo: {}
  },
  checkAuth: function(func, value) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.goToAuth();
        } else {
          wx.checkSession({
            success: function(res) {
              console.log("checkAuth");
              that.checkSession(func, value);
            },
            fail: function(res) {
              that.goToAuth();
            },
            complete: function(res) {},
          });
        }
      },
      fail(res) {
        that.appError(res);
      }
    });
  },
  checkSession: function(func, value) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(data) {
        that.globalData.userInfo = data.data;
        wx.request({
          url: that.siteroot + '/Login/checkSession',
          method: 'post',
          data: {
            user_id: that.globalData.userInfo['uid'],
            session_id: that.globalData.userInfo['session_id']
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            if (res.data.status !== 1) {
              that.goToAuth();
              return;
            }
            console.log("checkSession");
            if (func) {
              if (value) {
                func(value);
              } else {
                func();
              }
            }
          },
          fail: function(e) {
            that.netError();
          },
        });
      },
      fail() {
        that.goToAuth();
      }
    });
  },
  hidewxLoading() {
    wx.hideNavigationBarLoading();
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },
  netError() {
    this.hidewxLoading();
    wx.showModal({
      title: '提示',
      content: '网络异常，请检查网络连接',
      showCancel: false
    });
  },
  appError(res) {
    this.hidewxLoading();
    wx.showModal({
      title: '提示',
      content: '请重试：' + res.data ? (res.data.msg ? res.data.msg : (res.data.status ? res.data.status : "未知错误")) : (res.errMsg ? res.errMsg : "未知错误"),
      confirmText: '好的',
      showCancel: false
    });
  },
  dataError(pages) {
    this.hidewxLoading();
    var that = this;
    wx.showModal({
      title: '提示',
      content: '数据出错！请重新进入',
      showCancel: false,
      confirmText: '返回',
      success(res) {
        if (res.confirm) {
          that.returnBack(pages);
        }
      }
    });
  },
  returnBack(pages) {
    if (pages.length > 1) {
      wx.navigateBack({});
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  goToAuth() {
    this.hidewxLoading();
    wx.navigateTo({
      url: '/pages/auth/auth',
    });
  },
  updateSession(session) {
    var that = this;
    this.globalData.userInfo['session_id'] = session;
    wx.setStorage({
      key: 'userInfo',
      data: that.globalData.userInfo
    });
  },
})