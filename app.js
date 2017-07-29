const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router');


// Set up MongoDB
const mongoose = require('mongoose');
const uristring = process.env.MONGODB_URI;
console.log(uristring);

mongoose.connect(uristring);

const port = process.env.PORT || 3030;

// app setup
const app = express();
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const server = http.createServer(app);
server.listen(port);
console.log('Server listening on', port);

