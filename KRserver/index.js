const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
// socket
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
console.log('socket connection prepared!');

// connect to mongodb server
mongoose.connect(
  process.env.DBADDR,
  {
    dbName: 'KRapp_db',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
    if (err) {
      console.log('Mongodb connection failed : ', err);
    } else {
      console.log('Successfully connected to Mongodb!!');
    }
  },
);

// socket connection
io.on('connection', socket => {
  // chect clients length
  console.log(`${io.engine.clientsCount} connected!`);

  socket.on('c2smsg', data => {
    console.log('c2s (name) : ' + data.name);
    console.log('c2s (msg) : ' + data.msg);
    console.log('c2s (date) : ' + data.time);
    // setTimeout(() => {
    socket.emit('s2cmsg', {txt: data.msg, align: 'L', time: data.time});
    // }, 3000);
  });
  socket.on('disconnect', reason => {
    console.log(reason);
  });
});

// router
const login = require('./routes/account/login');
const register = require('./routes/account/register');
const find = require('./routes/account/find');

app.use('/login', login);
app.use('/register', register);
app.use('/find', find);

// listen
server.listen(process.env.PORT || 3000, process.env.HOST, () => {
  console.log(
    `Server is listening at ${process.env.HOST}:${process.env.PORT || 3000}`,
  );
});

// err handling
app.use(function (err, req, res, next) {
  res.json({mes: err.message});
});
