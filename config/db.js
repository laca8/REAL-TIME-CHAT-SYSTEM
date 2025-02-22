const sqlight3 = require("sqlite3").verbose();
const db = new sqlight3.Database("../chats.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username STRING UNIQUE
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Users table created successfully.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender STRING,
        receiver STRING NULL,
        group_name STRING NULL,
        message TEXT,
        is_read BOOLEAN DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender) REFERENCES users(username)
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("messages table created successfully.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name STRING UNIQUE
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("groups table created successfully.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS group_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name STRING,
        username STRING,
        FOREIGN KEY (group_name) REFERENCES groups(group_name),
        FOREIGN KEY (username) REFERENCES users(username)
    )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("group_name table created successfully.");
      }
    }
  );
});
module.exports = db;
