const mongoose = require('mongoose');

// Makes our connection Promise based
mongoose.Promise = global.Promise;
// Connection
mongoose.connect(process.env.MONGODB_URI);

module.exports = mongoose;

// process.env.NODE_ENV == 'production or development or test'
