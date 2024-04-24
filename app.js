var cookieParser = require('cookie-parser');
var express = require('express');
var logger = require('morgan');
const path = require('path')
const cors = require('cors');
var http = require('http');
require("dotenv").config();

// USSD route
var ussdRouter = require('./routes/ussd');

// WEB app route
var usersRouter = require('./routes/users');
var doctorRouter = require('./routes/doctor');
var patientRouter = require('./routes/patient');
var pharmaRouter = require('./routes/pharmacy');
var hospitalRouter = require('./routes/hospital');

// Utility routes
var setRouter = require('./routes/setQuestion');

var app = express();


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


if(process.env.NODE_ENV === "production"){
    app.use(express.static('dokutela'))
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dokutela', 'index.html'))
    })
}

app.use('/set', setRouter);
app.use('/out/ussd', ussdRouter);
app.use('/api/users', usersRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);
app.use('/api/pharmacy', pharmaRouter);
app.use('/api/hospital', hospitalRouter);


function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);
var server = http.createServer(app);
console.log("[server] Port- http://localhost:"+ port)
server.listen(port);

module.exports = app;