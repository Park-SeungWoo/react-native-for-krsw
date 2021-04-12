const mongoose = require('mongoose');
const {Schema} = mongoose;

const relationSchema = new Schema({
  reqid: {
    type: String,
    require: true,
  },
  reqname: {
    type: String,
    require: true,
  },
  resid: {
    type: String,
    require: true,
  },
  resname: {
    type: String,
    require: true,
  },
  startdate: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model('temprelation', relationSchema);
