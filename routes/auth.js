const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const {body} = require('express-validator');
const User = require('../models/user');
router.post('/signup', [
    body('email').trim().isEmail().custom((value, {req}) => {
        return User.findOne({where: {email: value}})
            .then((isUsed) => {
                if (isUsed) {
                    return Promise.reject('Email address already used')
                }
            })
    }).normalizeEmail(),
    body('password').trim().isLength({min: 7}),
    body('name').trim().isLength({max: 20}),
    body('surname').trim().isLength({max: 20}),
    body('password').trim().isLength({min: 7}),
], authController.signUp);

router.post('/login', authController.Login);

module.exports = router;