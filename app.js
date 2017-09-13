require('dotenv').config();
// initialize modules
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
// initialize routes
const indexRoute = require('./server/routes/index');
const userRoute = require('./server/routes/user');
const chatsRoute = require('./server/routes/chats');

const app = express();

var options = {
    useMongoClient: true,
    user: process.env.username,
    pass: process.env.password
  };

console.log(options);
mongoose.connect('mongodb://ds129144.mlab.com:29144/web-msngr', options, function(err){
    if (err) {
        console.log(err);
    }
});

/* mongoose.connect('mongodb://' + username + 
    ':' + password + '@ds129144.mlab.com:29144/web-msngr'); */

// set up body data parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }))

// set up our static path 
app.use(express.static(path.join(__dirname, 'dist')));

// setting up routes
app.use('/test', indexRoute);
app.use('/user', userRoute);
app.use('/chats', chatsRoute);

// redirect other requests to the index
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

// setting up the server
const port = process.env.PORT || '3000';
const server = http.createServer(app)

// start the server
server.listen(port);
console.log("Server started on localhost:" + port);




