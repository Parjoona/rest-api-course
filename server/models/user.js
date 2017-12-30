const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// CUT OF WHAT WE ACTUALLY NEEDS, NOT INCLUDING TOKENS
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

UserSchema.statics.findByToken = function(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, 'secretword')
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  // this = USERS
  return this.findOne({email}).then((user) => {
    if (!user) return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        (true) ? resolve(user) : reject();
      });
    });
  });
};

// Mongoose middleware!
// Checks if password has been changed
UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let User = mongoose.model('User', UserSchema);

module.exports = {
  User
}
