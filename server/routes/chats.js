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
            title: 'Not logged in!',
            error: { message: 'Please login first!' } 
        });
    }

    jwt.verify(token, process.env.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                success: false, 
                title: 'Not logged in!',
                error: { message: 'Please login first!' }
            });
        }
        req.decoded = decoded; 
        next();
    });
});

// return messages in a chat with a specific id
router.get('/:id/content', function (req, res, next) {
    
    User.findById(req.decoded.user._id).
    populate({
        path: 'chats',
        model: 'Chat',
        populate: {
            path: 'messages',
            model: 'Message',
            populate: {
                path: 'author',
                model: 'User'
            }
        }
    }).
    exec(function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }

        for (i in user.chats) {
            if (user.chats[i]._id == req.params.id) {
                Message.populate(user.chats[i].messages, {path: 'author'}, function(){
                    if (err) {
                        return res.status(500).json({
                            title: 'Server error',
                            error: err
                        });
                    }

                    res.status(200).json({
                        message: 'Successfully returned chats',
                        messages: user.chats[i].messages
                    })
                });
                
            }
        }
    })
})

// create a new message within a chat
router.post('/:id/content', function (req, res, next) {
    var message = req.body.message;

    User.findById(req.decoded.user._id).
    populate('chats').
    exec(function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }

        for (i in user.chats) {
            if (user.chats[i]._id == req.params.id) {
                addMessage(user.chats[i]);
            }
        }
    })
    
    function addMessage(chat) {
        var message = new Message({
            contentText: req.body.contentText,
            date: req.body.date,
            author: req.decoded.user
        });
        message.save(function (err, message) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            Chats.update({ _id: chat._id }, {$push: { messages: message }}, function(err, raw) {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
            });

            Message.populate(message, {path: 'author'}, function(err, message){
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }

                res.status(201).json({
                    message: 'Success',
                    obj: message
                });
            }); 
        });
    }
});

// return a chat with a specific ID
router.get('/:id', function (req, res, next) {
    User.findById(req.decoded.user._id).
    populate('chats').
    exec(function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }

        for (i in user.chats) {
            if (user.chats[i]._id == req.params.id) {
                return res.status(200).json({
                    message: 'Successfully returned chat',
                    chat: user.chats[i]
                })
            }
        }
    })
});

// return all chats
router.get('/', function(req, res, next) {
    User.findById(req.decoded.user._id).
    populate({
        path: 'chats',
        model: 'Chat',
        populate: {
            path: 'messages',
            model: 'Message',
            populate: {
                path: 'author',
                model: 'User'
            }
        } //populates children of chat (users, messages, and messages' author)
    }).
    exec(function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Server error',
                error: err
            });
        }

        Chats.populate(user.chats, {path: 'users'}, function(err, chats){
            if (err) {
                return res.status(500).json({
                    title: 'Server error',
                    error: err
                });
            }
            
            res.status(200).json({
                message: 'Successfully returned chats',
                chats: chats
            })
        });
        
    })
});

// create a new chat
router.post('/', function(req, res, next){
    var participants = req.body.users;
    var validUsers = [];

    // used to prevent async jump ahead
    var completed = 0;
    
    // loop through each participant and find their user object
    participants.forEach(function(participant) {
        User.findOne({email: participant.email}, function(err, party) {
            if(err){
                return res.status(500).json({
                    title: "Error finding user",
                    err: { message: 'One or more invalid users!' }
                });
            }
            validUsers.push(party)
            completed++;
            if (completed === participants.length) {
                saveChat();
            }
        });
    });

    // create the chat
    function saveChat() {
        if (validUsers.length == 0) {
            return res.status(500).json({
                title: 'No valid users found',
                error: { message: 'None of the entered participants are registered' }
            })
        }

        // add ourselves to the chat
        validUsers.push(req.decoded.user);

        var chat = new Chats({
            users: validUsers,
            messages: [],
            name: req.body.name
        });

        chat.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred while saving chat',
                    error: err
                });
            }

            res.status(201).json({
                message: 'Success',
                obj: result
            });
            
            for (var i = 0; i < validUsers.length; i++) {
                User.update({ _id: validUsers[i]._id }, {$push: { chats: result }}, function(err, raw) {
                    //console.log(raw);
                });
            }
            
        });

    }
});

module.exports = router;