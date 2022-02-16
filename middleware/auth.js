const axios = require('axios')
const crypto = require('crypto')
const { appConfig: config } = require('../conf/app')
const { decryptByAES, encryptSha1 } = require('../util/util')
const { saveUserInfo } = require('../controllers/user')


function authorizeMiddleware (req, res, next) {
  console.log('middleware')
  return authMiddleware(req).then(function (result) {
    res['auth_data'] = result
    return next()
  })
}


function authMiddleware (req) {
  console.log('authmiddleware')
  const {
    appid,
    secret
  } = config
  const {
    code,
    encryptedData,
    iv
  } = req.query
  // console.log(req.query)

  // some() 一个条件满足则返回true
  // 检查参数完整性
  if ([code, encryptedData, iv].some(item => !item)) {
    console.log('-1')
    return {
      result: -1,
      errmsg: '缺少参数字段，请检查后重试'
    }
  }
  // 获取session_key和openid
  return getSessionKey(code, appid, secret)
    .then(resData => {
      const { session_key } = resData
      const skey = encryptSha1(session_key)

      let decryptedData = JSON.parse(decryptByAES(encryptedData, session_key, iv))
      console.log('解密后' + decryptedData)

      return saveUserInfo({
        userInfo: decryptedData,
        session_key,
        skey
      })
    }).catch(err => {
      console.log('catch err:' + err)
      return {
        result: -3,
        errmsg: JSON.stringify(err)
      }
    })
}


// 通过 wx.login 接口获得临时登录凭证 code
function getSessionKey (code, appid, secret) {
  console.log('getSessionKey')
  const opt = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid: appid,
      secret: secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  }
  return axios(opt).then(function (respone) {
    const res = respone.data
    console.log('验证code成功')
    console.log(res)

    if (!res.openid || !res.session_key || res.errcode) {
      console.log('返回字段不完整')
      return {
        result: -2,
        errmsg: res.errmsg || '返回数据字段不完整'
      }
    } else {
      console.log('返回字段完整')
      return res
    }
  })
}


module.exports = {
  authorizeMiddleware
}