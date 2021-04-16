const express = require('express');
const morgan = require('morgan'); // for log
const router = express.Router();
const chat = require('../schemas/chat');

router.use(express.json());
router.use(morgan('dev'));

// get chat datas
router.get('/get', (req, res, next) => {
  const {roomname, start, end} = req.query;
  chat.find({roomname: roomname}, (err, data) => {
    if (err) res.json({status: false});
    else if (data.length != 0) {
      const chatdata = data[0].chat.slice(start, end);
      const more = chatdata.length == 30;
      res.json({status: true, data: chatdata, more: more});
    } else {
      res.json({status: true, data: []});
    }
  });
});

module.exports = router;
