const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function() {
  const user = this;  // 'this' erfers to user model
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'secret_value').toString();

  user.tokens = user.tokens.concat([{
    access, 
    token
  }]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.toJSON = function() {  
  // Overwrite toJSON method only to return _id and email properties of user object
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.statics.findByToken = function(token) {
  // Find a user by token.
  const user = this;
  let decoded;
  try {
    decoded = jwt.verify(token, 'secret_value');
  } catch(e) {
    return new Promise((resolve, reject) => {
      reject({});
    });
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function(next) {
  const user =this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;