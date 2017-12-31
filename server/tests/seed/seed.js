const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
  _id: userOneID,
  email: 'example@example.com',
  password: 'Passwordnr1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userOneID,
      access: 'auth'
    }, 'secretword').toString()
  }]
}, {
  _id: userTwoID,
  email: 'hello@example.com',
  password: 'Passwordnr2',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userTwoID,
      access: 'auth'
    }, 'secretword').toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

const todos = [{
    _id: new ObjectID(),
    text: 'first todo',
    _creator: userOneID
  },
  {
    _id: new ObjectID(),
    text: 'second todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoID
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    // Returns object
    return Todo.insertMany(todos);
  }).then(() => done());
}

module.exports = {
  users,
  populateUsers,
  todos,
  populateTodos
};
