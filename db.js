const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(); // uses env variables

module.exports = pool;
