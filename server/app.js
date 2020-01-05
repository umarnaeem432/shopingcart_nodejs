const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const errorController = require('./controllers/error');

const sequelize = require('./utils/database');

const rootDir = require('./utils/path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'views'));

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(rootDir , 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
    .then(() => {
        // console.log(res);
        app.listen(port);
    })
    .catch(err => {
    throw err;
});


