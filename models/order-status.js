const Sequelize = require('sequelize');
const sequalize = require('../helpers/database');

const OrderStatus = sequalize.define("order-status", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = OrderStatus;