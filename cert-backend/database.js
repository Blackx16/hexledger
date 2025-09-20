// database.js
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the users database.");
});

// Create users table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      // Add some default users only if the table is new
      const stmt = db.prepare(
        "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
      );
      const salt = bcrypt.genSaltSync(10);

      stmt.run("learner", bcrypt.hashSync("learn", salt), "learner");
      stmt.run("employer", bcrypt.hashSync("employ", salt), "employer");

      stmt.finalize((err) => {
        if (!err) {
          console.log("Default users created or already exist.");
        }
      });
    },
  );
});

module.exports = db;
