const {
  MongoClient,
  ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Error in connecting to server');
  }

  // Delete many (duplicates)
  function deleteMany(db, textDel) {
    db.collection('Todos').deleteMany({
      text: textDel
    }).then((result) => {
      console.log(result);
    })
  }
  // Delete one
  function deleteOne(db, textDel) {
    db.collection('Todos').deleteOne({
      text: textDel
    }).then((result) => {
      console.log(result);
    })
  }
  // Find specific and delete it
  function deleteSpecific(db, textDel) {
    db.collection('Todos').findOneAndDelete({
      completed: true
    }).then((result) => {
      console.log(result);
    })
  }
});
