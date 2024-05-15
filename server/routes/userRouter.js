const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentcationMiddleware = require('../middleware/authenticationMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authentcationMiddleware, userController.profile)

module.exports = router;