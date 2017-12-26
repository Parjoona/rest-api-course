const mongoose = require('mongoose');

// Makes our connection Promise based
mongoose.Promise = global.Promise;
// Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = mongoose;
