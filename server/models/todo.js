const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  task: {
    type: String,
    required: true,
    minlength: [1, 'Task cannot be empty'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,  // Timestamp
    default: null
  }
});

module.exports = Todo;