const express = require('express')
const router = express.Router()

// @decs 登录
// @method GET  

router.get('/', function (req, res, next) {
  if (res['auth_data'] && res['auth_data']['userInfo']) {
    res.json(Object.assign(res['auth_data'], { result: 0 }))
  } else {
    console.log('routers/login')
    res.json({
      result: -3,
      errmsg: '返回数据出错'
    })
  }
})

module.exports = router