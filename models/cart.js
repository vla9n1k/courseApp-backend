const Sequelize = require('sequelize');
const sequalize = require('../helpers/database');

const Cart = sequalize.define("cart", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Cart;