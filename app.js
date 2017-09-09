// initialize modules
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser')
const path = require('path');

// initialize routes
const index = require('./server/routes/index');

// set up body data parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false }))

// set up our static path 
app.use(express.static(path.join(__dirname, 'dist')));

// setting up routes
app.use('/test', index)

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




