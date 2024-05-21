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
                   UserId INTEGER PRIMARY KEY AUTOINCREMENT,
                   AccountType TEXT NOT NULL,
                   Username TEXT NOT NULL UNIQUE,
                   Password TEXT NOT NULL,
                   Email TEXT NOT NULL UNIQUE,
                   Telephone TEXT NOT NULL)`); 

      this.db.run(`CREATE TABLE task (
                  TaskId INTEGER PRIMARY KEY AUTOINCREMENT,
                  OwnerId INTEGER NOT NULL,
                  /* 
                    N = New Order (Customer Request not approved yet, or Created by Admin & not scheduled)
                    R = Ready/Scheduled? (Customer Request approved, or Created by Admin & scheduled)
                    C = Completed (Task is completed, invoice paid)
                    F = Cancelled (Task is cancelled by customer before starting or admin)
                  */
                  status TEXT NOT NULL, 
                  name TEXT NOT NULL,
                  description TEXT NOT NULL,
                  Address TEXT NOT NULL,
                  City TEXT NOT NULL,
                  Province TEXT NOT NULL,
                  Country TEXT NOT NULL,
                  PostalCode TEXT NOT NULL,
                  CreatedAt TEXT NOT NULL,
                  ScheduleDate TEXT NOT NULL,
                  UserStamp TEXT,
                  TimeStamp TEXT,
                  FOREIGN KEY (OwnerId) REFERENCES user(UserId))`);

      this.db.run(`CREATE TABLE item (
                  ItemId INTEGER PRIMARY KEY AUTOINCREMENT,
                  Item TEXT NOT NULL UNIQUE,
                  /*
                    A = Active
                    I = Inactive
                    maybe better as just Active boolean
                  */ 
                  Status CHAR(1) NOT NULL DEFAULT 'A',
                  Description TEXT,
                  UOM TEXT NOT NULL,
                  Price REAL NOT NULL, /* Maybe should be nullable? would a zero cost item ever make sense? */
                  UserStamp TEXT NOT NULL,
                  TimeStamp TEXT NOT NULL)`);

      this.db.run(`CREATE TABLE taskitem (
                  TaskItemId INTEGER PRIMARY KEY AUTOINCREMENT,
                  TaskId INTEGER NOT NULL,
                  Item STRING NOT NULL,
                  Qty REAL NOT NULL,
                  UserStamp TEXT NOT NULL,
                  TimeStamp TEXT NOT NULL,
                  TransactionID INTEGER,
                  FOREIGN KEY (TaskId) REFERENCES task(TaskId),
                  FOREIGN KEY (TransactionID) REFERENCES itemtransaction(TransactionId))`);

      this.db.run(`CREATE TABLE taskactivity (
                  TaskActivityId INTEGER PRIMARY KEY AUTOINCREMENT,
                  TaskId INTEGER NOT NULL,
                  Activity TEXT NOT NULL,
                  UserStamp TEXT NOT NULL,
                  TimeStamp TEXT NOT NULL,
                  FOREIGN KEY (TaskId) REFERENCES task(TaskId))`);  

      this.db.run(`CREATE TABLE itemtransaction (
                  TransactionId INTEGER PRIMARY KEY AUTOINCREMENT,
                  Item TEXT NOT NULL,
                  TransactionType TEXT NOT NULL,
                  Qty REAL NOT NULL,
                  TransactionDate TEXT NOT NULL,
                  UserStamp TEXT NOT NULL,
                  TimeStamp TEXT NOT NULL)`);
    
    }

    return instance;
  }

  seedData(){
    this.db.run(`INSERT INTO User VALUES ('Admin', 'admin', 'admin', 'admin@admin.com', '1234567890')`);
    
    this.db.run(`INSERT INTO User VALUES ('Customer', 'Sally', 's@lly', 'admin@admin.com', '0987654321')`);

    this.db.run(`INSERT INTO Item VALUES ('Hammer', 'A hammer', 'Each', 10.00, 'admin', '2024-05-20')`);
    this.db.run(`INSERT INTO Item VALUES ('Nails', 'A box of nails', 'Box', 5.00, 'admin', '2024-05-20')`);
    this.db.run(`INSERT INTO Item VALUES ('Screws', 'A box of screws', 'Box', 5.00, 'admin', '2024-05-20')`);

    this.db.run(`INSERT INTO Task VALUES ('N', 'Build Fence', 'Build a fence around the yard', 
                                          '123 Main St', 'Toronto', 'ON', 'Canada', 'M1M1M1', '2024-05-20', 
                                          '2024-05-25 12:30PM', 'Sally', '2024-05-20')`);

    this.db.run(`INSERT INTO TaskItem (TaskId, Item, Qty, UserStamp, TimeStamp) VALUES (1, 'Hammer', 1, 'Admin', '2024-05-20')`);
    this.db.run(`INSERT INTO TaskItem (TaskId, Item, Qty, UserStamp, TimeStamp) VALUES (1, 'Nails', 50, 'Admin', '2024-05-20')`);
    this.db.run(`INSERT INTO TaskActivity (TaskId, Activity, UserStamp, TimeStamp) VALUES (1, 'Hammer Nail for fence', 'Admin', '2024-05-25 12:30PM')`);
    this.db.run(`INSERT INTO TaskActivity (TaskId, Activity, UserStamp, TimeStamp) VALUES (1, 'Place fence', 'Admin', '2024-05-25 12:30PM')`);
  }
  // USER FUNCTIONS
  register(AccountType, Username, Password, Email, Telephone, callback) {
    bcrypt.hash(Password, salt, (err, hash) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
  
      this.db.run(`INSERT INTO User (AccountType, 
                                     Username, 
                                     Password, 
                                     Email, 
                                     Telephone) 
                               VALUES (?, ?, ?, ?, ?)`,
                              [AccountType, 
                               Username, 
                               hash, 
                               Email, 
                               Telephone], 
      function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`New User Created - User ID: ${this.lastID}`);
        callback(null);
      });
    });
  }

  login(Username, Password, callback) {
    this.db.get("SELECT Username, Password FROM User WHERE Username = ?", [Username], (err, row) => {
        if (err) {
          return callback(err);
        }
        if (row) {
          bcrypt.compare(Password, row.Password, function(err, result) {
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

  getUser(Username, callback) {
    this.db.get("SELECT AccountType, Username, Email, Telephone FROM User WHERE Username = ?", [Username], (err, row) => {
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


  // TASK FUNCTIONS
  createTask(task, callback) {
    this.db.run(`INSERT INTO Task (OwnerId,
                                   Status,
                                   Name,
                                   Description,
                                   Address,
                                   City,
                                   Province,
                                   Country,
                                   PostalCode,
                                   CreatedAt,
                                   ScheduleDate,
                                   UserStamp,
                                   TimeStamp) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                             [task.OwnerId,
                              task.Status,
                              task.Name,
                              task.Description,
                              task.Address,
                              task.City,
                              task.Province,
                              task.Country,
                              task.PostalCode,
                              task.CreatedAt,
                              task.ScheduleDate,
                              task.UserStamp,
                              task.TimeStamp], 
    function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`New Task Created - Task ID: ${this.lastID}`);
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


  // ITEM FUNCTIONS
  createItem(item, callback) {
    this.db.run(`INSERT INTO Item (Item,
                                   Description,
                                   UOM,
                                   Price,
                                   UserStamp,
                                   TimeStamp) 
                             VALUES (?, ?, ?, ?, ?, ?)`, 
                             [item.Item,
                              item.Description,
                              item.UOM,
                              item.Price,
                              item.UserStamp,
                              now()], 
    function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`New Item Created - Item ID: ${this.lastID}`);
      callback(null, this.lastID);
    });
  }

  updateItem(item, callback) {
    this.db.run(`UPDATE Item SET Item = ?,
                                 Status = ?,
                                 Description = ?,
                                 UOM = ?,
                                 Price = ?,
                                 UserStamp = ?,
                                 TimeStamp = ?
                             WHERE ItemId = ?`, 
                             [item.Item,
                              item.Status,
                              item.Description,
                              item.UOM,
                              item.Price,
                              item.UserStamp,
                              item.TimeStamp,
                              item.ItemId], 
    function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`Item Updated - Item ID: ${this.lastID}`);
      callback(null, this.lastID);
    });
  }

  getItem(item, callback) {
    this.db.get("SELECT * FROM Item WHERE Item = ?", [item], (err, row) => {
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

  getItems(callback) {
    this.db.all("SELECT * FROM Item", (err, rows) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  }

  updateItemQuantity(transaction, callback) {
    this.db.run(`INSERT INTO ItemTransaction (Item,
                                             TransactionType,
                                             Qty,
                                             TransactionDate,
                                             UserStamp,
                                             TimeStamp) 
                                       VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                                       [transaction.item,
                                        transaction.type,
                                        transaction.qty,
                                        transaction.date,
                                        transaction.user,
                                        now()],
   function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`Item Transaction Created - Transaction ID: ${this.lastID}`);
      callback(null, this.lastID);
    });
  }
}

module.exports = DatabaseService;