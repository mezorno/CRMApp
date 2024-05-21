const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const itemController = require('../controllers/itemController');

router.post('/create', authenticationMiddleware, itemController.createItem);
router.post('/update', authenticationMiddleware, itemController.updateItem);
router.post('/get', authenticationMiddleware, itemController.getItem);
router.get('/all', authenticationMiddleware, itemController.getAllItems);
router.post('/updateQuantity', authenticationMiddleware, itemController.updateItemQuantity);
router.get('/test', itemController.test);
module.exports = router;