const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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

exports.getProduct = (req, res , next) => {
  const productId = req.params.productId;
  Product.getProductById(productId)
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

exports.deleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId)
      .then(() => {
          res.redirect('/cart?prod_del=true');
      })
      .catch(err => {
          throw err;
      })
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
    // console.log(req.user.cart);
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: req.user.cart.items
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.getProductById(productId)
      .then(product => {
          console.log(product);
          return req.user.addToCart(product);
      })
      .then(() => {
          // console.log("Product Added TO The Cart!");
          res.redirect('/products?added_to_cart=true');
      })
      .catch(err => {
          throw err;
      })
};

exports.postOrder = (req, res,  next) => {
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
