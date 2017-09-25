require('dotenv').config();
// initialize modules
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// initialize routes
const apiRoutes = require('./server/routes/api');

// initialize socket events
socketEvents = require('./server/socketEvents');  

const app = express();

const mongoConnString = process.env.mongodb;

var options = {
    useMongoClient: true,
    user: process.env.username,
    pass: process.env.password
  };

mongoose.connect(mongoConnString, options, function(err){
    if (err) {
        console.log(err);
    }
});

// set up body data parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }))

// set up our static path 
app.use(express.static(path.join(__dirname, 'dist')));

// setting up routes
app.use('/api', apiRoutes);


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

// set up the server to use socket.io
const io = require('socket.io').listen(server);
socketEvents(io);




