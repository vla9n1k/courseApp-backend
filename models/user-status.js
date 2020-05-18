const Sequelize = require('sequelize');
const sequalize = require('../helpers/database');

const UserStatus = sequalize.define("user-status", {
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

module.exports = UserStatus;