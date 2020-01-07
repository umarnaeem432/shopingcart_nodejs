const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');


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
  req.user.getCart()
      .then(cart => {
          return cart.getProducts({where: {id: productId}});
      })
      .then(products => {
          const product = products[0];
          return product.cartItem.destroy();
      })
      .then(() => {
          res.redirect('/cart');
      })
      .catch(err => {
          throw err;
      })
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
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
        })
        .then((products) => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => {
            throw err;
        });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;

  req.user.getCart()
      .then(cart => {
          // console.log("Cart: ", cart);
          fetchedCart = cart;
          return cart.getProducts({where: {id: productId}});
      }).then(products => {
          // console.log(products);
          const product = products[0];
          let newQty = 1;
          if (product) {
              const oldQty = product.cartItem.qty;
              newQty += oldQty;
              fetchedCart.addProduct(product, {through: {qty: newQty}}).then(() => {
                  res.redirect('/products');
              }).catch(err => {
                  throw err;
              });
          }
          Product.findByPk(productId)
              .then(prod => {
                  fetchedCart.addProduct(prod, {through: {qty: newQty}});
                  res.redirect('/products');
              })
              .catch(err => {
                  throw err;
              })

  })
      .catch(err => {
          throw err;
      })
};

exports.postOrder = (req, res,  next) => {
    let fetchedCart;
    let productsToAdd;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            // console.log(products);
            productsToAdd = products;
            return req.user.createOrder();
        })
        .then(order => {
            return order.addProducts(productsToAdd.map(prod => {
                prod.orderItem = { qty: prod.cartItem.qty };
                return prod;
            }));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            throw err;
        })
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
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
