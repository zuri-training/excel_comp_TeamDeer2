const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// home route
const homeRouter = require("./routes/homeRouter");
//const userRouter = require("./routes/userRouter");

app.use("/", homeRouter);
//app.use("/users", userRouter);
// starting server
app.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});
