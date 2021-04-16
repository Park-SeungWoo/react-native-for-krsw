const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
// socket
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
console.log('socket connection prepared!');

/////////////////////for chats
const chatting = require('./schemas/chat');
let Chats = mongoose.model('chat');
/////////////////////

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
    // if changed date
    if (data.showdatebar) {
      const datequery = {
        roomname: data.name,
      };
      const dateaddquery = {
        $push: {
          chat: {
            $each: [
              {
                date: data.data.time,
                showdatebar: data.showdatebar,
                uniqueid: data.dateid,
              },
            ],
            $position: 0,
          },
        },
      };
      chatting.updateOne(datequery, dateaddquery, (err, res) => []);
    }

    // add chat
    const query = {
      roomname: data.name,
    };
    const updatequery = {
      $push: {chat: {$each: [data.data], $position: 0}},
    };
    chatting.updateOne(query, updatequery, (err, res) => {
      if (!err)
        socket.to(data.name).emit('s2cmsg', {
          data: data.data,
          showdatebar: data.showdatebar,
          dateid: data.dateid,
        });
    });
  });

  socket.on('deletechat', data => {
    const {id, chatdata, roomname, idx, next} = data;
    socket.to(roomname).emit('deleted', {data: chatdata, idx: idx});
    // change in db
    const query = {
      roomname: roomname,
      'chat.uniqueid': id,
    };
    const updatequery = {
      $set: {
        'chat.$.deleted': chatdata.deleted,
        'chat.$.deletetome': chatdata.deletetome,
        'chat.$.deletetoleft': chatdata.deletetoleft,
      },
    };
    chatting.updateOne(query, updatequery, (err, res) => {
      console.log('delete : ' + JSON.stringify(res));
    });
    if (next.status) {
      const nextquery = {
        roomname: roomname,
        'chat.uniqueid': next.id,
      };
      const nextupdatequery = {
        $set: {
          'chat.$.avartar': true,
        },
      };
      chatting.updateOne(nextquery, nextupdatequery, (err, res) => {
        console.log('nextavartar : ' + JSON.stringify(res));
      });
    }
  });

  socket.on('viewchat', data => {
    const {id, idx, roomname} = data;
    socket.to(roomname).emit('viewed', {idx: idx});
    const query = {
      roomname: roomname,
      'chat.uniqueid': id,
    };
    const updatequery = {
      $set: {
        'chat.$.view': 0,
      },
    };
    chatting.updateOne(query, updatequery, (err, res) => {});
  });

  socket.on('disconnect', reason => {
    console.log(reason);
  });
});

// router
const login = require('./routes/account/login');
const register = require('./routes/account/register');
const find = require('./routes/account/find');
const token = require('./routes/token');
const couple = require('./routes/couple');
const chat = require('./routes/chatdata');

app.use('/login', login);
app.use('/register', register);
app.use('/find', find);
app.use('/token', token);
app.use('/couple', couple);
app.use('/chat', chat);

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
