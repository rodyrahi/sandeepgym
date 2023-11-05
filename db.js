const Database = require('better-sqlite3');

const imagedb = new Database('../database/sandeepgym/imagedb.db');
// const scriptsdb = new Database('../database/kadmin/scriptsdb.db');

imagedb.exec(`
  CREATE TABLE IF NOT EXISTS imagedb (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    image BLOB,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// scriptsdb.exec(`
//   CREATE TABLE IF NOT EXISTS scripts (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user TEXT,
//     name TEXT,
//     script TEXT,
//     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
//   )
// `);

console.log('Connected to the database');

module.exports = { imagedb };
