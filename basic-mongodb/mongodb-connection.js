const {
  MongoClient,
  ObjectID
} = require('mongodb');



function insertObject(database, obj) {
  MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
      return console.log('Error in connecting to server');
    }

    // First parameter, database placement
    // Sendond callback with error and db
    db.collection(database).insert(obj, (err, result) => {
      if (err) {
        return console.log('could not create');
      }
      console.log(JSON.stringify(result.ops, null, 2));
    });

    db.close();
  });
}

// Kan ta användning för att få tag på objectID för senare bruk.
// let objID = new ObjectID();
// console.log(objID);
