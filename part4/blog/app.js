const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

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

const blogRouter = require('./controllers/blogRouter', )

app.use('/api/blog', blogRouter)

module.exports = app