require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET: process.env.SECRET || 'defaultsecret',
  PORT: process.env.PORT || 3001,
}