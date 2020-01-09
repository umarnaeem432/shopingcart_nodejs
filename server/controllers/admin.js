const ObjectID = require('mongodb').ObjectID;
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode){
    res.redirect('/');
  }

  const productId = req.params.productId;
  Product.getProductById(productId)
      .then((product) => {
        // console.log(result);
          res.render('admin/edit-product', {
              pageTitle: 'Edit Product',
              path: '/admin/edit-product',
              editing: editMode,
              product: product
          });
      })
      .catch(err => {
        throw err;
      });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const updatedProduct = new Product(title, price, imageUrl, description, productId, req.user._id);

  updatedProduct.updateProduct()
      .then(() => {
          return req.user.updateCartItem(updatedProduct);
      })
      .then(() => {
          res.redirect('/admin/products?prod_updt=true');
      })
      .catch(err => {
          throw err;
      })

};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, price, imageUrl, description, null ,req.user._id);

  product.save()
      .then(() => {
          res.redirect('/admin/add-product?prod_added=true');
      })
      .catch(err => {
          throw err;
      });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteProduct(productId)
      .then(() => {
          req.user.removeFromCart(productId);
          res.redirect('/admin/products');
      })
      .catch(err => {
          res.redirect('/admin/products?err=true');
      });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
      .then(products => {
          res.render('admin/products', {
              prods: products,
              pageTitle: 'Admin Products',
              path: '/admin/products'
          });
      })
      .catch(err => {
          throw err;
      })
};
