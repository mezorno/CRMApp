const DatabaseService = require('../services/databaseService');
const dbService = new DatabaseService();
const jwt = require('jsonwebtoken');

const userController = {
  register: (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).send('Username, password, and email are required');
    }
    
    dbService.register(username, password, email, (err) => {
        if (err) {
        return res.status(500).send('Error registering user');
        }
    
        res.status(200).send('Registration successful');
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;

    dbService.login(username, password, (err, user) => {
      if (err) {
        res.status(500).send('Internal Server Error');
      } else if (!user) {
        res.status(401).send('Invalid username or password');
      } else {
        const token = jwt.sign({ username: user.username }, 
                                'LONG-ASS-KEY-WE-SHOULD-CHANGE-AT-SOME-POINT-TO-BE-LESS-GUESSABLE', 
                                { expiresIn: '1h' });

        res.status(200).json({ token });
      }
    });
  },

  profile: (req, res) => {
    const { username } = req.user;

    dbService.getUser(username, (err, user) => {
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