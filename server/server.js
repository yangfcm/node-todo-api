require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {  // Create a new todo
  const todo = new Todo({
    task: req.body.task
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => { // Get all todos
  Todo.find().then((todos) => {
    res.send({todos: todos});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {   // Get a todo by its id
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {   // Check if id provided is valid
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {  // ... then attempt to find a todo
    if(todo) {
      res.send({todo: todo});
    } else {
      res.status(404).send({});
    }
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/todos/:id', (req, res) => {  // Delete a todo by its id
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {   // Check if id provided is valid
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {  // ... then attempt to delete a todo
    if(todo) {
      res.send({todo: todo});
    } else {
      res.status(404).send({});
    }
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.patch('/todos/:id', (req, res) => {   // Update a todo by its id
  const id = req.params.id;
  const body = _.pick(req.body, ['task', 'completed']);

  if(!ObjectID.isValid(id)) {   // Check if id provided is valid
    return res.status(404).send();
  }

  if(body.completed === true) {
    // If completed property is updated from false to true, then 
    // automatically update completedAt property to current timestamp.
    const currentTimeStamp = new Date().getTime();
    body.completedAt = currentTimeStamp;
  } else {
    // Otherwise, set completed property to false and completedAt to null
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, { new: true }).then((todo) => {
    if(todo) {
      res.send({todo: todo});
    } else {
      res.status(404).send();
    }
  }).catch((e) => {
    res.status(400).send();
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Node-todo API is running on port ${process.env.PORT}...`);
});

module.exports = app;