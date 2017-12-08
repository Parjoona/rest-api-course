const {
  MongoClient,
  ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Error in connecting to server');
  }

  updateOne(db, '5a2b0da05c64c949bcd2b301');

});

// Find one and update
function updateOne(db, id) {
  // Use update operators on mongoDB
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID(id)
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })
}

// Find one and update
function incrementOne(db, id) {
  // Use update operators on mongoDB
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID(id)
  }, {
    $inc: {
      // Increments value by one
      value: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })
}
