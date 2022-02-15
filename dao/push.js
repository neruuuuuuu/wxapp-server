const $sqlCRUD = require('./connect/sqlCRUD').access
const _ = require('./connect/query')

const push = {
  getPusherToken: function () {
    return _.query($sqlCRUD.queryToken)
  }
}

module.exports = push