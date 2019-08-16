const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Todo = require('./todo');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },  
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

/** Map a user to todos created by the user */
UserSchema.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: '_creator'
});

UserSchema.methods.generateAuthToken = async function() {
  const user = this;  // 'this' refers to user instance
  const access = 'auth';
  const token = jwt.sign(
    { _id: user._id.toString(), access }, 
    process.env.JWT_SECRET,
    { expiresIn: '7 days'}
  ).toString();

  user.tokens = user.tokens.concat([{
    access, 
    token
  }]);

  await user.save();
  return token;
};

UserSchema.methods.removeToken = async function(token) {  // Remove the token for a specific user
  const user = this;
  if(!token) {
    user.tokens = [];
    await user.save();
    return;
  }
  user.tokens = user.tokens.filter((item) => {
    return item.token !== token
  });
  await user.save();
};

UserSchema.methods.toJSON = function() {  
  // Overwrite toJSON method only to return _id, email and username properties of user object
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'username', 'email']);
}

UserSchema.statics.findByToken = function(token) {
  // Find a user by token.
  const user = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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

UserSchema.statics.findByCredentials = async function(email, password) {
  const User = this;
  const user = await User.findOne({ email });

  if(!user) {
    throw new Error('Bad credntials: Fail to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    throw new Error('Bad credntials: Fail to login');
  }
  return user; 
};

UserSchema.pre('save', async function(next) {
  const user =this;

  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
    // bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(user.password, salt, (err, hash) => {
    //     user.password = hash;
    //     next();
    //   });
    // });
  }
});

// Delete user tasks when the user is deleted
UserSchema.pre('remove', async function(next) {
  const user = this; 
  await Todo.deleteMany({_creator: user._id});
});

const User = mongoose.model('User', UserSchema);

module.exports = User;