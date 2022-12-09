const express = require("express");
const app = express();


//MONGODB
require('./config/db');

//accepting post from  data
const bodyparser = require('express').json;
app.use(bodyparser());

//user routes
const userRouter = require("./controllers/userController");


// home route
const homeRouter = require("./routes/homeRouter");


app.use('/', homeRouter);
app.use('/user', userRouter);



// starting server
app.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});
