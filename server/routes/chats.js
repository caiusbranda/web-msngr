var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Message = require('../models/message');
var User = require('../models/user');
var Chats = require('../models/chat');

// middleware to verify token
router.use('/', function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }

    jwt.verify(token, 'secret', function(err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        req.decoded = decoded; 
        next();
    });
});

// return messages in a chat with a specific id
router.get('/:id/message', function (req, res, next) {
    Chats.findById(req.params.id, function(err, chat) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }
        var messages = [];
        // used to prevent async jump ahead
        var completed = 0;
        
        // loop through each message and find their content (is there a better way to do this?)
        chat.messages.forEach(function(message) {
            Message.findById(message, function(err, content) {
                messages.push(content.contentText)
                completed++;
                if (completed == chat.messages.length) {
                    sendMessages();
                }
            });
        });

        function sendMessages() {
            res.status(200).json({
                message: 'Successfully found chat',
                messages: messages
            })
        }
    })
})

// create a new message within a chat
router.post('/:id/message', function (req, res, next) {
    var message = req.body.message;
    Chats.findById(req.params.id, function(err, chat) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }
        User.findById(req.decoded.user._id, function(err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            var message = new Message({
                contentText: req.body.content,
                author: user
            });
            message.save(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                chat.messages.push(result);
                chat.save();
                res.status(201).json({
                    message: 'Success',
                    obj: result
                });
            })
        });
    })
})

// return a chat with a specific ID
router.get('/:id', function (req, res, next) {
    Chats.findById(req.params.id, function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Successfully found chat',
            chat: result
        })
    })
});

// return all chats
router.get('/', function(req, res, next) {
    Chats.find({'users': req.decoded.user._id}, function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Successfully returned chats',
            chats: result
        })
    });
});

// create a new chat
router.post('/', function(req, res, next){
    var participants = req.body.participants;
    var validUsers = [];

    // used to prevent async jump ahead
    var completed = 0;
    
    // loop through each participant and find their user object
    participants.forEach(function(participant) {
        User.findOne({email: participant}, function(err, party) {
            validUsers.push(party)
            completed++;
            if (completed == participants.length) {
                saveChat();
            }
        });
    });

    // create the chat
    function saveChat() {
        if (validUsers.length == 0) {
            return res.status(500).json({
                title: 'No valid users found',
                error: 'None of the entered participants are registered'
            })
        }

        // add ourselves to the chat
        validUsers.push(req.decoded.user);

        var chat = new Chats({
            users: validUsers,
            messages: []
        });

        chat.save(function (err, result) {
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
    }
});

module.exports = router;