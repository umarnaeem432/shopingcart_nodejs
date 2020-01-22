const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            throw err;
        });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            throw err;
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            throw err;
        });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: req.user.cart.items
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    const existingProductIndex = req.user.cart.items.findIndex(prod => prod.productId._id.toString() === productId.toString());
    const existingProduct = req.user.cart.items[existingProductIndex];

    if (existingProduct) {
        console.log(existingProduct);
        req.user.cart.items[existingProductIndex].qty += 1;
        req.user.save()
            .then(() => {
                res.redirect('/products?atoc=true');
            })
            .catch(err => {
                throw err;
            })
    } else {
        const newProduct = {
            productId: productId,
            qty: 1
        };
        req.user.cart.items.push(newProduct);
        req.user.save()
            .then(() => {
                res.redirect('/products?atoc=true');
            })
            .catch(err => {
                throw err;
            })
    }
};

exports.deleteProductFromCart = (req, res, next) => {
    const productId = req.body.productId;

    const newItemsForCart = req.user.cart.items.filter(prod => prod.productId._id.toString() !== productId.toString());
    req.user.cart.items = newItemsForCart;

    req.user.save()
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            throw err;
        })
};

exports.postOrder = (req, res, next) => {
    req.user.bookOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            throw err;
        })
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => {
            throw err;
        })
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};