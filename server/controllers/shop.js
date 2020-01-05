const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
    Product.findAll()
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
  Product.findOne({where: {id: productId}})
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
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
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


    const cartProducts = [];
      res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts
      });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    console.log(productId, product);
    Cart.addProduct(productId, product.price , err => {
      if (err) throw err;
      console.log(req.path);
      res.redirect('/products');
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
