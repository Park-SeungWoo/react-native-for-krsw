const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const chat = require('../schemas/chat');

router.use(express.json());
router.use(morgan('dev'));

// get chat datas
router.get('/get', (req, res, next) => {
  const roomname = req.query.roomname;
  chat.find({roomname: roomname}, (err, data) => {
    if (err) res.json({status: false});
    else if (data.length != 0) {
      const chatdata =
        data[0].chat.length > 60 ? data[0].chat.slice(0, 30) : data[0].chat;
      res.json({status: true, data: chatdata});
    } else {
      res.json({status: true, data: []});
    }
  });
});

module.exports = router;
