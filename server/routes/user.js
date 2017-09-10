var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.get('/', function (req, res, next) {
    User.find({}, function(err, users){
        res.send(users);
    });
});

router.post('/signin', function(req, res, next){
    // using findOne because each email is unique 
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'A server error occurred',
                error: err
            });
        }

        if (!user) {
            return res.status(401).json({
                title: 'Login failed. Invalid credentials.',
                error: err
            });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed. Invalid credentials.',
                error: err
            });
        }

        var token = jwt.sign({user: user}, 'secret', { expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
        })
         
    })
    

})
// creating a new user
router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        chats: null
    });
    user.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'A server error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'User has been created',
            obj: result
        });
    });
});

module.exports = router;