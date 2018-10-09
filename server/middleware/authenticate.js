const User = require('../models/user');

const authenticate = (req, res, next) => {
  // User authentication: obtain x-auth token in http header returned by API.
  // With the token, find its corresponding user and return the user object.
  const token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user) {
      res.status(401).send(e);
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(e);
  });
};

module.exports = authenticate;