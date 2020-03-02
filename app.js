var express = require('express');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var expressValidator = require('express-validator');
var signup = require('./controllers/signup');
var login = require('./controllers/login');
var logout = require('./controllers/logout');
var adminHome = require('./controllers/admin_home');
var foodExperiance = require('./controllers/food_experience');
var menu = require('./controllers/menu');
var reservation = require('./controllers/reservation');
var contact = require('./controllers/contact');

var ejs = require('ejs');
var port = process.env.PORT || 3000;

//initialize express app
var app = express();

//configuration
app.set('view engine', 'ejs');

//middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressSession({
    secret: 'super secret',
    saveUninitialized: true,
    resave: false
}));
app.use(expressValidator());
app.use('/signup', signup);
app.use('/login', login);
app.use('/home-admin', adminHome);
app.use('/logout', logout);
app.use('/food-experience', foodExperiance);
app.use('/menu', menu);
app.use('/reservation', reservation);
app.use('/contact', contact);
//route
app.get('/', (req, res) => {
    var err = {
        errors: req.session.errors
    };
    req.session.errors = null;
    res.render('index', err);
});

//server startup
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})