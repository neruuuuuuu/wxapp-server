const Users = require('../dao/user')

module.exports = {
  // 保存用户信息
  saveUserInfo: function (obj) {
    const userInfo = obj.userInfo || {}
    const session_key = obj.session_key || ''
    const skey = obj.skey || ''
    return Users.saveUserInfo(userInfo, session_key, skey).then(function (resData) {
      return resData
    })
  },
  // 获取用户以购书籍
  getBoughtBooks: function (req, res, next) {

    Users.getBoughtBooks(req.query.skey)
      .then(function (resData) {
        if (resData && resData.length) {
          res.json({
            result: 0,
            list: resData.filter(function (item) {
              return item.bkid && item.bkname && item.bkfile && item.bkcover
            })
          });
        } else {
          res.json({
            result: 0,
            list: []
          })
        }
      })
      .catch(function (e) {
        res.json({
          result: -2,
          errmsg: '获取已购书籍失败' + JSON.stringify(e)
        })
      });
  }
}