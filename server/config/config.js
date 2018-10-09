const env = process.env.NODE_ENV || 'development';

if(env === 'development') { // Seperate development database and test database
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/todo-api';
} else if(env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/todo-api-test';
}
// In production environment(i.e. Heroku),
// process.env.PORT and process.env.MONGODB_URI are set by Heroku
// So we don't need to set the two variables in config.js file.