const request = require('supertest');
const expect = require('expect');
const {
  ObjectID
} = require('mongodb');

const {
  app
} = require('./../server');
const {
  Todo
} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first todo'
  },
  {
    _id: new ObjectID(),
    text: 'second todo'
  }
];

// Deletes all old ones
// beforeEach((done) => {
//   Todo.remove({}).then(() => done());
// });

beforeEach((done) => {
  Todo.remove({}).then(() => {
    // Returns object
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    let text = 'Test text';

    // Requests express connection from server.js
    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done)
  });

  it('Should return 404 if todo not found', (done) => {
    let hex = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hex}`)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for non-object id', (done) => {
    request(app)
      .get(`/todos/123123`)
      .expect(404)
      .end(done)
  })
});

describe('DELETE /todos/:id', () => {
  it('Should remove an id', (done) => {
    let hex = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hex}`)
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

  it('If no none exist, 404', (done) => {
    let hex = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hex}`)
      .expect(404)
      .end(done)
  });

  it('if invalid ID, 404', (done) => {
    request(app)
      .delete(`/todos/123123`)
      .expect(404)
      .end(done)
  });
});
