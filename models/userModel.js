const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const uerScheme = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', uerScheme);

module.exports = User;
