const chat = require('../schemas/chat');

const addChat = (data, socket) => {
  if (!data.reserved) {
    // if changed date
    if (data.showdatebar) {
      const datebarquery = {
        roomname: data.name,
      };
      const datebaraddquery = {
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
      chat.updateOne(datebarquery, datebaraddquery, (err, res) => {
        console.log(`add chat : add date bar : ${JSON.stringify(res)}`);
      });
    }

    if (data.data.prevdate) {
      const datequery = {
        roomname: data.name,
      };
      const dateupdatequery = {
        $set: {
          'chat.0.showdate': false,
        },
      };
      chat.updateOne(datequery, dateupdatequery, (err, res) => {
        console.log(
          `addchat : prevchat.showdate = false : ${JSON.stringify(res)}`,
        );
      });
    }
  }

  // add chat
  const query = {
    roomname: data.name,
  };
  const updatequery = {
    $push: {chat: {$each: [data.data], $position: 0}},
  };
  chat.updateOne(query, updatequery, (err, res) => {
    console.log(`addchat : ${JSON.stringify(res)}`);
    if (socket)
      socket.to(data.name).emit('s2cmsg', {
        data: data.data,
        showdatebar: data.showdatebar,
        dateid: data.dateid,
        changeprev: data.data.prevdate,
      });
  });
};

const deleteChat = (data, socket) => {
  const {id, chatdata, roomname, idx, next, previd} = data;
  if (socket) socket.to(roomname).emit('deleted', {data: chatdata, idx: idx});
  // change in db
  if ((chatdata.deletetome || chatdata.deletetoleft) && chatdata.showdate) {
    const changequery = {
      roomname: roomname,
      'chat.uniqueid': previd,
    };
    const changeprevdatequery = {
      $set: {
        'chat.$.showdate': true,
      },
    };
    chat.updateOne(changequery, changeprevdatequery, (err, res) => {
      console.log(`delete : prevchat.showdate = true : ${JSON.stringify(res)}`);
    });
  }
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
  chat.updateOne(query, updatequery, (err, res) => {
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
    chat.updateOne(nextquery, nextupdatequery, (err, res) => {
      console.log('delete : nextavartar : ' + JSON.stringify(res));
    });
  }
};

const viewChat = (data, socket) => {
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
  chat.updateOne(query, updatequery, (err, res) => {
    console.log(`viewchat : ${JSON.stringify(res)}`);
  });

  if (socket)
    socket.on('disconnect', reason => {
      console.log(reason);
    });
};

exports.addChat = addChat;
exports.deleteChat = deleteChat;
exports.viewChat = viewChat;
