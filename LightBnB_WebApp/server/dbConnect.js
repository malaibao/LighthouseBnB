/* db config */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: 'localhost',
  database: 'lightbnb',
});

module.exports = pool;
