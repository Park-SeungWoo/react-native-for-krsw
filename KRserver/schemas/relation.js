const mongoose = require('mongoose');
const {Schema} = mongoose;

const relationSchema = new Schema({
  firstperson: {
    type: String,
    require: true,
  },
  secondperson: {
    type: String,
    require: true,
  },
  startdate: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model('relation', relationSchema);
