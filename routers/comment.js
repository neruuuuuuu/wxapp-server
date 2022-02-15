const express = require('express')
const Book = require('../controllers/books')
const router = express.Router()
const Comment = require('../controllers/comment')

// @desc 写评论
// @method post

router.post('/write', function (req, res, next) {
  const skey = req.body.skey
  const content = req.body.content
  const bookid = parseInt(req.body.bookid)

  if (skey === undefined) {
    res.json({
      result: -1,
      errmsg: '缺少请求参数skey字段'
    })
    return
  }
  if (content === undefined) {
    res.json({
      result: -1,
      errmsg: '缺少请求参数content字段'
    })
    return
  }
  if (bookid === undefined) {
    res.json({
      result: -1,
      errmsg: '缺少请求参数bookid字段'
    })
  }
  Comment.addCommentsBySkey(req, res, next)
})

module.exports = router