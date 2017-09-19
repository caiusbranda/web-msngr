var express = require('express');
var router = express.Router();
const userRoute = require('./user');
const chatsRoute = require('./chats');

router.use('/user', userRoute);
router.use('/chats', chatsRoute);

router.get('*', function (req, res) {
    res.status(404).send('invalid api request');
});

module.exports = router;