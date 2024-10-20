require('dotenv').config()

const pgp = require('pg-promise')()

const database = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

module.exports = database;
