const Comments = require('../dao/comment')
const Pusher = require('./push')

module.exports = {

  // 根据用户skey写评论
  addCommentsBySkey: function (req, res, next) {
    Comments.addCommentBySkey(req.body.skey, req.body.bookid).then(function (reqData) {
      if (resData && resData.insertid) {
        Pusher.pushMessageToUser(req)

        res.json({
          resul: 0,
          errmsg: 'insert success!'
        })
      } else {
        res.json({
          result: -2,
          errmsg: '提交失败'
        })
      }
    }).catch(function (e) {
      res.json({
        result: -3,
        errmsg: '网络错误'
      })
    })
  }
}