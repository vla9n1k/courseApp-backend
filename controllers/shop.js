const User = require('../models/user');
const Cart = require('../models/cart');
const CartItems = require('../models/cart-item');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Condition = require('../models/condition');
const Country = require('../models/country');
const Engine = require('../models/engine');
const Vehicle = require('../models/vehicle');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const OrderStatus = require('../models/order-status');
const Transaction = require('../models/transactions');
const {validationResult} = require('express-validator');
const sequelize = require('../helpers/database');
const io = require('../socket');

exports.getProducts = async (req, res, next) => {
    const result = await Product.findAll({
        where: {isSold: false},
        include: [Brand, Condition, Country, Engine, Vehicle, {model: User, attributes: ['telephone', 'name']}]
    });
    return res.status(200).json(result)
};

exports.updateProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Wrong data',
            success: false,
            errors: errors.array()
        })
    }
    const userId = req.userId;
    const {
        productId,
        gearBox,
        model,
        color,
        price,
        imageUrl,
        description,
        brand,
        condition,
        vehicle,
        country,
        mileage,
        engine,
    } = req.body;

    const creator = await User.findByPk(userId);
    if (!creator) {
        return res.status(401).json({
            message: 'User not authorized or not found',
            success: false
        })
    }

    const updatedProduct = await Product.update({
        gearbox: gearBox, model, color, price, mileage, imageUrl, description,
        updatedAt: Date.now(),
        brandId: brand,
        conditionId: condition,
        countryId: country,
        engineId: engine,
        vehicleId: vehicle
    }, {where: {id: productId}});

    if (!updatedProduct) {
        return res.status(400).json({
            message: 'Unable to create product',
            success: false
        })
    }
    return res.status(201).json({
        message: 'Product created',
        success: true
    })
};

exports.deleteProduct = async (req, res, next) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized user'
        })
    }
    const productId = req.body.itemId;
    if (!productId) {
        return res.status(400).json({
            message: 'Can not find item to remove'
        })
    }
    await Product.destroy({where: {id: productId}});
    res.status(200).json({
        message: 'Product deleted'
    })
};

exports.postProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Wrong data',
            success: false,
            errors: errors.array()
        })
    }
    const userId = req.userId;
    const {
        gearBox,
        model,
        color,
        price,
        imageUrl,
        description,
        brand,
        condition,
        vehicle,
        country,
        mileage,
        engine,
    } = req.body;

    const creator = await User.findOne({where: {id: userId}});
    if (!creator) {
        return res.status(401).json({
            message: 'User not authorized or not found',
            success: false
        })
    }
    const createdProduct = await Product.create({
        gearbox: gearBox, model, color, price, mileage, imageUrl, description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: creator.dataValues.id,
        brandId: brand,
        conditionId: condition,
        countryId: country,
        engineId: engine,
        vehicleId: vehicle
    });
    if (!createdProduct) {
        return res.status(400).json({
            message: 'Unable to create product',
            success: false
        })
    }
    return res.status(201).json({
        message: 'Product created',
        success: true
    })
};

exports.getUserProducts = async (req, res, next) => {
    const userId = req.userId;
    const result = await Product.findAll({
        where: {userId},
        include: [User, Brand, Condition, Country, Engine, Vehicle]
    });
    return res.status(200).json(result)
};


exports.postToUserCart = async (req, res, next) => {
    const userId = req.userId;
    const productId = req.body.itemId;
    const product = await Product.findOne({where: {id: productId}, attributes: ['isSold']});
    const isSold = product.dataValues.isSold;
    if (isSold) {
        return res.status(400).json({
            message: 'Car already sold'
        })
    }
    const userCart = await Cart.findOne({where: {userId}});
    const userCartId = userCart.dataValues.id;
    const userCartItems = await CartItems.count({where: {cartId: userCartId}});
    if (userCartItems >= 1) {
        return res.status(422).json({
            message: 'You have active items in your cart'
        })
    }
    const item = await CartItems.create({
        quantity: 1,
        carId: productId,
        cartId: userCartId
    });

    res.status(200).json({
        message: 'Product added to cart'
    })
};

exports.postDeleteCartItems = async (req, res, next) => {
    const userId = req.userId;
    const userCart = await Cart.findOne({where: {userId}});
    const userCartId = userCart.dataValues.id;
    let itemsToRemove = req.body.itemsToRemove;
    if (!userCartId) {
        return res.status(400).json({
            message: 'Unable to get cart, contact support!'
        })
    }
    const result = await CartItems.destroy({where: {cartId: userCartId, carId: [...itemsToRemove]}});
    if (result) {
        res.status(200).json({
            message: 'Items removed from cart'
        })
    }
};

exports.getUserCart = async (req, res, next) => {
    const userId = req.userId;
    const userCart = await Cart.findOne({where: {userId}});
    const userCartId = userCart.dataValues.id;
    if (!userCartId) {
        return res.status(400).json({
            message: 'Unable to get cart items, contact support!'
        })
    }
    const cartItems = await CartItems.findAll({where: {cartId: userCartId}});
    let arrayOfProducts = [];
    for (item of cartItems) {
        let product = await Product.findOne({where: {id: item.dataValues.carId}});
        arrayOfProducts.push(product)
    }
    if (!cartItems) {
        return res.status(200).json({
            message: 'Cart is empty'
        })
    }
    return res.status(200).json({
        items: arrayOfProducts
    })
};

exports.postCartCheckout = async (req, res, next) => {
    const item = req.body.item[0];
    const product = await Product.findByPk(item.itemId);
    if (!!product.dataValues.isSold) {
        return res.status(400).json({
            message: 'Item is not available for purchase'
        })
    }
    const sumOfItems = req.body.totalSum;
    const userId = req.userId;
    const user = await User.findOne({where: {id: userId}});
    if (!user) {
        return res.status(401).json({
            message: 'Not authorized'
        })
    }
    const userBalance = user.dataValues.balance;
    const userCart = await Cart.findOne({where: {userId}});
    const userCartId = userCart.dataValues.id;
    if (userBalance < sumOfItems) {
        return res.status(403).json({
            message: 'Not enough funds'
        });
    }

    await sequelize.transaction(async (t) => {
        const finaBalance = userBalance - sumOfItems;
        await User.update({balance: finaBalance}, {where: {id: userId}, transaction: t});
        await CartItems.destroy({where: {cartId: userCartId, carId: item.itemId}});
        io.getIO().emit('balanceUpdate', {
            balance: finaBalance
        });
    });

    await Product.update({isSold: true}, {where: {id: item.itemId}});

    await sequelize.transaction(async (t) => {
        const seller = await User.findOne({where: {id: item.sellerId}, attributes: ['balance']});
        const sellerBalance = seller.dataValues.balance;
        const newSellerBalance = sellerBalance + sumOfItems;
        await User.update({balance: newSellerBalance}, {where: {id: item.sellerId}, transaction: t});
    });

    await sequelize.transaction(async (t) => {
        await Transaction.create({
            amount: sumOfItems,
            date: Date.now(),
            comment: `User with id: ${userId} bought car with id ${item.itemId} from User with id: ${item.sellerId}`,
            senderId: userId,
            receiverId: item.sellerId
        }, {transaction: t});
    });


    const orderId = await sequelize.transaction(async (t) => {
        const order = await Order.create({orderStatusId: 1, userId}, {transaction: t});
        return order.dataValues.id
    });

    await sequelize.transaction(async (t) => {
        await OrderItem.create({quantity: 1, carId: item.itemId, orderId}, {transaction: t});
        res.status(200).json({
            message: 'Order successfully submitted'
        });
    });
};

exports.getOrders = async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findOne({where: {id: userId}});
    if (!user) {
        return res.status(401).json({
            message: 'User not found or'
        })
    }
    const userOrders = await Order.findAll({where: {userId}, include: [OrderStatus]});
    const orders = userOrders.map((item) => {
        return {
            id: item.id,
            orderStatusId: item.orderStatusId,
            statusName: item['order-status'].name,
        }
    });
    res.status(200).json({
        message: 'Orders loaded',
        orders: orders
    })
};

exports.getUserData = async (req, res, next) => {
    const userId = req.userId;
    const userToSearchId = req.body.id;
    const findUser = await User.findByPk(userId, {attributes: ['userStatusId']});
    const userStatus = findUser.dataValues.userStatusId;
    if (userStatus === 1) {
        return res.status(500).json({message: 'You do not have access to this information'})
    }
    const userInfo = await User.findByPk(userToSearchId, {
        attributes: ['id', 'email', 'telephone',
            'balance', 'name', 'surname'], include: [Transaction, Product]
    });
    return res.status(200).json({
        message: 'User data received',
        userInfo,
    })
};