const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const rootDir = require('./utils/path');

const User = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findById('5e27bdca7661a3285fa350c5')
        .then(user => {
            if (!user) {
                // Create One.
                const newUser = new User({
                    username: 'umarnaeem432',
                    email: 'umarnaeem432@retail.com',
                    cart: {
                        items: []
                    }
                });
                User.create(newUser)
                    .then(() => {
                        req.user = newUser;
                        next();
                    })
                    .catch(err => {
                        throw err;
                    });
            } else {
                req.user = user;
                next();
            }
        })
        .catch(err => {
            throw err;
        })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Connect to the database and once its connected then start the server.

mongoose.connect('mongodb+srv://umarnaeem432:gct165201b@cluster0-evjwn.mongodb.net/shop?retryWrites=true&w=majority')
.then(() => {
    app.listen(port);
})
.catch(err => {
    throw err;
})