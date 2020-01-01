const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const pth = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(productId, productPrice) {
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
            if(existingProduct) {
                existingProduct.qty = existingProduct.qty + 1;
                cart.products[existingProductIndex] = existingProduct;
            }else {
                newProduct = {id: productId, qty: 1};
                cart.products.push(newProduct);
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(pth, JSON.stringify(cart), err => {
                throw err;
            });
        });
    }
};