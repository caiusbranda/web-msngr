var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/', function (req, res, next) {
    User.find({}, function(err, users){
        res.send(users);
    });
});

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        chats: null
    });
    user.save(function (err, result) {
        res.send(result);
    });
});

module.exports = router;