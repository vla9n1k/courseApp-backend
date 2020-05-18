const User = require('../models/user');
const Transaction = require('../models/transactions');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const OrderStatus = require('../models/order-status');
const Product = require('../models/product');
const Brand = require('../models/brand');

async function isAdmin(req, res) {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    const userStatus = user.dataValues.userStatusId;
    if (!userId || userStatus === 1) {
        return res.status(400).json({
            message: 'You do not have access to do it'
        });
    }
    return true;
}


exports.getTransactions = async (req, res, next) => {
    await isAdmin(req, res);
    const transactions = await Transaction.findAll({
        include: [{
            model: User, as: 'sender',
            attributes: ['name', 'surname', 'telephone', 'email', 'balance']
        },
            {model: User, as: 'receiver', attributes: ['name', 'surname', 'telephone', 'email', 'balance']},
        ]
    });
    if (transactions) {
        res.status(201).json({
            message: 'Transactions fetched',
            transactions
        })
    } else {
        return res.status(404).json({
            message: 'Unable to find transactions'
        })
    }
};

exports.getOrders = async (req, res, next) => {
    await isAdmin(req, res);
    const orders = await Order.findAll({
        include: [OrderStatus, {model: User, attributes: ['email', 'name', 'telephone']},
            {model: OrderItem, attributes: ['carId', 'quantity']}]
    });
    if (orders) {
        res.status(200).json({
            orders
        })
    } else {
        return res.status(404).json({
            message: 'Unable to find orders'
        })
    }
};

exports.getUsers = async (req, res, next) => {
    await isAdmin(req, res);
    const users = await User.findAll({attributes: ['name', 'surname', 'telephone', 'balance', 'email']});
    if (users) {
         res.status(200).json({
            users
        })
    } else {
        return res.status(404).json({
            message: 'Unable to find users'
        })
    }
};

exports.changeOrderStatus = async (req, res, next) => {
    await isAdmin(req, res);
    const orderId = req.body.selectedOrderId;
    const newOrderStatus = req.body.newStatusId;
    const fetchOrder = await Order.findByPk(orderId);
    if (!fetchOrder) {
        return res.status(404).json({
            message: 'Unable to find order'
        })
    }
    const fetchedOrderStatus = fetchOrder.dataValues.orderStatusId;
    if (newOrderStatus === fetchedOrderStatus) {
        return res.status(406).json({
            message: 'Order already has this status'
        })
    }
    const result = await Order.update({orderStatusId: newOrderStatus}, {where: {id: orderId}});
    if (result) {
        res.status(200).json({
            message: `Status of order ${orderId} successfully updated`
        })
    }
};

exports.updateUserBalance = async (req, res, next) => {
    await isAdmin(req, res);
    const email = req.body.email;
    const amount = req.body.amount;
    const user = await User.findOne({where: {email}});
    if (!user) {
        return res.status(404).json({
            message: 'Unable to find user'
        })
    }
    const userId = user.dataValues.id;
    const userBalance = user.dataValues.balance;
    const newBalance = userBalance + amount;
    await User.update({balance: newBalance}, {where: {email}});
    await Transaction.create({
        amount,
        date: Date.now(),
        comment: `Manager with id ${req.userId} changed balance of user with id ${userId} by ${amount} funds`,
        senderId: req.userId,
        receiverId: userId
    });
    res.status(200).json({
        message: `User with email ${email} balance updated`
    })
};

exports.getCars = async (req, res, next) => {
    await isAdmin(req, res);
    const cars = await Product.findAll({attributes: ['id', 'model', 'price', 'isSold', 'createdAt'], include: [
            {model: User, attributes: ['email']}, {model: Brand, attributes: ['name']}]});
    if (cars) {
        res.status(200).json({
            cars
        })
    } else {
        return res.status(404).json({
            message: 'Unable to find users'
        })
    }
};