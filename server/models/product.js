const mongodb = require('mongodb');
const getDB = require('../utils/database').getDB;

module.exports = class Product {
    constructor(title, price, imageUrl, description, _id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.userId = userId;
        this._id = _id ? new mongodb.ObjectID(_id) : null;
    }

    save() {
        const db = getDB();
        return db.collection('products').insertOne(this)
            .then(result => {

            })
            .catch(err =>  {
                throw err;
            })
    }

    static fetchAll () {
        const db = getDB();
        return db.collection('products').find().toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                throw err;
            });
    }

    static deleteProduct(productId) {
        const db = getDB();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectID(productId)});
    }

    updateProduct() {
        const db = getDB();
        return db.collection('products').findOneAndUpdate({_id: this._id}, {$set: this});
    }

    static getProductById(productId) {
        const db = getDB();
        return db.collection('products').findOne({_id: new mongodb.ObjectID(productId)})
            .then(product => {
                return product;
            })
            .catch(err => {
                throw err;
            })
    }
};