var express = require('express');
var userModel = require.main.require('./model/user-model');
var router = express.Router();
router.get('*', function (req, res, next) {
    if (req.session.user_id != null) {
        next();
    } else {
        res.redirect('/login');
    }
});
router.get('/', (req, res) => {
    userModel.get(req.session.user_id, (result) => {
        var data = {
            user_info: result
        };
        res.render('admin/index', data);
    });
});

//user list route
router.get('/user_list', (req, res) => {

    userModel.getAll(function (results) {
        var data = {
            admin_id: req.session.user_id,
            username: req.session.user_name,
            uList: results
        };
        res.render('admin/user_list', data);
    });
});

router.get("/delete/:id", function (req, res) {

    userModel.delete(req.params.id, function (status) {
        res.redirect('/home-admin/user_list');
    });
});

//user individual edit
router.get('/user_edit/:id', function(req, res){
	userModel.get(req.params.id, function(result){
		res.render('admin/user_edit', {user_info: result});
	});
});
router.post('/user_edit/:id', function(req, res){
	
    var user = {
        user_id: req.params.id,
        user_type: req.body.user_type
    };

    userModel.IndividualUserUpdate(user, function(status){
        if(status){
            res.redirect('/home-admin/user_list');
        }else{
            res.redirect('/home/user_edit/'+req.params.id);
        }
    });
});

//edit admin profile
router.get('/admin-edit_account', (req, res) => {
    userModel.get(req.session.user_id, (result_info) => {
        if (result_info.id != null) {
            var data = {
                user_info: result_info,
                errors: req.session.errors,
                username: req.session.user_name
            };
            res.render('admin/edit_profile', data);
        } else {
            res.redirect('/home-admin')
        }
    });
});

router.post('/admin-edit_account', (req, res) => {

    req.check('firstname', 'Empty First name').notEmpty().rtrim();
    req.check('lastname', 'Empty last name').notEmpty().rtrim();
    req.check('email', 'Invalid e-mail').isEmail();
    req.check('password', 'Invalid password length').isLength({
        min: 6
    });

    var err = req.validationErrors();
    if (!err) {
        req.session.errors = null;
        var update_user = {
            user_id: req.session.user_id,
            username: req.body.username,
            user_firstname: req.body.firstname,
            user_lastname: req.body.lastname,
            user_email: req.body.email,
            user_type: req.body.user_type,
            user_password: req.body.password,
            user_gender: req.body.u_gender

        };

        //update user_info table information
        userModel.update(update_user, (user_update_status) => {
            if (user_update_status) {
                res.redirect('/home-admin');
            } else {
                res.redirect('/home-admin/admin-edit_account');
            }
        });
    } else {
        req.session.errors = err;
        res.redirect('/home-admin/admin-edit_account');
    }
});

//add users get
router.get('/add_users', (req, res) => {
    var err = {
        errors: req.session.errors,
        success: req.session.success,
        username: req.session.user_name
    };
    req.session.errors = null;
    req.session.success = null;

    res.render('admin/add_users', err);
});

//add a new user

router.post('/add_users', (req, res) => {
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
                req.session.success = 'User added!!';
                res.redirect('/home-admin');
            } else {
                req.session.success = 'Probelm with add new user'
                res.redirect('/home-admin/user_list');
            }
        });
    } else {
        req.session.errors = err;
        res.redirect('/home-admin/add_users');
    }
});

//add restaurants & menus
router.get('/add_restaurants', (req, res) => {
    var data = {
        errors: req.session.errors,
        username: req.session.user_name
    };
    res.render('admin/add_restaurants', data);
});

module.exports = router;