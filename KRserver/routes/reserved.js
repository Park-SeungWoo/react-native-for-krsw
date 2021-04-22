const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const ReservedMsg = require('../schemas/reservedmsg');

router.use(express.json());
router.use(morgan('dev'));

// ser reserved message
router.post('/set', (req, res, next) => {
  const {
    data,
    ToId,
    fromname,
    fromdate,
    roomname,
    reserveid,
    toname,
  } = req.body;
  const msg = new ReservedMsg({
    toid: ToId,
    fromname: fromname,
    data: data,
    fromdate: fromdate,
    sent: false,
    roomname: roomname,
    reserveid: reserveid,
    toname: toname,
  });
  msg.save();
  res.redirect('/');
});

router.get('/get', (req, res) => {
  const {roomname, sender} = req.query;
  const query = {
    roomname: roomname,
    'data.sender': sender,
  };
  ReservedMsg.find(query, (err, datas) => {
    if (!err) {
      if (datas.length != 0) res.json({status: true, datas: datas});
      else res.json({status: false});
    } else res.json({status: false});
  });
});

router.delete('/delete', (req, res) => {
  const {id} = req.body;
  ReservedMsg.deleteOne({reserveid: id}, (err, res) => {
    console.log('delete reserved : ' + JSON.stringify(res));
  });
  res.redirect('/');
});

module.exports = router;
