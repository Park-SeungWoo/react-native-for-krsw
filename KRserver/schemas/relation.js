const mongoose = require('mongoose');
const {Schema} = mongoose;

const relationSchema = new Schema({
  persons: {
    type: Array,
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
});

module.exports = mongoose.model('relation', relationSchema);
