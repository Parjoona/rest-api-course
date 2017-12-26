const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/connect');
const { Todo } = require('./../server/models/todo');

if (!ObjectID.isValid(id)) {
  console.log('Not a valied ID');
}

// Todo.remove ALL
// Todo.remove({
// }).then((res) => {
//   console.log(res);
// });

Todo.findOneAndRemove({_id: 'IDNUM'}).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove('IDNUM').then((todo) => {
  console.log(todo);
});
