const express = require('express')
const createError = require('http-errors')

const loginRouter = require('./routers/login')
const bookRouter = require('./routers/book')
const userRouter = require('./routers/user')
const commentRouter = require('./routers/comment')
const orderRouter = require('./routers/order')

const { authorizeMiddleware } = require('./middleware/auth')

var app = express()

app.use('/login', authorizeMiddleware, loginRouter)
app.use('/api/book', bookRouter)
app.use('/api/user', userRouter)
app.use('/api/comment', commentRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(function (req, res, next) {
  next(createError(404, 'NotFound'))
})

module.exports = app