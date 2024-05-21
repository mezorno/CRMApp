const DatabaseService = require('../services/databaseService');
const dbService = new DatabaseService();
const jwt = require('jsonwebtoken');

const userController = {
  register: (req, res) => {
    const { AccountType, Username, Password, Email, Telephone } = req.body;
    
    if (!AccountType, !Username || !Password || !Email || !Telephone) {
        return res.status(400).send('Account Type, Username, Password, Email, and Tel # are required');
    }
    
    dbService.register(AccountType, Username, Password, Email, Telephone, (err) => {
        if (err) {
        return res.status(500).send('Error registering user');
        }
    
        res.status(200).send('Registration successful');
    });
  },
  login: (req, res) => {
    const { Username, Password } = req.body;

    dbService.login(Username, Password, (err, user) => {
      if (err) {
        res.status(500).send('Internal Server Error');
      } else if (!user) {
        res.status(401).send('Invalid username or password');
      } else {
        const token = jwt.sign({ Username: user.Username }, 
                                'LONG-ASS-KEY-WE-SHOULD-CHANGE-AT-SOME-POINT-TO-BE-LESS-GUESSABLE', 
                                { expiresIn: '1h' });

        res.status(200).json({ token });
      }
    });
  },
  profile: (req, res) => {
    const { Username } = req.user;

    dbService.getUser(Username, (err, user) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }

      if (!user) {
        return res.status(404).send('Not Logged In!');
      }

      res.status(200).json({ username: user.username, email: user.email });
    });
  }
};

module.exports = userController;