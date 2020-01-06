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
  Product.findOne({where: {id: productId}})
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
  // console.log(product);

};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product.update(
      {
          title: title,
          price: price,
          description: description,
          imageUrl: imageUrl
      },
      {
          where: {
              id: productId
          }
      }
  ).then(result => {
      res.redirect('/admin/products');
  }).catch(err => {
      throw err;
  })
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description
  })
  .then(() => {
      res.redirect('/admin/add-product?success=true');
  })
  .catch(err => {
      throw err;
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.destroy({where: {id: productId}})
      .then(() => {
          res.redirect('/admin/products');
      })
      .catch(err => {
          res.redirect('/admin/products?err=true');
      });
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
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
