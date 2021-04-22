const mongoose = require('mongoose');
const {Schema} = mongoose;

const albumSchema = new Schema({
  roomname: {
    type: String,
    require: true,
  },
  albums: {
    type: Object,
    // albumid : albumid, name, thumbnail img
    require: true,
  },
  changedalbum: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('album', albumSchema);
