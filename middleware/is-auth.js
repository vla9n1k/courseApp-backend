const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, config.jwt.secret)
    } catch (e) {
        return res.status(500).json({
            message: 'Token is not correct'
        })
    }
    if (!decodedToken) {
        return res.status(401).json({
            message: 'Not authenticated'
        })
    }
    req.userId = decodedToken.id;
    next();
};