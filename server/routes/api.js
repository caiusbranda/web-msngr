var express = require('express');
var router = express.Router();
const indexRoute = require('./index');
const userRoute = require('./user');
const chatsRoute = require('./chats');


router.use('/test', indexRoute);
router.use('/user', userRoute);
router.use('/chats', chatsRoute);

router.get('*', function (req, res) {
    res.send('invalid api request');
});

module.exports = router;