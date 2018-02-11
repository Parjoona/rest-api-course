// Hämtar enviroment beroende på test/develpment eller live
require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {
  ObjectID
} = require('mongodb');

// Local connection
const {
  mongoose
} = require('./db/connect');

// Models så ingenting går fel
const {
  Todo
} = require('./models/todo');
const {
  User
} = require('./models/user');
const {
  authenticate
} = require('./middleware/authenticate');

let port = process.env.PORT;

let app = express();

// Middleware, parsar json som pushas igenom
app.use(bodyParser.json());

/*

  TODOS

*/
// Push to site
app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  // Använder .save från mongoose
  todo.save().then((doc) => {
    // Sickar iväg todo som HTTP request
    res.send(doc);
  }, (e) => {
    res.status(400).send(e)
  });
});

// Hämtar alla todos
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    // skickar tillbaka todos som objekt
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

// Hämtar spesifika todos beroende på id
app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  // Lämnar funktionen om det inte existerar någon med den id
  if (!ObjectID.isValid(id)) return res.status(404).send();

  // Mongoose findbyid och skicka tillbaka den todoen
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({
      todo
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// deletear todo med id
app.delete('/todos/:id', authenticate, async (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) return res.status(404).send();

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    })
    if (!todo) return res.status(404).send();
    res.send({
      todo
    });
  } catch (e) {
    res.status(400).send()
  }
});

// Updaterar todo
app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  // picks out what i want to update, specific from the req.body.
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) return res.status(404).send();
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({
      todo
    });
  }).catch((e) => {
    res.status(400).send()
  });
});

/*

  USERS

*/

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token)
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.post('/users', async (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  // User = model method / all
  // user = instance method / singular

  try {
    await user.save
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send()
  }
})

app.get('/users/me', authenticate, (req, res) => {
  // Gets token from "me"
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  try {
    const user = await User.findByCredentials(body.email, body.password)
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send()
  }
});

app.listen(port);

module.exports = {
  app
};