const _ = require('./connect/query')
const $sqlOrder = require('./connect/sqlCRUD').order
const $sqlUser = require('./connect/sqlCRUD').user

const orders = {
  addBookOrder: function (bookid, price, uid, blance) {
    return Promise.all([
      _.query($sqlOrder.buyBook, [uid, price, bookid]),
      _.query($sqlUser.reduceBalance, [(balance - price), uid])
    ])
  }
}

module.exports = orders