const express = require("express");

const bcrypt = require("bcrypt"); //password handler

const jwt = require("jsonwebtoken"); //jwt for authentication
const maxAge = 3 * 24 * 60 * 60;

const nodemailer = require("nodemailer"); //for sending mails

//call mongodb user model
const User = require("../models/userModel");

const userRouter = express();

//function to create token
const createToken = (id) => {
  return jwt.sign({ id }, "excel_comp_teandeer2");
};

//mailService
const { trans } = require("./mailService");

userRouter.post("/signup", (req, res) => {
  let { fullName, email, password } = req.body;
  fullName = fullName.trim();

  email = email.trim();
  password = password.trim();

  if (fullName == "" || email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Please fill all the fields",
    });
  } else if (!/^[a-zA-Z ]*$/.test(fullName)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if (password.length < 6) {
    res.json({
      status: "FAILED",
      message: "Password must be atleast 6 characters",
    });
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.json({
            status: "FAILED",
            message: "Email already exists",
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
                  res.status(200).json({
                    status: "SUCCESS",
                    message: "User Signup successfully",
                    user: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "An error occurred while saving user",
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing password",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for user existence",
        });
      });
  }
});

userRouter.post("/login", (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Please enter credentials",
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
                //send a web token to verify if user is logged in during subsequent request from the same user
                const token = createToken(data[0]._id);
                res.cookie("jwt", token, {
                  httpOnly: true,
                  maxAge: maxAge * 1000,
                });

                //password matched
                res.status(200).json({
                  status: "SUCCESS",
                  message: "Login Successful",
                  user: data,
                });
              } else {
                res.status(400).json({
                  status: "FAILED",
                  message: "Invalid password entered!",
                });
              }
            })
            .catch((err) => {
              console.log(err.message);
              res.status(400).json({
                status: "FAILED",
                message: "An error occurred while comparing password",
              });
            });
        } else {
          res.status(400).json({
            status: "FAILED",
            message: "Invalid Credentials entered",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          status: "FAILED",
          message: "An error occurred while comparing credentials",
        });
      });
  }
});

userRouter.post("/forgot-password", async (req, res) => {
  let { email } = req.body;

  email = email.trim();

  if (email == "") {
    res.status(400).json({
      status: "FAILED",
      message: "Please enter credentials",
    });
  }

  try {
    //find user in the db by either email or password
    const user = await User.findOne({ email });

    //check if user exists on our database
    if (!user) {
      res.status(400).json({
        status: "FAILED",
        message: "User doesn't Exist on our Database",
      });
    }
    //generate reset token
    const resetToken = Math.floor(1000 + Math.random() * 9000);

    //hash token and save as new password for user
    const hashedResetToken = await bcrypt.hash(resetToken.toString(), 10);

    user.password = hashedResetToken;

    user
      .save()
      .then((result) => {
        res.status(200).json({
          status: "SUCCESS",
          message: "Reset Token sent successfully",
          user: result,
        });
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occurred while updating password",
        });
      });

    //if user exists, send mail to the user with token to set new passWord
    let mailOptions = {
      from: "lfawas6@gmail.com",
      to: email,
      subject: "Excel_comp Password Reset",
      text: `This is you Comp_excel reset token ${resetToken}`,
    };

    //send mail
    const mail = await trans(mailOptions);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "FAILED",
      message: "An error was encountered while trying to send a reset token!",
    });
  }
});

userRouter.post("/setNewPassword", async (req, res) => {
  let { email, token, newPassword, confirmPassword } = req.body;

  newPassword = newPassword.trim();
  confirmPassword = confirmPassword.trim();
  email = email.trim();

  //validate token

  //validate password and token
  if (
    email == "" ||
    token == "" ||
    newPassword == "" ||
    confirmPassword == ""
  ) {
    res.json({
      status: "FAILED",
      message: "Please fill all the fields",
    });
  } else if (newPassword.length < 6) {
    res.json({
      status: "FAILED",
      message: "Password must be atleast 6 characters",
    });
  } else if (confirmPassword !== newPassword) {
    res.status(400).json({
      message: "Passwords do not match",
    });
  }

  try {
    //verify the token by hashing it and finding it in the db
    const password = await bcrypt.hash(newPassword.toString(), 10);

    const user = await User.findOne({ email });

    if (user.length == 0) {
      res.status(400).json({
        status: "FAILED",
        message: "Invalid email",
      });
    }

    const hashedPassword = user.password;

    //if found and token is valid, update record with new password

    bcrypt
      .compare(token, hashedPassword)
      .then((data) => {
        if (data) {
          user.password = password;
          console.log(user);
          user
            .save()
            .then((result) => {
              res.status(200).json({
                status: "SUCCESS",
                message: "Password reset successfully",
                user: result,
              });
            })
            .catch((err) => {
              res.status(400).json({
                status: "FAILED",
                message: "An error occurred while resetting password",
              });
            });
        } else {
          //when token is not valid
          res.status(400).json({
            status: "FAILED",
            message: "Token Invalid",
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
        res.status(400).json({
          message: "Invalid Token",
        });
      });

    //if not found then token is invalid
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: "An error was Encountered",
    });
  }
});

module.exports = userRouter;
