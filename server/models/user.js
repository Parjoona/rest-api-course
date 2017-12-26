const mongoose = require('mongoose');

let User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    // Removes spaces in start or end
    trim: true
  }
});

module.exports = {
  User
}
