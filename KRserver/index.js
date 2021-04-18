const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
// socket
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const schedule = require('node-schedule');
const chatMethods = require('./methods/chatMethods');
const sendReserved = require('./methods/reserve/sendReservedMessage');
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

  socket.on('joinemit', data => {
    socket.join(data.roomname);
    socket.emit(
      `${data.cli}joined`,
      `${data.cli} - joined to ${data.roomname}`,
    );
  });

  socket.on('leaveemit', roomname => {
    socket.leave(roomname);
  });

  socket.on('c2smsg', data => {
    chatMethods.addChat(data, socket);
  });

  socket.on('deletechat', data => {
    chatMethods.deleteChat(data, socket);
  });

  socket.on('viewchat', data => {
    chatMethods.viewChat(data, socket);
  });
});

// router
const login = require('./routes/account/login');
const register = require('./routes/account/register');
const find = require('./routes/account/find');
const token = require('./routes/token');
const couple = require('./routes/couple');
const chat = require('./routes/chatdata');
const reserved = require('./routes/reserved');

app.use('/login', login);
app.use('/register', register);
app.use('/find', find);
app.use('/token', token);
app.use('/couple', couple);
app.use('/chat', chat);
app.use('/reserved', reserved);

// err handling
app.use(function (err, req, res, next) {
  res.json({mes: err.message});
});

// listen
server.listen(process.env.PORT || 3000, process.env.HOST, () => {
  console.log(
    `Server is listening at ${process.env.HOST}:${process.env.PORT || 3000}`,
  );
});

// schedule reserved message
schedule.scheduleJob('1 * * * * *', sendReserved.sendReserved);
console.log('send reserved message scheduler is working!');
