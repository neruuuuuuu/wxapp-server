const axios = require('axios')
const crypto = require('crypto')
const { appConfig: config } = require('../conf/app')
const { decrytByAES, encryptSha1 } = require('../util/util')
const { saveUserInfo } = require('../controllers/user')

function authorizeMiddleware (req, res, next) {
  return authMiddleware(req).then(function (result) {
    res['auth_data'] = result
    return next()
  })
}

function authMiddleware (req) {
  const {
    appid,
    secret
  } = config
  const {
    code,
    encryptData,
    iv
  } = req.query
  // some() 一个条件满足则返回true
  // 检查参数完整性
  if ([code, encryptData, iv].some(item => !item)) {
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

      let decryptedData = JSON.parse(decrytByAES(encryptData, session_key, iv))
      console.log('解密后' + decryptedData)

      return saveUserInfo({
        userInfo: decryptedData,
        session_key,
        skey
      })
    }).catch(err => {
      return {
        result: -3,
        errmsg: JSON.stringify(err)
      }
    })
}

// 通过 wx.login 接口获得临时登录凭证 code
function getSessionKey (code, appid, secret) {
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

    if (!res.openid || !res.session_key || !res.errcode) {
      return {
        result: -2,
        errmsg: res.errmsg || '返回数据字段不完整'
      }
    } else {
      return res
    }
  })
}

module.exports = {
  authorizeMiddleware
}