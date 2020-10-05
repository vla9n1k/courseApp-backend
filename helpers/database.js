const Sequelize = require('sequelize');
const config = require('../config');
let sequelize;
try {
    sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
        dialect: 'mysql',
        host: config.db.host,
    });
} catch (e) {
    throw new Error("Can not connect to database")
}

module.exports = sequelize;




