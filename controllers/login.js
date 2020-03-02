var express = require('express');
var userModel = require.main.require('./model/user-model');
var router = express.Router();

//ROUTES
router.get('/', (req, res) => {
    var error = {
        errors: req.session.errors,
        success: req.session.success
    };
    req.session.errors = null;
    req.session.success = null;
    res.render('login/index', error);
});

router.post('/', (req, res) => {

    req.check('email', 'Invalid e-mail address').isEmail();
    req.check('password', 'Empty Password').notEmpty().rtrim();

    var err = req.validationErrors();

    if (!err) {
        req.session.errors = null;
        var user = {
            user_email: req.body.email,
            user_pass: req.body.password
        };
        userModel.validate(user, function (result) {
            if (result.id != null) {

                req.session.user_id = result.id;
                //console.log(req.session.user_id);
                req.session.user_name = result.username;
                req.session.user_firstname = result.user_firstname;
                req.session.user_lastname = result.user_lastname;
                req.session.user_email = result.user_email;
                req.session.user_type = result.user_type;
                req.session.user_gender = result.user_gender;
                req.session.u_type = result.user_type;

                if (req.session.u_type == "admin") {
                    res.redirect('/home-admin');
                } else
                    res.redirect('/home-member');
            } else {
                req.session.success = "Invalid User";
                res.redirect('/login');
            }
        });
    } else {
        req.session.errors = err;
        res.redirect('/login');
    }

});

module.exports = router;