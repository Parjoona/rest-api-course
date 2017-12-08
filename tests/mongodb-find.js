const {
  MongoClient,
  ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Error in connecting to server');
  }

  // find = query
  // find({name: 'blabla'})
  findPerson(db, 'NextOne')

  db.close();
});

// Kan ta användning för att få tag på objectID för senare bruk.
// let objID = new ObjectID();
// console.log(objID);

function findAmount(db) {
  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log(err)
  });
}

function findById(db, id) {
  db.collection('Todos').find({
    _id: new ObjectID(id)
  }).toArray().then((result) => {
    console.log('Todos');
    console.log(JSON.stringify(result, null, 2));
  }, (err) => {
    console.log(err)
  });
}

function findPerson(db, name) {
  db.collection('Todos').find({
    name
  }).toArray().then((result) => {
    console.log('Todos');
    console.log(JSON.stringify(result, null, 2));
  }, (err) => {
    console.log(err)
  });
}
