const Sequelize = require('sequelize');
const sequalize  = require('../helpers/database');

const User = sequalize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type:  Sequelize.STRING,
        allowNull: false
    },
    balance: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
    },
    name: Sequelize.STRING,
    surname: Sequelize.STRING,
    telephone: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = User;