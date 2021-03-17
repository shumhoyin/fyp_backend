const mongoose = require('mongoose')
const validator = require('validator');

const UserSchema = new mongoose.Schema({
userName: {
        type: String,
        required: true,
  unique: [true, 'That username is taken.'],
  validate: [validator.isAlphanumeric, 'Usernames may only have letters and numbers.']
      },
  email: {
    type: String,
    required: true,
    unique:true,
    // Regexp to validate emails,
    validate: [validator.isEmail, 'Please enter a valid email address.']
    // match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
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
    default: null
  },
  favouriteList:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'locations',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('user_infos', UserSchema);
