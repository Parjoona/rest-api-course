const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/connect');
const { Todo } = require('./../server/models/todo');

// ObjectId("5a31a216fbef8023106187d0")
let id = '5a31a216fbef8023106187d0';

if (!ObjectID.isValid(id)) {
  console.log('Not a valied ID');
}

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  if (!todo) return console.log('No todo');
  console.log('Todo', todo);
});
