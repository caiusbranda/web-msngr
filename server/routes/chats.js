var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Message = require('../models/message');
var User = require('../models/user');
var Chats = require('../models/chat');

router.use('/', function(req, res, next) {
    if (!token) {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
        console.log(req.path);
    }
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        console.log(token)
        req.decoded = decoded; 
        next();
    });
});

router.get('/', function(res, req, next) {
    console.log(req.decoded);
    Chats.findById(req.decoded.user._id, function(err, chats) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json({
            message: 'success',
            obj: chats
        });
    });
});

router.post('/', function(req, res, next){
    var participants = req.body.participants;
    
    User.findById(req.decoded.user._id, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        participants.push(user);

        var chat = new Chats({
            users: participants,
            chats: null
        });
    });
    chats.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        res.status(201).json({
            message: 'Success',
            obj: result
        });
    });
});

module.exports = router;