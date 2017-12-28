const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    // Removes spaces in start or end
    trim: true,
    unique: true,
    validate: {
      validator: value => validator.isEmail(value),
      message: '{VALUE} is not a valid Email'
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Only exists in mongodb, not SQL
  // JSON web tokens
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// CUT OF WHAT WE ACTUALLY NEEDS, NOT TOKENS
UserSchema.methods.toJSON = function() {
  let userObject = this.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  let access = 'auth';
  let token = jwt.sign({
    _id: this._id.toHexString(),
    access
  }, 'secretword').toString();

  this.tokens = this.tokens.concat([{
    access,
    token
  }]);

  return this.save().then(() => {
    return token;
  });
};

let User = mongoose.model('User', UserSchema);

module.exports = {
  User
}
