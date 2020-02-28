var db = require('./db');

module.exports = {
    validate: function (user, callback) {
        var sql = "select * from users_info where user_email=? and user_password =?";
        db.getResults(sql, [user.user_email, user.user_pass], function (result) {
            if (result.length > 0) {
                callback(result[0]);
            } else {
                callback([]);
            }
        })
    },
    insert: function (user, callback) {
        var sql = "INSERT into users_info values(null,?,?,?,?,?,?,?)";
        db.execute(sql, [
            user.username,
            user.user_firstname,
            user.user_lastname,
            user.user_email,
            user.user_type,
            user.user_password,
            user.user_gender
        ], function (success) {
            callback(success);
        });
    },
    get: function (userId, callback) {
        var sql = "select * from users_info where id= ?";
        db.getResults(sql, [userId], function (result) {
            if (result.length > 0) {
                callback(result[0]);
            } else {
                callback([]);
            }
        });
    },
    getAll: function (callback) {
        var sql = "select * from users_info";
        db.getResults(sql, [], function (results) {
            callback(results);
        });
    },
    delete: function (id, callback) {
        var sql = "delete from users_info where id=?";
        db.execute(sql, [id], function (status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    update: function (user, callback) {
        var sql = "UPDATE users_info SET user_firstname=? , user_lastname=? , user_email=? , user_password=? ,user_gender=? where id=?";
        db.execute(sql, [
            user.user_firstname,
            user.user_lastname,
            user.user_email,
            user.user_password,
            user.user_gender,
            user.user_id
        ], function (status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    IndividualUserUpdate: function (user, callback) {
        var sql = "UPDATE users_info SET user_type=?  where id=?";
        db.execute(sql, [
            user.user_type,
            user.user_id
        ], function (status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
}