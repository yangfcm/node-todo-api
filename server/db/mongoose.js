const mongoose = require('mongoose');

mongoose.Promise = global.Promise;  // Use JS inherited Promise
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

module.exports = mongoose;