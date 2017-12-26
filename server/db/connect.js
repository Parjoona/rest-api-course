const mongoose = require('mongoose');

// Makes our connection Promise based
mongoose.Promise = global.Promise;
// Connection
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = mongoose;
