const Books = require('../dao/books')

module.exports = {
  getAllBooks: function (req, res, next) {
    Books.getBookInfo(true).then(function (resData) {
      res.json({
        result: 0,
        data: resData.map(function (item) {
          return {
            author: item.bkauthor || '',
            category: item.bkclass || '',
            cover_url: item.bkcover || '',
            file_url: item.bkfile || '',
            book_id: item.bkid || '',
            book_name: item.bkname || '',
            book_price: item.bkprice || 0,
            book_publisher: item.bkpublisher || ''
          }
        })
      })
    })
  },
  getBookById: function (req, res, next) {
    const bookid = req.query.book_id
    if (!bookid) {
      res.json({
        result: -1,
        errmsg: '缺少请求参数book_id字段'
      })
      return
    }
    Books.getBookInfo(false, bookid).then(function (resData) {
      res.json({
        result: 0,
        data: resData.map(function (item) {
          return {
            author: item.bkauthor || '',
            category: item.bkclass || '',
            cover_url: item.bkcover || '',
            file_url: item.bkfile || '',
            book_id: item.bkid || '',
            book_name: item.bkname || '',
            book_price: item.bkprice || 0,
            book_publisher: item.bkpublisher || ''
          }
        })
      })
    })
  },
  // 根据用户skey标识，查询用户是否购买书籍并返回评论列表
  queryBookBySkey: function (req, res, next) {
    const responeData = {}
    Books.queryBookBySkey(req.query.bookid, req.query.skey).then(function (resData) {
      if (resData && resData[0] && resData[0]['buyCount'] === 1) {
        responeData['is_buy'] = 1
      } else {
        responeData['is_buy'] = 0
      }
    }).then(function (resCommentData) {
      if (resCommentData && resCommentData.length) {
        resCommentData.forEach(function (item) {
          item.ctime = moment(item.ctime).format('YYYY-MM-DD HH:mm:ss')
        })
        responeData['lists'] = resCommentData
      } else {
        responeData['list'] = []
      }
      res.json({
        result: 0,
        data: responeData
      })
    }).catch(function (e) {
      res.json({
        result: -2,
        errmsg: '数据查询出错' + JSON.stringify(e)
      })
    })
  }

}   