const express = require("express");
const ObjectID = require("mongodb").ObjectID;
const _ = require("lodash");

const Todo = require("../models/todo");
const authenticate = require("../middleware/authenticate");

const router = new express.Router();

/**
 * Create a todo task
 */
router.post("/todos", authenticate, async (req, res) => {
  const todo = new Todo({
    task: req.body.task,
    description: req.body.description,
    _creator: req.user._id,
  });

  try {
    await todo.save();
    res.send(todo);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Get all todos created by current user
 */
router.get("/todos", authenticate, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true" ? true : false;
  }

  if (req.query.sortby && req.query.order) {
    // Sorting todos
    sort[req.query.sortby] = req.query.order === "1" ? 1 : -1;
    // 1 - ascending, -1 - descending
  }

  try {
    await req.user
      .populate({
        path: "todos",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.todos);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Get a todo by id under the current user
 */
router.get("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    // Check if id provided is valid
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOne({ _id: id, _creator: req.user._id });
    if (todo) {
      res.send({ todo: todo });
    } else {
      res.status(404).send();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Delete a todo with the id created by current user
 */
router.delete("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    // Check if id provided is valid
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id,
    });
    if (todo) {
      res.send({ todo: todo });
    } else {
      res.status(404).send();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * Update a task with the id created by current user
 */
router.patch("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, [
    "task",
    "description",
    "completed",
    "completedAt",
  ]);
  const updateFields = Object.keys(req.body);

  if (!ObjectID.isValid(id)) {
    // Check if id provided is valid
    return res.status(404).send();
  }

  try {
    // const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, { new: true, runValidators: true });
    const todo = await Todo.findOne({ _id: id, _creator: req.user._id });
    updateFields.forEach((field) => {
      todo[field] = body[field];
    });

    if (todo.completed === true) {
      // If completed property is updated from false to true, then
      // automatically update completedAt property to current timestamp.
      const currentTimeStamp = todo.completedAt
        ? todo.completedAt
        : new Date().getTime();
      todo.completedAt = currentTimeStamp;
    }
    if (todo.completed === false) {
      // Otherwise, set completed property to false and completedAt to null
      todo.completed = false;
      todo.completedAt = null;
    }
    await todo.save();

    if (todo) {
      res.send({ todo: todo });
    } else {
      res.status(404).send();
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
