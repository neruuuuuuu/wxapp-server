const app = require('../app')
const tokenApp = require('../app-token')
const http = require('http')

const server = http.createServer(app)
const tokenServer = http.createServer(tokenApp)


// normalizePort() 参数不是string或number类型，返回false
// process.env.PORT 读取当前目录下环境变量port的值
const port = normalizePort(process.env.PORT || 3000)
const tokenPort = normalizePort(process.env.TOKEN_PORT || 3003)

//set() 使用get()访问，浏览器无法访问
//listen() 监听端口上的连接，浏览器可以访问
app.set('port', port)
server.listen(port)
tokenApp.set('port', tokenPort)
tokenServer.listen(tokenPort)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}