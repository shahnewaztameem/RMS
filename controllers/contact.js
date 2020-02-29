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
    res.render('contact', error);
});

module.exports = router;