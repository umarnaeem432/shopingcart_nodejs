const Sequelise = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelise.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelise.STRING,
        allowNull: false,
    },
    price: {
        type: Sequelise.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelise.STRING,
        allowNull: false
    },
    description: {
        type: Sequelise.STRING,
        allowNull: false
    }
});

module.exports = Product;