const User = require('../models/user');
const Cart = require('../models/cart');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const io = require('../socket');


exports.signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Data in form is not correct',
            errors: errors.array()
        })
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const surname = req.body.surname;
    const telephone = req.body.mobile;

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
        email,
        password: hashedPassword,
        name,
        surname,
        telephone,
        userStatusId: 1
    });

    await createdUser.createCart();

    try {
        const result = await createdUser;
        if (result.dataValues.id) {
            return res.status(201).json({
                user: {
                    id: result.dataValues.id
                },
                message: 'Account created'
            })
        }
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
};

exports.Login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({where: {email}});
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    const isValid = await bcrypt.compare(password, user.dataValues.password);
    if (isValid) {
        const token = jwt.sign({
                email: user.dataValues.email,
                id: user.dataValues.id
            },
            'secretTokenForJwt', {
                expiresIn: 3600
            });
        io.getIO().emit('loggedIn', {
            action: 'login',
            userId: user.dataValues.id,
            balance: user.dataValues.balance,
            role: user.dataValues.userStatusId
        });
        io.getIO().emit('balanceUpdate', {
            balance: user.dataValues.balance
        });
        return res.status(200).json({
            id: user.dataValues.id,
            token,
            role: user.dataValues.userStatusId,
            message: 'Logged in'
        })
    } else {
        return res.status(400).json({
            message: 'Password is not correct'
        })
    }
};