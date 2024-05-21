const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const taskController = require('../controllers/taskController');

router.post('/create', authenticationMiddleware, taskController.createTask);
router.get('/all', authenticationMiddleware, taskController.getAllTasks);

module.exports = router;