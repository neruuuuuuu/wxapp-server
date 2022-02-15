const pool = require('./connect')

module.exports = {
  query: function (sqltSring, params) {
    return new Promise((resolve, reject) => {
      console.log('pool连接前')
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err)
        } else {
          console.log('pool 连接成功')
          connection.query(sqltSring, params, (err, rows) => {
            if (err) {
              reject(err)
            } else {
              resolve(rows)
            }
            connection.release()
          })
        }
      })
    })
  }
}