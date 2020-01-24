const Product = require('../models/product');
const User = require('../models/user');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user._id
	});

	product.save()
		.then(() => {
			res.redirect('/admin/add-product?prod_added=true');
		})
		.catch(err => {
			throw err;
		})

};

exports.getProducts = (req, res, next) => {
	Product.find({
			userId: req.user._id
		})
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

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		res.redirect('/');
	}

	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {

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

	Product.findById(productId)
		.then(product => {
			product.title = title;
			product.imageUrl = imageUrl;
			product.price = price;
			product.description = description;
			return product.save();
		})
		.then(() => {
			res.redirect('/admin/products?prod_updt=true');
		})
		.catch(err => {
			throw err;
		})
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.deleteOne({
			_id: productId
		})
		.then(() => {
			return User.updateMany({}, {
				$pop: {"cart.items" : {productId: productId}}
			});
		})
		.then(() => {
			res.redirect('/admin/products');
		})
		.catch(err => {
			res.redirect('/admin/products?err=true');
		});
};