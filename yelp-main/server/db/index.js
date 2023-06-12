const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'sqluser',
  password: 'sqluser',
  database: 'restaurants',
});

module.exports = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      pool.query(text, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};