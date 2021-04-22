const mongoose = require('mongoose');
const {Schema} = mongoose;

const albumimgSchema = new Schema({
  albumid: {
    type: String,
    require: true,
  },
  images: {
    type: Array,
    // img id, img src, saved
    require: true,
  },
  changedimg: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('albumimg', albumimgSchema);
