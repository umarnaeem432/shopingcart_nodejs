const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'gct165201b' , {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;