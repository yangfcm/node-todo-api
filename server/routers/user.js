const express = require('express');
// const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const User = require('../models/user');
const authenticate = require('../middleware/authenticate');

const router = new express.Router();

router.post('/users', async (req, res) => {  // Sign up/Add a new user
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user); // token is saved in HTTP header 'x-auth' property
  } catch(e) {
    res.status(400).send(e);
  } 
});

// router.get('/users', async(req, res) => {
//   try {
//     const users = await User.find({});
//     res.send({
//       users: users
//     });
//   } catch(e) {
//     res.status(400).send(e);
//   }
// });

router.get('/users/me', authenticate, (req, res) => {  // Get the current user
   res.send(req.user);
});

// router.get('/users/:id', async (req, res) => {   // Get a user by id
//   const id = req.params.id;
//   if(!ObjectID.isValid(id)) {   // Check if id provided is valid
//     return res.status(404).send();
//   }

//   try {
//     const user = await User.findById(id);
//     if(user) {
//       res.send({user: user});
//     } else {
//       res.status(404).send();
//     }
//   } catch(e) {
//     res.status(400).send(e);
//   }
// })

router.post('/users/login', async (req,res) => {   // User login
  const body = _.pick(req.body, ['email', 'password']);
  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/users/logout', authenticate, async (req, res) => {   // Logout current user
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(e) {
    res.status(400).send(e);
  } 
});

router.post('/users/all/logout', authenticate, async(req, res) => {
  try {
    await req.user.removeToken();
    res.status(200).send();
  } catch(e) {
    res.status(400).send(e);
  }
});

router.patch('/users/me', authenticate, async (req, res) => { // Update current user 
  const body = _.pick(req.body, ['username', 'email', 'password']);
  const updateFields = Object.keys(req.body);
  try {
    const { user } = req;
    
    updateFields.forEach((field) => {
      user[field] = body[field];
    });
    // const user = await User.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }); 
    await user.save();

    if(user) { 
      res.status(200).send(user);
    } else {
      res.status(404).send();
    }
  } catch(e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', authenticate, async (req,res) => {   // Delete current user
  try {
    await req.user.remove();
    res.send(req.user);
  } catch(e) {
    res.status(400).send(e);
  }
});


module.exports = router;