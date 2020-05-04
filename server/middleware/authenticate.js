const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * User authentication: obtain x-auth token in http header returned by API.
 * With the token, find its corresponding user and return the user object.
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("x-auth").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    // const user = await User.findByToken(token);

    if (!user) {
      throw new Error("User authenticated failed");
    }
    req.user = user;
    req.token = token;
    next();
    // User.findByToken(token).then((user) => {
    //   if(!user) {
    //     res.status(401).send(e);
    //   }
    //   req.user = user;
    //   req.token = token;
    //   next();
  } catch (e) {
    res.status(401).send(e.message);
  }
};

module.exports = authenticate;
