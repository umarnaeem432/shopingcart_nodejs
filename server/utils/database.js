// const Sequelize = require('sequelize');
//
// // const sequelize = new Sequelize('node-complete', 'root', 'gct165201b' , {dialect: 'mysql', host: 'localhost'});
// const sequelize = new Sequelize('TIDvjfR2nf', 'TIDvjfR2nf', 'VCvdKABS1T' , {dialect: 'mysql', host: 'remotemysql.com'});
// module.exports = sequelize;

const MongoDB = require('mongodb');

const MongoClient = MongoDB.MongoClient;

let _db;

const mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://umarnaeem432:gct165201b@cluster0-evjwn.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            _db = client.db();
            cb(client);
        })
        .catch(err => {
            // console.log(err);
            throw err;
        })
};

const getDB = () => {
    if (_db){
        return _db;
    }
    throw 'Can not Connect!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;