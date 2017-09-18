var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

function verifyToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ 
            success: false, 
            title: 'Not logged in!',
            error: { message: 'Please login first!' }
        });
    }
    
    jwt.verify(token, process.env.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                success: false,
                title: 'Not logged in!',
                error: { message: 'Please login first!'}
            });
        }
        req.decoded = decoded;
        next();
    });
}

function verifyToken2(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(200).json({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
    
    jwt.verify(token, process.env.secret, function(err, decoded) {
        if (err) {
            return res.status(200).json({
                success: false,
                title: 'Not Authenticated',
                error: err
            });
        }
        req.decoded = decoded;
        next();
    });
}

router.get('/authenticate', verifyToken2, function(req,res) {
    return res.status(200).json({
        success: true
    });
});

// getting user information
router.get('/', verifyToken, function (req, res, next) {
    User.findById(req.decoded.user._id).
    populate('chats').
    populate('friends').
    exec(function(err, user){
        res.status(200).json({
            message: 'Successfully returned user',
            user: user
        })
    });
});

// adding a friend 
router.post('/friends', verifyToken, function (req, res, next) {

    // assuming I'm being passed an array (even an array of 1) of users
    var participants = req.body.users;
    var validUsers = [];

    // used to prevent async jump ahead
    var completed = 0;
    
    // loop through each participant and find their user object
    participants.forEach(function(participant) {
        User.findOne({email: participant.email}, function(err, party) {
            validUsers.push(party);
            completed++;
            if (completed == participants.length) {
                addFriend();
            }
        });
    });

    function addFriend() {
        if (validUsers.length == 0) {
            return res.status(500).json({
                title: 'No valid users found',
                error: { message:'None of the entered participants are registered'}
            })
        }

        // add ourselves to the users' friends list and add them to our friends list
        for (var i = 0; i < validUsers.length; i++) {
            // return res.send({users: validUsers, length: validUsers.length, id: validUsers[0]._id});
            User.update({ _id: req.decoded.user._id}, {$push: { friends: validUsers[i]}}, function(err, raw) {
                
            });
            User.update({ _id: validUsers[i]._id }, {$push: { friends: req.decoded.user}}, function(err, raw) {
                // console.log(raw);
            });
        }

        return res.status(201).json({
            message: 'Success',
            users: validUsers
        });
    }
});

// signing in as a user
router.post('/signin', function(req, res, next){
    // using findOne because each email is unique 
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Invalid password or email.',
                error: { message: 'Please try logging in again' }
            });
        }

        if (!user) {
            return res.status(401).json({
                title: 'Invalid password or email.',
                error: { message: 'Please try logging in again' }
            });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Invalid password or email.',
                error: { message: 'Please try logging in again' }
            });
        }

        var token = jwt.sign({user: user}, process.env.secret, { expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id,
            name: user.name, 
            email: user.email 
        })
         
    })
    

});

// creating a new user
router.post('/', function (req, res, next) {
    var user = new User({
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        chats: [],
        friends: []
    });
    user.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Email is already taken',
                error: { message: 'Please use a different email!' }
            });
        }
        res.status(201).json({
            message: 'User has been created',
            obj: result
        });
    });
});

module.exports = router;