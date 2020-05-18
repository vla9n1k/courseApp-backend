const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/transactions', isAuth, adminController.getTransactions);
router.get('/orders', isAuth, adminController.getOrders);
router.get('/users', isAuth, adminController.getUsers);
router.post('/orders/update', isAuth, adminController.changeOrderStatus);
router.post('/users/balance-update', isAuth, adminController.updateUserBalance);
router.get('/cars', isAuth, adminController.getCars);

module.exports = router;