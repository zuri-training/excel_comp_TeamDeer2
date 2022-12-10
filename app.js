const express = require("express");
const app = express();
// const dotenv = require("dotenv");
// dotenv.config();
const mongoose = require("mongoose");

require("dotenv").config({ path: __dirname + "/.env" });
const { PORT, MONGO_URI } = process.env;

// home route
const homeRouter = require("./routes/homeRouter");
const User = require("./models/userModel");

app.use("/", homeRouter);

// Connecting DB and starting server!
const dbURI = MONGO_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log(`Server Up and running and listening on port ${PORT}!`);
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
