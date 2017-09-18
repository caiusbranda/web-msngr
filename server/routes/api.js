var express = require('express');
var router = express.Router();
const indexRoute = require('./index');
const userRoute = require('./user');
const chatsRoute = require('./chats');


router.use('/test', indexRoute);
router.use('/user', userRoute);
router.use('/chats', chatsRoute);

router.get('*', function (req, res) {
    res.status(500).json({
        title: 'That api route does not exist yet',
        error: { messages: "invalid api route" }
    });
        
});

module.exports = router;