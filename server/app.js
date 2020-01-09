const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const rootDir = require('./utils/path');
const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(rootDir , 'public')));

app.use((req, res, next) => {
    User.getUserById('5e15e9f255357e1e44b97d0e')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            throw err;
        })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(port);
});

