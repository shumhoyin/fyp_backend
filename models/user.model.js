const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
userName: {
        type: String,
        required: true,
        unique: true,
      },
  email: {
    type: String,
    required: true,
    unique:true,
    // Regexp to validate emails
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  userPassword: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userIcon:{
    type: String,
    required:true,
    default: 'this is a user image location path'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user_info', UserSchema);
