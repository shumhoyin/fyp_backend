const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
username: {
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
  hashedPassword: {
    type: String,
    required: true
  },
//   role: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: Number,
//     required: true
//   },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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
