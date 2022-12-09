const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// home route
const homeRouter = require("./routes/homeRouter");

app.use("/", homeRouter);

// starting server
app.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});
