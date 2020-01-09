const mongodb = require('mongodb');

const getDB = require('../utils/database').getDB;

module.exports = class User {
    constructor(name, email, cart, _id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = _id ? new mongodb.ObjectID(_id) : null;
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this)
            .then(() => {

            })
            .catch(err => {
                throw err;
            });
    }

    addToCart(product) {
        if(!this.cart) {
            this.cart = {items: []};
        }

        let newProduct;
        const existingProductIndex = this.cart.items.findIndex(prod => {
            return prod._id.toString() === product._id.toString();
        });
        const existingProduct = this.cart.items[existingProductIndex];
        if (existingProduct) {
            this.cart.items[existingProductIndex].qty += 1;
            // console.log("I Made It");
        } else {
            newProduct = {...product, qty: 1};
            this.cart.items.push(newProduct);
        }

        const db = getDB();

        return db.collection('users').findOneAndUpdate({_id: new mongodb.ObjectID(this._id)}, {$set: {cart: this.cart}});
    }

    removeFromCart(productId) {
        if(this.cart.items.length <= 0) {
            return new Promise(Promise.resolve);
        } else {
            this.cart.items = this.cart.items.filter(prod => prod._id.toString() !== productId.toString());
            const db =  getDB();
            return db.collection('users').findOneAndUpdate({_id: new mongodb.ObjectID(this._id)} , {$set: {cart: this.cart}});
        }
    }

    updateCartItem(product) {
        if(this.cart.items.length <= 0) {
            return new Promise(Promise.resolve);
        } else {
            const existingProductIndex = this.cart.items.findIndex(prod => prod._id.toString() === product._id.toString());
            this.cart.items[existingProductIndex] = {...product, qty: this.cart.items[existingProductIndex].qty};

            const db = getDB();

            return db.collection('users').findOneAndUpdate({_id: this._id}, {$set: {cart: this.cart}});
        }
    }

    bookOrder() {
        const db = getDB();
        return db.collection('orders').insertOne({order: this.cart, client: this._id})
            .then(() => {
                this.cart = {items: []};
                return db.collection('users').findOneAndUpdate({_id: this._id}, {$set: {cart: this.cart}});
            })
            .catch(err => {
                throw err;
            })
    }

    getOrders() {
        const db = getDB();
        return db.collection('orders').find({client: this._id}).toArray();
    }

    static getUserById(userId) {
        const db = getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(userId)})
            .then(user => {
                return user;
            })
            .catch(err => {
                throw err;
            });
    }
};