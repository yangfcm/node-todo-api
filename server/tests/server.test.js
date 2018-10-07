const expect = require('expect');
const request = require('supertest');
const ObjectID = require('mongodb').ObjectID;

const app = require('../server');
const Todo = require('../models/todo');

const todosForTest = [{
  task: 'First test todo'
}, {
  task: 'Second test todo',
  completed: true,
  completedAt: 123
}];

beforeEach((done) => {
  // Clear Todo collection and insert test data before each test case
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todosForTest);
  }).then(() => {
    done();
  })
});

describe('POST /todos', () => {   // Test POST /todos
  it('Create a new todo successfully', (done) => {   // Test creating a new todo successfully
    const taskForTest = 'Test a todo';
    request(app)
      .post('/todos')
      .send({
        task: taskForTest
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.task).toBe(taskForTest);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({task: taskForTest}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].task).toBe(taskForTest);
          done();
        }).catch((err) => {
          return done(err);
        });
      });
  });

  it('Fail to create a new todo', (done) => {   // Test failing to create a new todo
    request(app)
      .post('/todos')
      .send({
        task: ''  // Attempt to post an invalid task to make the creation fail
      })
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => {
          return done(err);
        });
      });
  });
});   // End "Test POST /todos"

describe('GET /todos', () => {    // Test GET /todos
  it('Get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });

  it('Get a todo by id - Invalid id provided', (done) => {  
    // Test GET /todos/{invalid id}
    request(app)
      .get('/todos/invalid-todo-id')
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

  it('Get a todo by id - Valid id but no todo found', (done) => {
    // Test GET /todos/{valid id} but cannot find a todo by the id provided
    const randomId = new ObjectID();
    request(app)
      .get(`/todos/${randomId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);
  });

  it('Get a todo by id - Valid id and a todo found', (done) => {
    // Test Get /todos/{id}
    Todo.findOne({task: todosForTest[0].task}).then((todo) => {
      const todoId = todo._id;
      
      request(app)
      .get(`/todos/${todoId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toInclude({
          task: todosForTest[0].task,
          completed: false,
          completedAt: null,
          _id: todoId
        })
      })
      .end(done);
    });
  });
});

describe('DEL /todos/:id', () => {  // Test DEL /todos/:id
  it('Delete a todo by id - Invalid id provided', (done) => {
    request(app)
    .del('/todos/invalid-todo-id')
    .expect(404)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

  it('Delete a todo by id - Valid id but no todo found', (done) => {
    const randomId = new ObjectID();
    request(app)
      .del(`/todos/${randomId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done);
  });

  it('Delete a todo by id - Valid id and todo found and deleted', (done) => {
    Todo.findOne({task: todosForTest[0].task}).then((todo) => {
      const todoId = todo._id;
      
      request(app)
      .del(`/todos/${todoId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toInclude({
          task: todosForTest[0].task,
          _id: todoId
        });
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todoId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => {
          return done(err);
        });
      });
    });
  })
});

describe('PATCH /todos/:id', () => {  // test PATCH /todos/:id
  it('Update a todo', (done) => { // Update a todo's task and update it to completed 
    Todo.findOne({task: todosForTest[0].task}).then((todo) => {
      const todoId = todo._id;
      const taskUpdated = 'Updated from testing suite'
      request(app)
      .patch(`/todos/${todoId}`)
      .send({
        task: taskUpdated,
        completed: true
      })
      .expect(200)
      .expect((res) => {  // Test the response returned by API
        expect(res.body.todo).toInclude({ // Test task property is updated
          // and completed property is updated to true
          task: taskUpdated,
          completed: true
        });
        expect(res.body.todo.completedAt).toBeA('number');  // Test completedAt property is set to a number
      })
      .end((err, res) => {  // Test real data in database
        if(err) {
          return done(err);
        }
        Todo.findById(todoId).then((todo) => {
          expect(todo).toInclude({
            task: taskUpdated,
            completed: true
          });
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch((err) => {
          return done(err);
        });
      });
    });
  });

  it('Clear completedAt when todo is set not complete', (done) => {
    Todo.findOne({task: todosForTest[1].task}).then((todo) => {
      const todoId = todo._id;
      request(app)
      .patch(`/todos/${todoId}`)
      .send({
        completed: false
      })
      .expect(200)
      .expect((res) => {  // Test response returned from API
        expect(res.body.todo).toInclude({
          completed: false
        });
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {  // Test real data in database
        if(err) {
          return done(err);
        }
        Todo.findById(todoId).then((todo) => {
          expect(todo).toInclude({
            completed: false
          });
          expect(todo.completedAt).toNotExist();
          done();
        }).catch((err) => {
          return done(err);
        });
      })
    });
  });
});