const mysql = require('mysql');
// Connection for SQL database
module.exports = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: 'Monster01b',
    database: 'employee_db'
  });