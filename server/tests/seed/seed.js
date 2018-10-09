const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const Todo = require('../../models/todo');
const User = require('../../models/user');

const todosForTest = [{
  task: 'First test todo'
}, {
  task: 'Second test todo',
  completed: true,
  completedAt: 123
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const usersForTest = [{
  _id: userOneId,
  email: 'foo@bar.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'secret_value').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jack@example.com',
  password: 'userTwoPass'
}];

const populateTodos = (done) => {
  // Clear Todo collection and insert test data before each test case
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todosForTest);
  }).then(() => {
    done();
  });
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(usersForTest[0]).save();
    const userTwo = new User(usersForTest[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => {
    done();
  });
};

module.exports = {todosForTest, populateTodos, usersForTest, populateUsers};
