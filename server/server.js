require('./config/config.js');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user');
const todoRouter = require('./routers/todo');

const app = express();

app.use(bodyParser.json());
app.use(userRouter);
app.use(todoRouter);

app.listen(process.env.PORT, () => {
  console.log(`Node-todo API is running on port ${process.env.PORT}...`);
});

module.exports = app;