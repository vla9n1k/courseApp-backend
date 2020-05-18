const Sequelize = require('sequelize');
const sequalize  = require('../helpers/database');

const Condition = sequalize.define("condition", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Condition