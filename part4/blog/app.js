const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/loginRouter')
const app = express()

app.use(express.json())

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)


module.exports = app