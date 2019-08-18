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
  description: 'Description for first todo',
  _creator: userOneId
}, {
  _id: todoTwoId,
  task: 'Second test todo',
  description: 'Description for second todo',
  completed: true,
  completedAt: 123,
  _creator: userTwoId
}];

const seed = async() => {
  await Todo.deleteMany();
  await User.deleteMany();
  
  // await Todo.insertMany(todosForTest);
  await new Todo(todosForTest[0]).save();
  await new Todo(todosForTest[1]).save();
  await new User(usersForTest[0]).save();
  await new User(usersForTest[1]).save();
  // await populateUsers();
  // await populateTodos();
}

module.exports = {
  todosForTest, 
  usersForTest,
  seed
};
