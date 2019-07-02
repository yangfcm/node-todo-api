const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const Todo = require('../models/todo'); 
const authenticate = require('../middleware/authenticate');

const router = new express.Router();

router.post('/todos', authenticate, async (req, res) => {  // Create a new todo
  const todo = new Todo({
    task: req.body.task,
    description: req.body.description,
    _creator: req.user._id
  });

  try {
    await todo.save();
    res.send(todo);
  } catch(e) {
    res.status(400).send(e);
  }
});

router.get('/todos', authenticate, async (req, res) => { // Get all todos
  try {
    const todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos });
  } catch(e) {
    res.status(400).send(e);
  }
});

router.get('/todos/:id', authenticate, async (req, res) => {   // Get a todo by its id
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {   // Check if id provided is valid
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOne({_id: id, _creator: req.user._id});
    if(todo) {
      res.send({todo: todo});
    } else {
      res.status(404).send();
    }
  } catch(e) {
    res.status(400).send(e);
  }
});

router.delete('/todos/:id', authenticate, async (req, res) => {  // Delete a todo by its id
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {   // Check if id provided is valid
    return res.status(404).send();
  }

  try {
    const todo = Todo.findOneAndRemove({_id: id, _creator: req.user._id});
    if(todo) {
      res.send({todo: todo});
    } else {
      res.status(404).send();
    }
  } catch(e) {
    res.status(400).send(e);
  }
});

router.patch('/todos/:id', authenticate, async (req, res) => {   // Update a todo by its id
  const id = req.params.id;
  const body = _.pick(req.body, ['task', 'description', 'completed', 'completedAt']);

  if(!ObjectID.isValid(id)) {   // Check if id provided is valid
    return res.status(404).send();
  }

  if(body.completed === true) {
    // If completed property is updated from false to true, then 
    // automatically update completedAt property to current timestamp.
    const currentTimeStamp = body.completedAt ? body.completedAt : new Date().getTime();
    body.completedAt = currentTimeStamp;
  } 
  if(body.completed === false) {
    // Otherwise, set completed property to false and completedAt to null
    body.completed = false;
    body.completedAt = null;
  } 

  try {
    const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, { new: true, runValidators: true });
    if(todo) {
      res.send({todo: todo});
    } else {
      res.status(404).send();
    }
  } catch(e) {
    res.status(400).send(e);
  }
});

module.exports = router;