const pool = require('./connect')

module.exports = {
  query: function (sqltSring, params) {
    return new Promise((resolve, reject) => {
      console.log('pool连接前')
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err)
        } else {
          console.log('pool 连接成功,sql:' + sqltSring)
          connection.query(sqltSring, params, (err, rows) => {
            if (err) {
              console.log('err:' + err)
              reject(err)
            } else {
              console.log('rows:' + rows)
              resolve(rows)
            }
            connection.release()
          })
        }
      })
    })
  }
}