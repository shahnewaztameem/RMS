var express = require('express');
var userModel = require.main.require('./model/user-model');
var router = express.Router();

//ROUTES
router.get('/', (req, res) => {
    var err = {
        errors: req.session.errors,
        success: req.session.success
    };
    req.session.errors = null;
    req.session.success = null;
    res.render('signup/index', err);
});

//signup POST
router.post('/', (req, res) => {
    req.check('username', 'Empty username').notEmpty().rtrim;
    req.check('firstname', 'Empty Firstname').notEmpty().rtrim();
    req.check('lastname', 'Empty LastName').notEmpty().rtrim();
    req.check('email', 'Invalid e-mail address').isEmail();
    req.check('password', 'Missmatched password or length less than 6').isLength({
        min: 6
    }).equals(req.body.confirm_pass);
    var err = req.validationErrors();
    if (!err) {
        var user = {
            username: req.body.username,
            user_firstname: req.body.firstname,
            user_lastname: req.body.lastname,
            user_email: req.body.email,
            user_type: req.body.user_type,
            user_password: req.body.password,
            user_gender: req.body.u_gender
        };
        console.log(user);
        userModel.insert(user, function (results) {
            if (results) {
                req.session.success = 'Successfully sign up...Now you can login!!';
                res.redirect('/signup');
            } else {
                req.session.success = 'Probelm with signup..try again'
                res.redirect('/signup');
            }
        });
    } else {
        req.session.errors = err;
        res.redirect('/signup');
    }


});
module.exports = router;