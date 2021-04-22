const mongoose = require('mongoose');
const {Schema} = mongoose;

const relationSchema = new Schema({
  persons: {
    type: Array,
    require: true,
  },
  firstp: {
    type: String,
    require: true,
  },
  secondp: {
    type: String,
    require: true,
  },
  startdate: {
    type: Date,
    require: true,
  },
  roomname: {
    type: String,
    require: true,
  },
  nicknames: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model('relation', relationSchema);
