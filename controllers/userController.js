const express = require('express');

const bcrypt = require('bcrypt'); //password handler

//call mongodb user model
const User = require('../models/userModel');

const userRouter = express();

userRouter.post('/signup', (req, res) => {
  let { fullName, email, password } = req.body;
  fullName = fullName.trim();

  email = email.trim();
  password = password.trim();

  if (fullName == '' || email == '' || password == '') {
    res.json({
      status: 'FAILED',
      message: 'Please fill all the fields',
    });
  } else if (!/^[a-zA-Z ]*$/.test(fullName)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid name entered',
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid email entered',
    });
  } else if (password.length < 6) {
    res.json({
      status: 'FAILED',
      message: 'Password must be atleast 6 characters',
    });
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.json({
            status: 'FAILED',
            message: 'Email already exists',
          });
        } else {
          // Create a new user

          //password handling
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
              });

              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: 'SUCCESS',
                    message: 'User Signup successfully',
                    user: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: 'FAILED',
                    message: 'An error occurred while saving user',
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: 'FAILED',
                message: 'An error occurred while hashing password',
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 'FAILED',
          message: 'An error occurred while checking for user existence',
        });
      });
  }
});

userRouter.post('/login', (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  if (email == '' || password == '') {
    res.json({
      status: 'FAILED',
      message: 'Please enter credentials',
    });
  } else {
    //check user existence
    User.find({ email: req.body.email })
      .then((data) => {
        if (data.length) {
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((user) => {
              if (user) {
                //password matched
                res.json({
                  status: 'SUCCESS',
                  message: 'Login Successful',
                  user: data,
                });
              } else {
                res.json({
                  status: 'FAILED',
                  message: 'Invalid password entered!',
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: 'FAILED',
                message: 'An error occurred while comparing password',
              });
            });
        } else {
          res.json({
            status: 'FAILED',
            message: 'Invalid Credentials entered',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: 'FAILED',
          message: 'An error occurred while comparing credentials',
        });
      });
  }
});

module.exports = userRouter;
