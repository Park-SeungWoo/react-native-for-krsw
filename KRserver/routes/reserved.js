const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const ReservedMsg = require('../schemas/reservedmsg');

router.use(express.json());
router.use(morgan('dev'));

// validate id, pw
router.post('/set', (req, res, next) => {
  const {data, ToId, fromname, fromdate, roomname, reserveid} = req.body;
  const msg = new ReservedMsg({
    toid: ToId,
    fromname: fromname,
    data: data,
    fromdate: fromdate,
    sent: false,
    roomname: roomname,
    reserveid: reserveid,
  });
  msg.save();
  res.redirect('/');
});

module.exports = router;
