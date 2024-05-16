const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const salt = 10;

let instance = null;

class DatabaseService {
  
  constructor() {

    if (!instance) {
      instance = this;
      this.db = new sqlite3.Database(':memory:');
      this.db.run(`CREATE TABLE user (
                  username TEXT UNIQUE,
                  password TEXT,
                  email TEXT UNIQUE)`); 

      this.db.run(`CREATE TABLE task (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   title TEXT,
                   description TEXT,
                   status TEXT,
                   address TEXT,
                   dueDate TEXT)`);
    }

    return instance;
  }

  register(username, password, email, callback) {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
  
      this.db.run("INSERT INTO User (username, password, email) VALUES (?, ?, ?)", [username, hash, email], function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        callback(null);
      });
    });
  }

  login(username, password, callback) {
    this.db.get("SELECT username, password FROM User WHERE username = ?", [username], (err, row) => {
        if (err) {
          return callback(err);
        }
        if (row) {
          bcrypt.compare(password, row.password, function(err, result) {
            if (err) {
              return callback(err);
            }
            if (result) {
              // Password is correct, return the user
              callback(null, row);
            } else {
              // Password is incorrect, return null
              callback(null, null);
            }
          });
        } else {
          // No User found, return null
          callback(null, null);
        }
    });
  }

  getUser(username, callback) {
    this.db.get("SELECT username, email FROM User WHERE username = ?", [username], (err, row) => {
      if (err) {
        return callback(err);
      }
      if (row) {
        callback(null, row);
      } else {
        callback(null, null);
      }
    });
  }

  addTask(task, callback) {
    this.db.run("INSERT INTO Task (title, description, status, address, dueDate) VALUES (?, ?, ?, ?, ?)", [task.title, task.description, task.status, task.address, task.dueDate], function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      callback(null, this.lastID);
    });
  }

  getTasks(callback) {
    this.db.all("SELECT * FROM Task", (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  }
}

module.exports = DatabaseService;