const $sqlCRUD = require('./connect/sqlCRUD').book
const _ = require('./connect/query')

const books = {
  getBookInfo: function (isAll, bookid) {
    if (isAll) {
      console.log(_)
      console.log($sqlCRUD)
      return _.query($sqlCRUD.queryAll, [])
    } else {
      return _.query($sqlCRUD.queryById, [bookid])
    }
  },
  queryBookBySkey: function (bookid, skey) {
    return _.query($sqlCRUD.queryBookBySkey, [skey, bookid])
  },
  getPriceById: function (bookid) {
    return _.query($sqlCRUD.getPrice, bookid)
  }
}

module.exports = books