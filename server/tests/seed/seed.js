const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const Todo = require('../../models/todo');
const User = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const usersForTest = [{
  _id: userOneId,
  username: 'foo',
  email: 'foo@bar.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  username: 'test jack',
  email: 'jack@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const todoOneId = new ObjectID();
const todoTwoId = new ObjectID();
const todosForTest = [{
  _id: todoOneId,
  task: 'First test todo',
  _creator: userOneId
}, {
  _id: todoTwoId,
  task: 'Second test todo',
  completed: true,
  completedAt: 123,
  _creator: userTwoId
}];


const populateTodos = async () => {
  // Clear Todo collection and insert test data before each test case
  await Todo.deleteMany();
  await Todo.insertMany(todosForTest);
};

const populateUsers = async() => {
  await User.deleteMany();
  await new User(usersForTest[0]).save();
  await new User(usersForTest[1]).save();
};

module.exports = {
  todosForTest, 
  populateTodos, 
  usersForTest, 
  populateUsers
};
