const mongoose = require('mongoose');
const {Schema} = mongoose;

const chatSchema = new Schema({
  roomname: {
    type: String,
    require: true,
  },
  chat: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model('chat', chatSchema);
