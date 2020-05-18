const Sequelize = require('sequelize');
const sequalize  = require('../helpers/database');

const Order = sequalize.define("order", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});


module.exports = Order;