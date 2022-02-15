const mysql = require('mysql2')
const config = require('../../conf/db').mysql

const pool = mysql.createPool(config)
module.exports = pool