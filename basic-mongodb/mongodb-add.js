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
  addTodo(db, 'Showing of computer', false);

  db.close();
});

function addTodo(db, text, state) {
  let obj = {
    text,
    completed: state
  }

  db.collection('Todos').insert(obj, (err, result) => {
    if (err) {
      return console.log('could not create');
    }
    console.log(JSON.stringify(result.ops, null, 2));
  });
}
