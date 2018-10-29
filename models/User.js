const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create UserSchema
let userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  passResetKey: String,
  passKeyExpires: Number
}, {runSettersOnQuery: true});


userSchema.pre('save', function (next) {
  this.email = this
    .email
    .toLowerCase(); // ensure email are in lowercase

  next();

})

var user = mongoose.model('user', userSchema);

module.exports = user;