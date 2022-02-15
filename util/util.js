const crypto = require('crypto')
// crypto模块的目的是为了提供通用的加密和哈希算法。

module.exports = {
  // 解密用户数据
  decryptByAES: function (encrypted, key, iv) {
    encrypted = new Buffer.from(encrypted, 'base64')
    key = new Buffer.from(key, 'base64')
    iv = new Buffer.from(iv, 'base64')

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    let decrypted = decipher.update(encrypted, 'base64', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
  },
  // 加密用户登录标识
  encryptSha1: function (data) {
    // hex：16进制编码
    return crypto.createHash('sha1').update(data, 'utf8').digest('hex')
  }
}