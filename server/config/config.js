const env = process.env.NODE_ENV || 'development';

if(env === 'development') { // Seperate development database and test database
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/todo-api';
} else if(env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/todo-api-test';
}
// In production environment(i.e. Heroku). process.env.PORT and process.env.MONGODB_URI
// are set by Heroku