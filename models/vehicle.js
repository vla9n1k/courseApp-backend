const Sequelize = require('sequelize');
const sequalize  = require('../helpers/database');

const Vehicle = sequalize.define("vehicle", {
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


module.exports = Vehicle;