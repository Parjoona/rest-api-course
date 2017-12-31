const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const {
  users,
  populateUsers,
  todos,
  populateTodos
} = require('./seed/seed');

// Deletes all old ones
// beforeEach((done) => {
//   Todo.remove({}).then(() => done());
// });
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    let text = 'Test text';

    // Requests express connection from server.js
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      // Pushes into the /todos 'tab' with experiment text
      .send({
        text
      })
      // Hopes to get 200 (OK!) back
      .expect(200)
      // Checks if our callbacks text is the same as ours
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({
          text
        }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done)
  });

  it('Should not return other persons doc', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('Should return 404 if todo not found', (done) => {
    let hex = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hex}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for non-object id', (done) => {
    request(app)
      .get(`/todos/123123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
});

describe('DELETE /todos/:id', () => {
  it('Should remove an id', (done) => {
    let hex = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hex}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hex);
      })
      .end((err, res) => {
        if (err) return done(err);
        Todo.findById(hex).then((todo) => {
          expect(todo).toBeNull();
          done();
        }).catch((e) => done(e));
      })
  });

  it('Should not be able to remove todo', (done) => {
    let hex = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hex}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        Todo.findById(hex).then((todo) => {
          expect(todo).not.toBeNull();
          done();
        }).catch((e) => done(e));
      })
  })

  it('If no none exist, 404', (done) => {
    let hex = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hex}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('if invalid ID, 404', (done) => {
    request(app)
      .delete(`/todos/123123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });
});

describe('UPDATE /todos/:id', () => {
  it('Should update the todo', (done) => {
    let hex = todos[0]._id.toHexString();
    let text = 'text from test hello';

    request(app)
      .patch(`/todos/${hex}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
      })
      .end(done)
  });

  it('Should clear completedAt if not completed', (done) => {
    let hex = todos[0]._id.toHexString();
    let text = 'text from test hello';

    request(app)
      .patch(`/todos/${hex}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
      })
      .end(done)
  });
});

describe('GET /users/me', () => {
  it('Should return user if authent', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should create user', (done) => {
    let email = 'example@exameheaple.com';
    let password = 'Passwordnr1112';
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBe(undefined);
        expect(res.body._id).not.toBe(undefined);
        expect(res.body.email).toBe(email);
      })
      .end(err => done(err));

    User.findOne({
      email
    }).then((user) => {
      expect(user).toBeDefined();
      expect(user.password).toBeDefined();
      done();
    });
  });

  it('Should return validator error', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'heloea',
        password: '21321yh4q'
      })
      .expect(400)
      .end(done);
  });

  it('It should not create user if email is used', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Passwordnr1'
      })
      .expect(400)
      .end(done);
  });
})

describe('POST /users/logn', () => {
  it('Should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password,
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toBeDefined
          done();
        }).catch(e => done(e));
      });
  });

  it('Should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '111111'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err, res) => {
        if (err) return done(err)

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(e => done(e));
      });
  });
});
