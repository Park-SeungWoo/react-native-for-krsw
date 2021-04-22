const mongoose = require('mongoose');
const {Schema} = mongoose;

const reservedmsg = new Schema({
  toid: {
    type: String,
    require: true,
  },
  data: {
    type: Object,
    require: true,
  },
  fromname: {
    type: String,
    require: true,
  },
  fromdate: {
    type: Date,
    require: true,
  },
  sent: {
    type: Boolean,
    require: true,
  },
  roomname: {
    type: String,
    require: true,
  },
  reserveid: {
    type: String,
    require: true,
  },
  toname: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('reservedmsg', reservedmsg);
