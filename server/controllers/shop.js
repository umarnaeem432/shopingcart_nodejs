const Product = require('../models/product');
const User = require('../models/user');

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

    User.findById(req.user._id).select('cart')
    .populate('cart.items.productId')
    .then(cartWithUserId => {
        const cartProducts = cartWithUserId.cart.items.map(item => {
            return {
                ...
                item.productId._doc,
                qty: item.qty
            };
        });

        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
        });
    })
    .catch(err => {
        throw err;
    })
    // res.render('shop/cart', {
    //     path: '/cart',
    //     pageTitle: 'Your Cart',
    //     products: req.user.cart.items
    // });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    const existingProductIndex = req.user.cart.items.findIndex(cartProd => cartProd.productId.toString() === productId.toString());
    const existingProduct = req.user.cart.items[existingProductIndex];
    if(existingProduct) {
        existingProduct.qty += 1;
        req.user.cart.items[existingProductIndex] = existingProduct;
        req.user.save()
        .then(() => {
            res.redirect('/products'); // redirect to the products page.
        })
        .catch(err => {
            throw err;
        }) 
    } else {
        const newCartProduct = {
            productId: productId,
            qty: 1
        };

        req.user.cart.items.push(newCartProduct);
        req.user.save()
        .then(() => {
            res.redirect('/products'); // redirect to products page.
        })
        .catch(err => {
            throw err;
        })
    }
};

exports.deleteProductFromCart = (req, res, next) => {
    const productId = req.body.productId;

    const updatedCartItems = req.user.cart.items.filter(cartProd => cartProd.productId.toString() !== productId.toString());

    req.user.cart.items = updatedCartItems;

    req.user.save()
    .then(() => {
        res.redirect('/cart?del=true');
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