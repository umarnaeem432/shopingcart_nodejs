const fs = require('fs');
const path = require('path');

const Product = require('./product');
const rootDir = require('../utils/path');

const pth = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {

    static getCart(cb) {
        fs.readFile(pth, (err, fileContent) => {
            if(!err) {
                const cart = JSON.parse(fileContent);
                cb(cart);
            } else {
                cb(null);
            }
        });
    }

    static delProduct(productId, productPrice, cb) {
        fs.readFile(pth, (err, fileContent) => {
            if (!err) {
                const existingCart = JSON.parse(fileContent);
                const existingProducts = existingCart.products;
                const product = existingProducts.find(prod => prod.id === productId);
                if(product) {
                    const qty = product.qty;
                    const updatedProducts = existingProducts.filter(prod => prod.id !== productId);
                    existingCart.totalPrice = existingCart.totalPrice - (productPrice * qty);
                    existingCart.products = updatedProducts;
                    fs.writeFile(pth, JSON.stringify(existingCart), err => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null);
                        }
                    });
                } else {
                    cb(null);
                }
            } else {
                cb(err);
            }
        });
    }

    static addProduct(productId, productPrice , cb) {
        // Get All the products from the file.
        fs.readFile(pth, (err, fileContent) => {
            // If file does not exist. then create the cart object with nothing in it.
            let cart = {products: [], totalPrice: 0}; // products array will hold objects of the form {productId, productQuantity}
            if (!err) {
                // If the file exist.read the content and store it in a variable.
                cart = JSON.parse(fileContent);
            }

            // Check if the product is already added in the card or not.
            const existingProductIndex = cart.products.findIndex(product => product.id === productId);
            const existingProduct = cart.products[existingProductIndex];
            let newProduct;
            // if product is already there.increase the quantity.
            if (existingProduct) {
                existingProduct.qty = existingProduct.qty + 1;
                cart.products[existingProductIndex] = existingProduct;
            } else {
                newProduct = {id: productId, qty: 1};
                cart.products.push(newProduct);
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(pth, JSON.stringify(cart), err => {
                cb(err);
            });
        });
    }
};