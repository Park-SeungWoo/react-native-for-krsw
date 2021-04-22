const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  sex: {
    type: String,
    require: true,
  },
  phonenum: {
    type: String,
    require: true,
  },
  birthday: {
    type: Date,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  id: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    require: true,
  },
  avartar: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model('user', userSchema);
