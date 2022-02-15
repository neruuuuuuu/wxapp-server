const $sqlCRUD = require('./connect/sqlCRUD').comment
const _ = require('./connect/query')

const comments = {
  getCommentsBySkey: function (bookid) {
    return _.query($sqlCRUD.queryComments, bookid)
  },
  addCommentBySkey: function (skey, content, bookid) {
    return _.query($sqlCRUD.addComment, [bookid, bookid, content, skey])
  }
}

module.exports = comments