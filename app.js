const express = require("express");
const app = express();

//MONGODB
require("./config/db");

//accepting post from  data
const bodyparser = require("express").json;
app.use(bodyparser());

//user routes
const userRouter = require("./controllers/userController");

// home route
const homeRouter = require("./routes/homeRouter");

app.use("/", homeRouter);
app.use("/user", userRouter);

// // Connecting DB and starting server!
// const dbURI = MONGO_URI;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
