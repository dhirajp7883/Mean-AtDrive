const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then(() => {
    console.log("MySQL Connected");
  })
  .catch((err) => {
    console.error("MySQL connection failed:", err);
  });

module.exports = db;