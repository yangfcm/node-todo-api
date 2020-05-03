const mongoose = require("mongoose");

mongoose.Promise = global.Promise; // Use JS inherited Promise
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = mongoose;
