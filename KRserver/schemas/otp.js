const mongoose = require('mongoose');
const {Schema} = mongoose;

const otpSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  id: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('otp', otpSchema);
