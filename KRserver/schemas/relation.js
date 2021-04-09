const mongoose = require('mongoose');
const {Schema} = mongoose;

const relationSchema = new Schema({
  man: {
    type: String,
    require: true,
  },
  woman: {
    type: String,
    require: true,
  },
  startdate: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model('relation', relationSchema);
