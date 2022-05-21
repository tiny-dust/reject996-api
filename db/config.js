const mysql = require('mysql2');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  host: '150.158.181.254',
  user: 'root',
  password: 'Zxcvb931224?',
  database: 'reject996',
});

module.exports = {
  connection,
};
