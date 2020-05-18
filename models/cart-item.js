const Sequelize = require('sequelize');
const sequalize = require('../helpers/database');

const CartItem = sequalize.define("cart-item", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = CartItem;