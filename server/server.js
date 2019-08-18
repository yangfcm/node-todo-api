const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log(`Node-todo API is running on port ${process.env.PORT}...`);
});