// 获取小程序全局唯一后台接口调用凭据的中控服务器

const express = require('express')
const axios = require('axios')
const config = require('./conf/app.js').appConfig
const _ = require('./dao/connect/query')
const { access } = require('./dao/connect/sqlCRUD.js')

const app = express()
// access_token 的有效期目前为 2 个小时
let access_token = ' '
let expires_in = 0
let timer
let nextTime = 0


// 获取接口调用凭证
function getAccessToken (callback) {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  const opt = {
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    method: 'GET',
    params: {
      grant_type: 'client_credential',
      appid: config.appid,
      secret: config.secret
    }
  }
  axios(opt).then(
    function (response) {
      console.log(response, '调用接口返回数据')

      if (response && response.data && response.data.access_token) {
        const resData = response.data
        access_token = resData.access_token
        expires_in = resData.expires_in || 0
        //查出access表中所有记录
        return _.query('select count(*) as count from access')
      }
    }
  ).then(
    function (response) {
      console.log('表中记录', response)
      if (response && response[0]) {
        if (response[0]['count'] === 0) {
          // 表中无记录，首次获取
          console.log('表中无记录，首次获取')
          return _.query('insert into access set ?', {
            token: access_token,
            expires: expires_in
          })
        } else {
          // 表中有记录，更新token
          console.log('表中有记录，更新token', access_token)
          return _.query('update access set ?', {
            token: access_token,
            expires: expires_in
          })
        }
      }
    }
  ).then(
    function (respone) {
      if (respone) {
        nextTime = (expires_in || 7200) * 1000
        setTimeout(callback, nextTime)
      }
    }
  ).catch(
    function (error) {
      console.log('error is', error)
      nextTime = 30 * 1000
      timer = setTimeout(callback, nextTime)
    }
  )
}

// 
function refreshAccessToken (fn, time) {
  const refreshToken = function () {
    fn(refreshToken)
  }

  timer = setTimeout(refreshToken, time)
}

refreshAccessToken(getAccessToken, 0)

module.exports = app
